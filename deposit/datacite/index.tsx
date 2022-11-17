/** @jsx x */
/** @jsxFrag null */
import { x } from '@pubpub/deposit-utils/datacite';
import {
	Resource,
	ResourceContribution,
	ResourceDescriptor,
	ResourceKind,
	ResourceSummaryKind,
} from 'deposit/types';
import { Collection, Community, Pub } from 'server/models';
import { buildPubOptions } from 'server/utils/queryHelpers';
import * as types from 'types';

type DepositablePub = types.PubWithConnections & {
	collectionPubs: types.DefinitelyHas<types.CollectionPub, 'collection'>[];
};

type CreateDepositIds = { communityId: string } & ({ collectionId: string } | { pubId: string });
type CreateDepositContext = { community: types.Community } & (
	| { collection: types.Collection }
	| { pub: DepositablePub }
);

const findPub = (pubId: string): Promise<DepositablePub> =>
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

function transformResourceKindToDataciteResourceType(kind: ResourceKind) {
	switch (kind) {
		case 'Book':
			return 'Book';
		case 'BookChapter':
			return 'BookChapter';
		case 'Conference':
		case 'ConferenceProceeding':
			return 'ConferenceProceeding';
		case 'ConferencePaper':
			return 'ConferencePaper';
		case 'Journal':
		case 'JournalIssue':
			return 'Journal';
		case 'JournalArticle':
			return 'JournalArticle';
	}
	return 'Other';
}

function transformResourceDescriptionKindToDataciteDescriptionType(kind: ResourceDescriptor) {
	switch (kind) {
		case 'Process':
			return 'Methods';
		case 'Mechanism':
			return 'TechnicalInfo';
	}
	return 'Other';
}

function transformResourceSummaryKindToDataciteDescriptionType(kind: ResourceSummaryKind) {
	switch (kind) {
		case 'Synopsis':
			return 'Abstract';
	}
	return 'Other';
}

function renderCreator(contribution: ResourceContribution) {
	return (
		<creator>
			<creatorName>{contribution.contributor.name}</creatorName>
			{contribution.contributorAffiliation ? (
				// @ts-expect-error
				<affiliation>{contribution.contributorAffiliation}</affiliation>
			) : undefined}
		</creator>
	);
}

export async function createDeposit(resource: Resource, doi: string) {
	const wordCount = resource.summaries.find((summary) => summary.kind === 'WordCount');
	return (
		<resource xmlns="http://datacite.org/schema/kernel-4">
			<resourceType
				resourceTypeGeneral={transformResourceKindToDataciteResourceType(resource.kind)}
			></resourceType>
			<identifier identifierType="DOI">{doi}</identifier>
			<titles>
				<title xml:lang="en-US">{resource.title}</title>
			</titles>
			<descriptions>
				{resource.descriptions.map((description) => (
					<description
						xml:lang="en-US"
						descriptionType={transformResourceDescriptionKindToDataciteDescriptionType(
							description.kind,
						)}
					></description>
				))}
				{resource.summaries
					.filter((summary) => summary.kind !== 'WordCount')
					.map((summary) => (
						<description
							xml:lang="en-US"
							descriptionType={transformResourceSummaryKindToDataciteDescriptionType(
								summary.kind,
							)}
						></description>
					))}
			</descriptions>
			<creators>
				{resource.contributions
					.filter((contribution) => contribution.isAttribution)
					.map(renderCreator)}
			</creators>
			{wordCount && (
				<sizes>
					<size>${wordCount.value} words</size>
				</sizes>
			)}
		</resource>
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
