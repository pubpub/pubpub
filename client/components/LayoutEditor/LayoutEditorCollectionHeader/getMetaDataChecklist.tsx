import React from 'react';
import { Card, Checkbox } from '@blueprintjs/core';

import { LayoutBlockCollectionHeader } from 'utils/layout';
import { Collection } from 'types';
import { issueMetadata } from 'utils/collections/getIssueMetadata';
import { bookMetadata } from 'utils/collections/getBookMetadata';
import { conferenceMetadata } from 'utils/collections/getConferenceMetadata';
import getCollectionDoi from 'utils/collections/getCollectionDoi';

type Content = LayoutBlockCollectionHeader['content'];

type Props = {
	content: Content;
	onChange: (nextContent: Partial<Content>) => unknown;
	collection: Collection;
};

const PreviewIssueElementFields = (props: Props) => {
	const { content, onChange, collection } = props;
	const {
		hideDoi,
		hidePrintIssn,
		hideElectronicIssn,
		hideVolume,
		hideIssue,
		hideIssuePrintPublicationDate,
		hideIssuePublicationDate,
	} = content;

	const {
		printIssn,
		electronicIssn,
		volume,
		issue,
		printPublicationDate,
		publicationDate,
	} = issueMetadata(collection);
	const doi = getCollectionDoi(collection);

	return (
		<>
			<Checkbox
				disabled={!doi}
				checked={doi ? !hideDoi : false}
				onChange={() => onChange({ hideDoi: !hideDoi })}
				label="DOI"
			/>
			<Checkbox
				disabled={!printIssn}
				checked={printIssn ? !hidePrintIssn : false}
				onChange={() => onChange({ hidePrintIssn: !hidePrintIssn })}
				label="Print ISSN"
			/>
			<Checkbox
				disabled={!electronicIssn}
				checked={electronicIssn ? !hideElectronicIssn : false}
				onChange={() => onChange({ hideElectronicIssn: !hideElectronicIssn })}
				label="Electronic ISSN"
			/>
			<Checkbox
				disabled={!volume}
				checked={volume ? !hideVolume : false}
				onChange={() => onChange({ hideVolume: !hideVolume })}
				label="Volume"
			/>
			<Checkbox
				disabled={!issue}
				checked={issue ? !hideIssue : false}
				onChange={() => onChange({ hideIssue: !hideIssue })}
				label="Issue"
			/>
			<Checkbox
				disabled={!printPublicationDate}
				checked={printPublicationDate ? !hideIssuePrintPublicationDate : false}
				onChange={() =>
					onChange({ hideIssuePrintPublicationDate: !hideIssuePrintPublicationDate })
				}
				label="Print Publication Date"
			/>
			<Checkbox
				disabled={!publicationDate}
				checked={publicationDate ? !hideIssuePublicationDate : false}
				onChange={() => onChange({ hideIssuePublicationDate: !hideIssuePublicationDate })}
				label="Publication Date"
			/>
		</>
	);
};

const PreviewBookElementFields = (props: Props) => {
	const { content, onChange, collection } = props;
	const { hideDoi, hideIsbn, hideCopyrightYear, hideBookPublicationDate, hideEdition } = content;
	const { isbn, copyright, published, edition } = bookMetadata(collection);
	const doi = getCollectionDoi(collection);

	return (
		<>
			<Checkbox
				disabled={!doi}
				checked={doi ? !hideDoi : false}
				onChange={() => onChange({ hideDoi: !hideDoi })}
				label="DOI"
			/>
			<Checkbox
				disabled={!isbn}
				checked={isbn ? !hideIsbn : false}
				onChange={() => onChange({ hideIsbn: !hideIsbn })}
				label="ISBN"
			/>
			<Checkbox
				disabled={!copyright}
				checked={copyright ? !hideCopyrightYear : false}
				onChange={() => onChange({ hideCopyrightYear: !hideCopyrightYear })}
				label="Copyright Year"
			/>
			<Checkbox
				disabled={!published}
				checked={published ? !hideBookPublicationDate : false}
				onChange={() => onChange({ hideBookPublicationDate: !hideBookPublicationDate })}
				label="Publication Date"
			/>
			<Checkbox
				disabled={!edition}
				checked={edition ? !hideEdition : false}
				onChange={() => onChange({ hideEdition: !hideEdition })}
				label="Edition"
			/>
		</>
	);
};

const PreviewConferenceElementFields = (props: Props) => {
	const { content, onChange, collection } = props;
	const { hideDoi, hideTheme, hideAcronym, hideConferenceDate, hideLocation } = content;
	const { theme, acronym, location, conferenceDate } = conferenceMetadata(collection);
	const doi = getCollectionDoi(collection);

	return (
		<>
			<Checkbox
				disabled={!doi}
				checked={doi ? !hideDoi : false}
				onChange={() => onChange({ hideDoi: !hideDoi })}
				label="DOI"
			/>
			<Checkbox
				disabled={!theme}
				checked={theme ? !hideTheme : false}
				onChange={() => onChange({ hideTheme: !hideTheme })}
				label="Theme"
			/>
			<Checkbox
				disabled={!acronym}
				checked={acronym ? !hideAcronym : false}
				onChange={() => onChange({ hideAcronym: !hideAcronym })}
				label="Acronym"
			/>
			<Checkbox
				disabled={!location}
				checked={location ? !hideLocation : false}
				onChange={() => onChange({ hideLocation: !hideLocation })}
				label="Location"
			/>
			<Checkbox
				disabled={!conferenceDate}
				checked={conferenceDate ? !hideConferenceDate : false}
				onChange={() => onChange({ hideConferenceDate: !hideConferenceDate })}
				label="Conference Date"
			/>
		</>
	);
};

const metadataViewsByCollectionKind = {
	issue: PreviewIssueElementFields,
	book: PreviewBookElementFields,
	conference: PreviewConferenceElementFields,
};

const Metadata = (props: Props) => {
	const { content, onChange, collection } = props;
	if (collection.kind === undefined || collection.kind === 'tag') {
		return null;
	}
	const MetadataView = metadataViewsByCollectionKind[collection.kind];

	return (
		<Card>
			<MetadataView content={content} onChange={onChange} collection={collection} />
		</Card>
	);
};

export default Metadata;
