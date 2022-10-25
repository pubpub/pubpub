/** @jsx x */
/** @jsxFrag null */
import { renderXml, x } from '@pubpub/deposit-utils/datacite';
import { preparePubForDeposit } from 'deposit/utils';
import { getCommunityDepositTarget } from 'server/depositTarget/queries';
import { Collection, Community, Doc, Pub } from 'server/models';
import { buildPubOptions } from 'server/utils/queryHelpers';
import * as types from 'types';
import { assert, expect } from 'utils/assert';
import { getDois } from 'utils/crossref/createDeposit';
import { getLicenseForPub } from 'utils/licenses';
import { getTextAbstract, getWordAndCharacterCountsFromDoc } from 'utils/pub/metadata';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { RelationType } from 'utils/pubEdge';
import { editorSchema } from 'components/Editor';
import { Node } from 'prosemirror-model';

type ThePubINeed = types.PubWithConnections & {
	collectionPubs: types.DefinitelyHas<types.CollectionPub, 'collection'>[];
};

type CreateDepositIds = { communityId: string } & ({ collectionId: string } | { pubId: string });
type CreateDepositContext = { community: types.Community } & (
	| { collection: types.Collection }
	| { pub: ThePubINeed }
);

const findPub = (pubId: string): Promise<ThePubINeed> =>
	Pub.findOne({
		where: { id: pubId },
		...buildPubOptions({
			getEdgesOptions: {
				// Include Pub for both inbound and outbound pub connections
				// since we do a lot of downstream processing with pubEdges.
				includePub: true,
				includeCommunityForPubs: true,
			},
			getCollections: true,
		}),
	}).then((pub) => pub.get({ plain: true }));

async function getCreateDepositContext(ids: CreateDepositIds): Promise<CreateDepositContext> {
	const communityPromise: Promise<types.Community> = Community.findOne({
		where: { id: ids.communityId },
	});
	if ('collectionId' in ids) {
		const [community, collection] = await Promise.all([
			communityPromise,
			Collection.findOne({ where: { id: ids.collectionId } }) as Promise<types.Collection>,
		]);
		return { community, collection };
	}
	const [community, pub] = await Promise.all([communityPromise, findPub(ids.pubId)]);
	return { community, pub };
}

export async function createDeposit(ids: CreateDepositIds) {
	const context = await getCreateDepositContext(ids);
	assert('pub' in context);
	const { pub, pubEdge } = preparePubForDeposit(context.pub, true);
	const dois = getDois(
		pubEdge && pubEdge.relationType === RelationType.Supplement
			? { ...context, pubEdge }
			: context,
		'pub',
		getCommunityDepositTarget(ids.communityId, 'datacite'),
	);
	const release = pub.releases[pub.releases.length - 1];
	const releaseDoc = await Doc.findOne({ where: { id: release.docId } });
	const abstract = getTextAbstract(releaseDoc.content);
	const creators = pub.attributions.filter((attribution) => attribution.isAuthor);
	const contributors = pub.attributions.filter((attribution) => !attribution.isAuthor);
	const license = getLicenseForPub(pub, context.community);
	const [wordCount] = getWordAndCharacterCountsFromDoc(
		Node.fromJSON(editorSchema, releaseDoc.content),
	);
	return renderXml(
		<resource xmlns="http://datacite.org/schema/kernel-4">
			<resourceType resourceTypeGeneral="Journal">Some additional text</resourceType>
			<descriptions>
				{pub.description ? (
					<description xml:lang="en-US" descriptionType="Other">
						{pub.description}
					</description>
				) : undefined}
				{abstract.length > 0 ? (
					<description xml:lang="en-US" descriptionType="Abstract">
						{abstract}
					</description>
				) : undefined}
			</descriptions>
			<subjects>
				<subject schemeURI=""></subject>
			</subjects>
			<titles>
				<title xml:lang="en-US">{pub.title}</title>
			</titles>
			<creators>
				{creators.map((attribution) => {
					return (
						<creator>
							<creatorName>
								{attribution.user?.fullName ?? attribution.name}
							</creatorName>
							{attribution.affiliation ? (
								// @ts-expect-error
								<affiliation>{attribution.affiliation}</affiliation>
							) : undefined}
							{attribution.orcid ? (
								// @ts-expect-error
								<nameIdentifier
									nameIdentifierScheme="ORCID"
									schemeURI="https://orcid.org"
								>
									{attribution.orcid}
									{/* @ts-expect-error */}
								</nameIdentifier>
							) : undefined}
							{attribution.user ? (
								<>
									{/* @ts-expect-error */}
									<givenName>{attribution.user.firstName}</givenName>
									{/* @ts-expect-error */}
									<familyName>{attribution.user.lastName}</familyName>
								</>
							) : undefined}
						</creator>
					);
				})}
			</creators>
			<contributors>
				{contributors.map((attribution) => {
					return (
						<contributor contributorType="Editor">
							<contributorName xml:lang="en-US">
								{attribution.user?.fullName ?? attribution.name}
							</contributorName>
							{attribution.user ? (
								<>
									{/* @ts-expect-error */}
									<givenName>{attribution.user.firstName}</givenName>
									{/* @ts-expect-error */}
									<familyName>{attribution.user.lastName}</familyName>
								</>
							) : undefined}
						</contributor>
					);
				})}
			</contributors>
			<identifier identifierType="DOI">{dois.pub}</identifier>
			<publisher>PubPub</publisher>
			<publicationYear>{expect(getPubPublishedDate(pub)).getFullYear()}</publicationYear>
			<dates>
				<date dateType="Available">
					{getPubPublishedDate(pub)!.toISOString().slice(0, 10)}
				</date>
				{pub.releases.length > 0 ? (
					<date dateType="Updated">
						{(release.createdAt as unknown as Date).toISOString().slice(0, 10)}
					</date>
				) : undefined}
			</dates>
			<relatedItems></relatedItems>
			<rightsList>
				<rights xml:lang="en-US" rightsURI={license.link ?? undefined}>
					{license.full}
				</rights>
			</rightsList>
			<sizes>
				<size>${wordCount} words</size>
			</sizes>
		</resource>,
		// false,
	);
}

export async function submitDeposit(metadataXml: string, doi: string) {
	let url = 'https://schema.datacite.org/meta/kernel-4.4/index.html';
	let xml = Buffer.from(metadataXml).toString('base64');
	let response = await fetch('https://api.test.datacite.org/dois', {
		headers: {
			'Content-Type': 'application/vnd.api+json',
			Authorization: 'Basic ' + Buffer.from(process.env.DATACITE_AUTH!).toString('base64'),
		},
		body: JSON.stringify({
			id: doi,
			type: 'dois',
			attributes: { event: 'publish', doi, url, xml },
		}),
	});
	return await response.json();
}
