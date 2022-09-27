/* @jsx x */
import { x, renderXml } from '@pubpub/deposit-utils/datacite';

// import { Pub } from 'types';

export function createDeposit() {
	return renderXml(
		<resource xmlns="http://datacite.org/schema/kernel-4">
			<descriptions>
				<description xml:lang="en-US" descriptionType="Abstract">
					A description
				</description>
			</descriptions>
			<titles>
				<title>
					Water Deficiency Correlates to Increased Senescense in All Plant Species
				</title>
			</titles>
			<creators>
				<creator>
					<creatorName>Eric McDaniel</creatorName>
				</creator>
			</creators>
			<identifier identifierType="DOI">10.507/8675309</identifier>
			<publisher>MIT Press</publisher>
			<publicationYear>2011</publicationYear>
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
