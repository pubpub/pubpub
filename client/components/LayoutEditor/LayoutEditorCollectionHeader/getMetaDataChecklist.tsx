import React from 'react';
import { Card, Checkbox } from '@blueprintjs/core';

import { LayoutBlockCollectionHeader } from 'utils/layout';
import { Collection } from 'types';
import { IssueMetadata } from 'utils/collections/getIssueMetadata';
import { BookMetadata } from 'utils/collections/getBookMetadata';
import { ConferenceMetadata } from 'utils/collections/getConferenceMetadata';

type Content = LayoutBlockCollectionHeader['content'];

type Props = {
	content: Content;
	onChange: (nextContent: Partial<Content>) => unknown;
	collection: Collection;
};

const PreviewIssueElementFields = (props: Props) => {
	const { content, onChange, collection } = props;
	const {
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
		printPublicationDate,
		publicationDate,
		issue,
	} = IssueMetadata(collection);

	return (
		<>
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
			<Checkbox
				disabled={!issue}
				checked={issue ? !hideIssue : false}
				onChange={() => onChange({ hideIssue: !hideIssue })}
				label="Issue"
			/>
		</>
	);
};

const PreviewBookElementFields = (props: Props) => {
	const { content, onChange, collection } = props;
	const { hideIsbn, hideCopyrightYear, hideBookPublicationDate, hideEdition } = content;
	const { isbn, copyright, published, edition } = BookMetadata(collection);

	return (
		<>
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
	const { hideTheme, hideAcronym, hideConferenceDate, hideLocation } = content;
	const { theme, acronym, location, conferenceDate } = ConferenceMetadata(collection);

	return (
		<>
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

const Metadata = (props: Props) => {
	const { content, onChange, collection } = props;

	return (
		<Card className="layout-editor-pubs_preview-elements-component">
			{collection.kind === 'issue' && (
				<PreviewIssueElementFields
					content={content}
					onChange={onChange}
					collection={collection}
				/>
			)}
			{collection.kind === 'book' && (
				<PreviewBookElementFields
					content={content}
					onChange={onChange}
					collection={collection}
				/>
			)}
			{collection.kind === 'conference' && (
				<PreviewConferenceElementFields
					content={content}
					onChange={onChange}
					collection={collection}
				/>
			)}
		</Card>
	);
};

export default Metadata;
