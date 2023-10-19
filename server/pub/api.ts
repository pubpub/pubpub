import { z } from 'zod';
import { Request, Express } from 'express';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initServer } from '@ts-rest/express';
import mime from 'mime-types';
import multer from 'multer';

import * as types from 'types';
import {
	type ImportCreatePubParams,
	type ImportMethod,
	type MetadataOptions,
	type ProposedMetadata,
} from 'utils/api/schemas/pub';

import { createPubAttribution } from 'server/pubAttribution/queries';
import { BadRequestError, ForbiddenError, NotFoundError } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { indexByProperty } from 'utils/arrays';
import { transformPubToResource } from 'deposit/transform/pub';
import { generateDoi } from 'server/doi/queries';
import { assert, expect } from 'utils/assert';
import { prepareResource } from 'deposit/datacite/deposit';
import { assertValidResource } from 'deposit/validate';
import { queryMany, queryOne } from 'utils/query';
import { createGetRequestIds } from 'utils/getRequestIds';
import { contract } from 'utils/api/contract';

import { getPubDraftDoc } from 'server/utils/firebaseAdmin';

import { writeDocumentToPubDraft } from 'server/utils/firebaseTools';
import { isDuqDuq, isProd } from 'utils/environment';
import { ensureUserIsCommunityAdmin } from 'utils/ensureUserIsCommunityAdmin';
import { getTmpDirectoryPath } from 'workers/tasks/import/tmpDirectory';
import { importFiles } from 'workers/tasks/import/import';
import { BaseSourceFile } from 'utils/api/schemas/import';
import { labelFiles } from 'client/containers/Pub/PubDocument/PubFileImport/formats';
import { omitKeys } from 'utils/objects';
import { uploadAndConvertImages } from 'utils/import/uploadAndConvertImages';
import { Pub } from './model';
import {
	canCreatePub,
	canDestroyPub,
	getUpdatablePubFields,
	managerUpdatableFields,
} from './permissions';
import { createPub, destroyPub, findPub, importToPub, updatePub } from './queries';
import { getPubsById, queryPubIds } from './queryMany';

extendZodWithOpenApi(z);

type ManyRequestParams = {
	query: Omit<types.PubsQuery, 'communityId'>;
	alreadyFetchedPubIds: string[];
	pubOptions: types.PubGetOptions;
};

const getManyQueryParams = <
	ReqB extends ManyRequestParams,
	A = any,
	B = any,
	C = any,
	D extends Record<string, any> = Record<string, any>,
	R extends Request<A, B, ReqB, C, D> = Request<A, B, ReqB, C, D>,
>(
	req: R,
): ManyRequestParams => {
	const { query, alreadyFetchedPubIds, pubOptions = {} } = req.body;
	const {
		collectionIds,
		excludeCollectionIds,
		excludePubIds,
		isReleased,
		limit = 50,
		offset = 0,
		ordering,
		scopedCollectionId,
		withinPubIds,
		term,
		submissionStatuses,
		relatedUserIds,
	} = query;
	return {
		pubOptions,
		alreadyFetchedPubIds,
		query: {
			collectionIds,
			excludeCollectionIds,
			excludePubIds,
			isReleased,
			limit,
			offset,
			ordering,
			scopedCollectionId,
			withinPubIds,
			term,
			submissionStatuses,
			relatedUserIds,
		},
	};
};
const getRequestIds = createGetRequestIds<{
	communityId?: string;
	collectionId?: string | null;
	pubId?: string;
	createPubToken?: string | null;
}>();

/**
 * We need to dynamically create the middleware in order to set a different temporary directory for each request, otherwise there's a chance that two requests will try to write to the same file.
 */
const createUploadMiddleware = async () => {
	const tmpDirPath = await getTmpDirectoryPath();

	const storage = multer.diskStorage({
		destination: (req, file, cb) => {
			// @ts-expect-error we are mutating baby
			req.tmpDir = tmpDirPath;
			cb(null, tmpDirPath);
		},
		filename: (req, file, cb) => {
			// Instead of using file.originalname, pull from req.body
			// This assumes that filenames are provided in pairs with files

			const f = req.body.filenames;

			// if only one filename is provided, req.body.filenames will be a string
			const suppliedFilename = Array.isArray(f) ? f.shift() : f;

			const filename = suppliedFilename ?? file.originalname;

			if (!filename) {
				throw new BadRequestError(
					new Error(
						'No filename provided, either in the body or as the original filename.\n Check the order of your files and filenames, filenames should come before the files they refer to.',
					),
				);
			}

			if (file.mimetype === 'application/octet-stream') {
				const mimeType = mime.contentType(filename);
				if (mimeType) {
					file.mimetype = mimeType;
				}
			}

			cb(null, suppliedFilename || file.originalname);
		},
	});

	const upload = multer({ storage }).array('files');
	return upload;
};

const convertFiles = async ({ files, tmpDir }: ConvertInput) => {
	const sourceFilesFromNormalFiles = (files as Express.Multer.File[]).map(
		(file): BaseSourceFile & { tmpPath: string } => ({
			clientPath: file.filename ?? file.originalname,
			tmpPath: file.path,
			state: 'complete',
			loaded: file.size,
			total: file.size,
		}),
	);

	const uploadedAndConvertedFiles = await uploadAndConvertImages(
		sourceFilesFromNormalFiles,
		tmpDir,
	);
	const labeledFiles = labelFiles(uploadedAndConvertedFiles);

	return importFiles({
		sourceFiles: labeledFiles,
		importerFlags: {},
		tmpDirPath: tmpDir,
	});
};

function addAttributionsToPub({
	pubId,
	attributions,
	existingAttributions = [],
	shouldMatchUsers = true,
}: {
	pubId: string;
	attributions: { name: string; mostLikelyUserId?: string }[];
	existingAttributions?: types.PubAttribution[];
	shouldMatchUsers?: boolean;
}) {
	return Promise.all(
		attributions
			.filter(
				(attr) =>
					!existingAttributions.some(
						(existingAttr) =>
							shouldMatchUsers && existingAttr.userId === attr.mostLikelyUserId,
					),
			)
			.map(async (attribution, idx) => {
				const { name, mostLikelyUserId } = attribution;
				const pubAttribution = await createPubAttribution({
					pubId,
					order: 1 / 2 ** idx,
					...(shouldMatchUsers && mostLikelyUserId
						? { userId: mostLikelyUserId }
						: {
								name,
						  }),
				});

				return pubAttribution as types.PubAttribution;
			}),
	);
}

const getDetectedParamsToUpdate = ({
	proposedMetadata,
	pubCreateParams,
	overrides,
	overrideAll,
}: {
	proposedMetadata: ProposedMetadata;
	pubCreateParams?: ImportCreatePubParams;
	overrides?: MetadataOptions['overrides'];
	overrideAll?: MetadataOptions['overrideAll'];
}) => {
	const detectedMetadata = omitKeys(proposedMetadata, ['attributions', 'metadata']);

	const fieldToOverrideWithDetected = Array.isArray(overrides) ? overrides : [overrides];

	const newParams = Object.entries(detectedMetadata).reduce((acc, [key, val]) => {
		// if we're creating a pub we always want to use the proposed metadata
		// if the user hasn't specified a value for this field
		if (pubCreateParams && !(key in acc)) {
			acc[key] = val;
			return acc;
		}

		// this value has been specified by the user, and we do want to override it with the detected value
		if (overrideAll || fieldToOverrideWithDetected?.some((field) => field === key)) {
			acc[key] = val;
		}

		return acc;
	}, pubCreateParams ?? {});

	return newParams;
};

const maybeAddAttributionsToPub = async ({
	pubId,
	proposedAttributions,
	attributions,
}: {
	pubId: string;
	proposedAttributions?: ProposedMetadata['attributions'];
	attributions?: boolean | 'match';
}) => {
	if (attributions === false || !proposedAttributions?.length) {
		return [];
	}

	const addedAttributions = addAttributionsToPub({
		pubId,
		attributions: proposedAttributions.map(({ name, users }) => ({
			name,
			mostLikelyUserId: users?.[0]?.id,
		})),
		shouldMatchUsers: attributions === 'match',
	});

	return addedAttributions;
};

type ConvertInput = {
	userId?: string;
	tmpDir: string;
	files: Express.Multer.File[];
};

type ToPubImportInput = ConvertInput & {
	pubId: string;
	metadataOptions?: MetadataOptions;
	method?: ImportMethod;
};
type CreatePubImportInput = ConvertInput & {
	tmpDir: string;
	files: Express.Multer.File[];
	communityId: string;
	pubCreateParams: ImportCreatePubParams;
	metadataOptions?: MetadataOptions;
};

function handleImport(options: ToPubImportInput): Promise<{
	status: 200;
	body: {
		doc: types.DocJson;
		pub: types.DefinitelyHas<types.Pub, 'attributions'>;
	};
}>;
function handleImport(options: CreatePubImportInput): Promise<{
	status: 201;
	body: { doc: types.DocJson; pub: types.DefinitelyHas<types.Pub, 'attributions'> };
}>;
async function handleImport(options: ToPubImportInput | CreatePubImportInput) {
	const { files, tmpDir, metadataOptions, userId } = options;

	if ('pubId' in options) {
		const { pubId, method } = options;

		const pub = await Pub.findOne({
			where: { id: pubId },
		});

		if (!pub) {
			throw new NotFoundError();
		}

		const { proposedMetadata, doc } = await convertFiles({ files, tmpDir });

		const newParams = getDetectedParamsToUpdate({
			proposedMetadata,
			overrides: metadataOptions?.overrides,
			overrideAll: metadataOptions?.overrideAll,
		});

		const modifiedText = await writeDocumentToPubDraft(pub.id, doc, { method });

		const updatedAttributes = await updatePub(
			{ ...newParams, pubId },
			managerUpdatableFields,
			userId,
		);
		const updatedAttributions = await maybeAddAttributionsToPub({
			pubId,
			proposedAttributions: proposedMetadata.attributions,
			attributions: metadataOptions?.attributions,
		});

		const outputPub = Object.assign(pub.toJSON(), updatedAttributes, {
			attributions: updatedAttributions ?? [],
		}) as types.DefinitelyHas<types.Pub, 'attributions'>;

		return { status: 200, body: { doc: modifiedText, pub: outputPub } };
	}

	const { communityId } = options;

	const { proposedMetadata, doc } = await convertFiles({ files, tmpDir });

	const newParams = getDetectedParamsToUpdate({
		proposedMetadata,
		pubCreateParams: options.pubCreateParams,
		overrides: metadataOptions?.overrides,
		overrideAll: metadataOptions?.overrideAll,
	});

	const pub = await createPub(
		{
			communityId,
			...newParams,
		},
		userId,
	);

	await writeDocumentToPubDraft(pub.id, doc);

	const addedAttributions = await maybeAddAttributionsToPub({
		pubId: pub.id,
		proposedAttributions: proposedMetadata.attributions,
		attributions: metadataOptions?.attributions,
	});

	const outputPub = Object.assign(pub.toJSON(), {
		attributions: addedAttributions ?? [],
	}) as types.DefinitelyHas<types.Pub, 'attributions'>;

	return { status: 201, body: { doc, pub: outputPub } };
}

const s = initServer();

export const pubServer = s.router(contract.pub, {
	get: queryOne(Pub),
	getMany: queryMany(Pub),

	create: async ({ body, req }) => {
		const ids = getRequestIds(body, req.user);
		const { create, collectionIds } = await canCreatePub(ids);
		if (!create) {
			throw new ForbiddenError();
		}
		const createParams = omitKeys(body, ['communityId', 'collectionId', 'createPubToken']);
		try {
			const newPub = await createPub(
				{ communityId: ids.communityId, collectionIds, ...createParams },
				ids.userId,
			);
			const jsonedPub = newPub.toJSON();
			return {
				status: 201,
				body: jsonedPub,
			};
		} catch (e: any) {
			if (e.message === 'Slug is already in use') {
				throw new BadRequestError(e);
			}
			throw new Error(e);
		}
	},
	update: async ({ body, req }) => {
		const { userId, pubId } = getRequestIds(body, req.user);
		const updatableFields = await getUpdatablePubFields({
			userId,
			pubId,
		});
		if (!updatableFields) {
			throw new ForbiddenError();
		}

		const updateResult = await updatePub(req.body, updatableFields, userId);
		return {
			status: 200,
			body: updateResult,
		};
	},
	remove: async ({ body, req }) => {
		const { userId, pubId } = getRequestIds(body, req.user);
		const canDestroy = await canDestroyPub({ userId, pubId });
		if (!canDestroy) {
			throw new ForbiddenError();
		}

		await destroyPub(pubId, userId);
		return {
			status: 200,
			body: {},
		};
	},
	queryMany: async ({ req }) => {
		const initialData = await getInitialData(req, req.user);
		const { query: queryPartial, alreadyFetchedPubIds, pubOptions } = getManyQueryParams(req);
		const { limit } = queryPartial;
		const pubIds = await queryPubIds({
			...queryPartial,
			communityId: initialData.communityData.id,
		});
		const loadedAllPubs = limit && limit > pubIds.length;
		const idsToFetch = pubIds.filter((id) => !alreadyFetchedPubIds.includes(id));
		const pubs = await getPubsById(idsToFetch, pubOptions).sanitize(initialData);
		const pubsById = indexByProperty(pubs, 'id');
		return {
			status: 200,
			body: {
				pubIds: pubIds.filter((id) => !!pubsById[id] || alreadyFetchedPubIds.includes(id)),
				pubsById,
				loadedAllPubs,
			},
		};
	},
	doi: {
		deposit: async ({ params, req }) => {
			const { pubId } = params;
			const pubFields = await getUpdatablePubFields({ userId: req.user.id, pubId });
			try {
				assert(expect(pubFields).some((f) => f === 'doi'));
			} catch {
				throw new ForbiddenError();
			}
			const pub = expect(await findPub(pubId));
			const pubDoi =
				pub.doi ??
				(
					await generateDoi(
						{ communityId: pub.communityId, pubId, collectionId: undefined },
						'pub',
					)
				).pub;
			const jsonedPub = pub.toJSON();
			const resource = await transformPubToResource(jsonedPub, expect(jsonedPub.community));
			try {
				assertValidResource(resource);
			} catch (error) {
				return { status: 400, body: { error: (error as Error).message } };
			}
			try {
				const { resourceAst } = await prepareResource(pub, resource, expect(pubDoi));
				return { status: 200, body: resourceAst };
			} catch (error) {
				return { status: 400, body: { error: (error as Error).message } };
			}
		},
		preview: async ({ req, params }) => {
			const { pubId } = params;
			const pubFields = await getUpdatablePubFields({ userId: req.user.id, pubId });
			try {
				assert(expect(pubFields).some((f) => f === 'doi'));
			} catch {
				throw new ForbiddenError();
			}
			const pub = expect(await findPub(pubId));

			const pubDoi =
				pub.doi ??
				(
					await generateDoi(
						{ communityId: pub.communityId, pubId, collectionId: undefined },
						'pub',
					)
				).pub;

			const jsonedPub = pub.toJSON();
			const resource = await transformPubToResource(jsonedPub, expect(jsonedPub.community));
			try {
				assertValidResource(resource);
			} catch (error) {
				return { status: 400, body: { error: (error as Error).message } };
			}
			try {
				const { resourceAst } = await prepareResource(pub, resource, expect(pubDoi));
				return { status: 200, body: resourceAst };
			} catch (error) {
				return { status: 400, body: { error: (error as Error).message } };
			}
		},
	},
	getResource: async ({ params }) => {
		const { pubId } = params;
		const pub = await findPub(pubId);
		if (!pub) {
			throw new NotFoundError();
		}
		const jsonedPub = pub.toJSON();
		const resource = await transformPubToResource(jsonedPub, expect(jsonedPub.community));
		return { status: 200, body: resource };
	},
	text: {
		get: async ({ params }) => {
			const doc = await getPubDraftDoc(params.pubId);

			return { status: 200, body: doc.doc };
		},
		update: async ({ req, params, body }) => {
			await ensureUserIsCommunityAdmin(req);

			await writeDocumentToPubDraft(params.pubId, body.doc, { method: body.method });

			const { doc } = await getPubDraftDoc(params.pubId);

			return { status: 200, body: { doc } };
		},
		importOld: async ({ req, body }) => {
			const community = await ensureUserIsCommunityAdmin(req);

			const { collectionId, ...createPubArgs } = body.pub ?? {};

			const baseUrl = `${req.protocol}://${req.get(
				isProd() || isDuqDuq() ? 'host' : 'localhost',
			)}`;

			const pub = await createPub({
				communityId: community.id,
				collectionIds: collectionId ? [collectionId] : undefined,
				...createPubArgs,
			});

			const task = await importToPub({
				pubId: pub.id,
				baseUrl,
				importBody: {
					sourceFiles: body.sourceFiles,
				},
			});

			return { status: 201, body: { doc: task.doc, pub: pub.toJSON() } };
		},
		import: {
			middleware: [
				async (req, res, next) => {
					return (await createUploadMiddleware())(req, res, next);
				},
			],
			handler: async ({ req, body, files }) => {
				const community = await ensureUserIsCommunityAdmin(req);

				const pubCreateParams = omitKeys(body, [
					'filenames',
					'files',
					'overrides',
					'attributions',
				]);
				return handleImport({
					// @ts-expect-error shh
					tmpDir: req.tmpDir,
					files: files as Express.Multer.File[],
					communityId: community.id,
					pubCreateParams,
					metadataOptions: {
						attributions: body.attributions,
						overrides: body.overrides,
					},
					userId: req.user.id,
				});
			},
		},
		importToPub: {
			middleware: [
				async (req, res, next) => {
					return (await createUploadMiddleware())(req, res, next);
				},
			],
			handler: async ({ req, body, files, params }) => {
				await ensureUserIsCommunityAdmin(req);

				return handleImport({
					// @ts-expect-error shh
					tmpDir: req.tmpDir,
					files: files as Express.Multer.File[],
					pubId: params.pubId,
					method: body.method,
					metadataOptions: {
						attributions: body.attributions,
						overrides: body.overrides,
					},
					userId: req.user.id,
				});
			},
		},
		convert: {
			middleware: [
				async (req, res, next) => {
					return (await createUploadMiddleware())(req, res, next);
				},
			],
			handler: async ({ req, files }) => {
				const result = await convertFiles({
					// @ts-expect-error shh
					tmpDir: req.tmpDir,
					files: files as Express.Multer.File[],
				});

				return {
					status: 200,
					body: result,
				};
			},
		},
	},
});
