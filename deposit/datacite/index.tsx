/* @jsx x */
import { x, renderXml } from '@pubpub/deposit-utils/datacite';
import { Pub } from 'server/models';
import { buildPubOptions } from 'server/utils/queryHelpers';
import * as types from 'types';
import { expect } from 'utils/assert';
import { getDois } from 'utils/crossref/createDeposit';
import { getPubPublishedDate } from 'utils/pub/pubDates';

// import { Pub } from 'types';

type CreateDepositIds = { communityId: string } & ({ collectionId: string } | { pubId: string });

const findPub = (pubId: string): Promise<types.Pub> =>
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
	});

export async function xcreateDeposit(ids: CreateDepositIds) {
	if (!('pubId' in ids)) {
		throw new Error();
	}
	const pub = await findPub(ids.pubId);
	const dois = getDois(
		pubEdge && pubEdge.relationType === RelationType.Supplement ? contextWithPubEdge : ctx,
		doiTarget,
		depositTarget,
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
			<titles>
				<title>{pub.title}</title>
			</titles>
			<creators>
				<creator>
					<creatorName>Eric McDaniel</creatorName>
				</creator>
			</creators>
			<identifier identifierType="DOI">10.507/8675309</identifier>
			<publisher>MIT Press</publisher>
			<publicationYear>{expect(getPubPublishedDate(pub)).getFullYear()}</publicationYear>
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
