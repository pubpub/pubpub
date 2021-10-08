import React from 'react';
import { Card, Checkbox } from '@blueprintjs/core';

import { LayoutBlockMetadata } from 'utils/layout';
import { Collection } from 'types';

type Content = LayoutBlockMetadata['content'];

type Props = {
	content: Content;
	onChangeContent: (nextContent: Partial<Content>) => unknown;
	collection: Collection;
};

type PreviewIssueElementField =
	| 'hidePrintIssn'
	| 'hideElectronicIssn'
	| 'hideVolume'
	| 'hideIssue'
	| 'hidePrintPublicationDate'
	| 'hidePublicationDate'
	| 'hideDoi'
	| 'hideUrl';

type PreviewBookElementField =
	| 'hideIsbn'
	| 'hideCopyrightYear'
	| 'hidePublicationDate'
	| 'hideEdition'
	| 'hideDoi'
	| 'hideUrl';

type PreviewConferenceElementField =
	| 'hideTheme'
	| 'hideAcronym'
	| 'hideLocation'
	| 'hideDate'
	| 'hideDoi'
	| 'hideUrl';

const labelsForPreviewIssueElementFields: Record<PreviewIssueElementField, string> = {
	hidePrintIssn: 'Print ISSN',
	hideElectronicIssn: 'Electronic ISSN',
	hideVolume: 'Volume',
	hideIssue: 'Issue',
	hidePrintPublicationDate: 'Print Publication Date',
	hidePublicationDate: 'Date',
	hideDoi: 'DOI',
	hideUrl: 'URL',
};

const labelsForPreviewBookElementFields: Record<PreviewBookElementField, string> = {
	hideIsbn: 'ISBN',
	hideCopyrightYear: 'Copyright Year',
	hidePublicationDate: 'Publication Date',
	hideEdition: 'Edition',
	hideDoi: 'DOI',
	hideUrl: 'URL',
};

const labelsForPreviewConferenceElementFields: Record<PreviewConferenceElementField, string> = {
	hideTheme: 'Theme',
	hideAcronym: 'Acronym',
	hideDate: 'Dates',
	hideLocation: 'Location',
	hideDoi: 'DOI',
	hideUrl: 'URL',
};

const labelGroup = {
	issue: labelsForPreviewIssueElementFields,
	book: labelsForPreviewBookElementFields,
	conference: labelsForPreviewConferenceElementFields,
};

const deriveFieldStatus = (content: Content, field: PreviewConferenceElementField) => {
	const fieldValue = content[field];
	return {
		hidden: fieldValue,
	};
};

const Metadata = (props: Props) => {
	const { content, onChangeContent, collection } = props;
	console.log(collection);
	return (
		<Card className="layout-editor-pubs_preview-elements-component">
			{collection.kind === 'conference' &&
				Object.entries(labelsForPreviewConferenceElementFields).map((entry) => {
					const [field, label] = entry;
					console.log(entry);
					const { hidden } = deriveFieldStatus(
						content,
						field as PreviewConferenceElementField,
					);
					return (
						<Checkbox
							key={field}
							label={label}
							checked={!hidden}
							onChange={() => onChangeContent({ [field]: !hidden })}
						/>
					);
				})}
			{collection.kind === 'book' &&
				Object.entries(labelsForPreviewBookElementFields).map((entry) => {
					const [field, label] = entry;
					console.log(entry);
					const { hidden } = deriveFieldStatus(
						content,
						field as PreviewConferenceElementField,
					);
					return (
						<Checkbox
							key={field}
							label={label}
							checked={!hidden}
							onChange={() => onChangeContent({ [field]: !hidden })}
						/>
					);
				})}
			{collection.kind === 'issue' &&
				Object.entries(labelsForPreviewIssueElementFields).map((entry) => {
					const [field, label] = entry;
					console.log(entry);
					const { hidden } = deriveFieldStatus(
						content,
						field as PreviewConferenceElementField,
					);
					return (
						<Checkbox
							key={field}
							label={label}
							checked={!hidden}
							onChange={() => onChangeContent({ [field]: !hidden })}
						/>
					);
				})}
		</Card>
	);
};

export default Metadata;
