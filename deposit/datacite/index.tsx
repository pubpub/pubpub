/* @jsx x */
import { x, renderXml } from '@pubpub/deposit-utils/datacite';
import { preparePubForDeposit } from 'deposit/utils';
import { getCommunityDepositTarget } from 'server/depositTarget/queries';
import { Collection, Community, DepositTarget, Pub } from 'server/models';
import { buildPubOptions } from 'server/utils/queryHelpers';
import * as types from 'types';
import { assert, expect } from 'utils/assert';
import { getDois } from 'utils/crossref/createDeposit';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { RelationType } from 'utils/pubEdge';

type CreateDepositIds = { communityId: string } & ({ collectionId: string } | { pubId: string });
type DepositContext = { community: types.Community } & (
	| { collection: types.Collection }
	| { pub: types.PubWithConnections }
);

const findPub = (pubId: string): Promise<types.PubWithConnections> =>
	Pub.findOne({
		where: { id: pubId },
		...buildPubOptions({
			getEdgesOptions: {
				// Include Pub for both inbound and outbound pub connections
				// since we do a lot of downstream processing with pubEdges.
				includePub: true,
				includeCommunityForPubs: true,
			},
		}),
	}).then((pub) => pub.get({ plain: true }));

async function getDepositContext(ids: CreateDepositIds): Promise<DepositContext> {
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
	const context = await getDepositContext(ids);
	assert('pub' in context);
	const { pub, pubEdge } = preparePubForDeposit(context.pub, true);
	const dois = getDois(
		pubEdge && pubEdge.relationType === RelationType.Supplement
			? { ...context, pubEdge }
			: context,
		'pub',
		getCommunityDepositTarget(ids.communityId, 'datacite'),
	);
	return renderXml(
		<resource xmlns="http://datacite.org/schema/kernel-4">
			{pub.description && (
				<descriptions>
					<description xml:lang="en-US" descriptionType="Abstract">
						{pub.description}
					</description>
				</descriptions>
			)}
			<subjects>
				<subject schemeURI=""></subject>
			</subjects>
			<titles>
				<title>{pub.title}</title>
			</titles>
			<creators>
				<creator>
					<creatorName>Eric McDaniel</creatorName>
				</creator>
			</creators>
			<identifier identifierType="DOI">{dois.pub}</identifier>
			<publisher>MIT Press</publisher>
			<publicationYear>{expect(getPubPublishedDate(pub)).getFullYear()}</publicationYear>
			<dates>
				<date dateType="Accepted"></date>
			</dates>
			<resourceType resourceTypeGeneral="Journal">Some additional text</resourceType>
			<relatedItems>
				<relatedItem relatedItemType="Book" relationType="IsCitedBy">
					<publicationYear>2011</publicationYear>
				</relatedItem>
			</relatedItems>
			<contributors>
				<contributor contributorType="Editor">
					<contributorName xml:lang="en-US" nameType="Personal">
						Eric McDaniel
					</contributorName>
				</contributor>
			</contributors>
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
