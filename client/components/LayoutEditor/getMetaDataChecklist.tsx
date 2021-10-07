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
	hidePrintIssn: 'Byline',
	hideElectronicIssn: 'Contributors',
	hideVolume: 'Dates',
	hideIssue: 'Description',
	hidePrintPublicationDate: 'Connections',
	hidePublicationDate: 'PublicationDate',
	hideDoi: 'DOI',
	hideUrl: 'URL',
};

const labelsForPreviewBookElementFields: Record<PreviewBookElementField, string> = {
	hideIsbn: 'Byline',
	hideCopyrightYear: 'Contributors',
	hidePublicationDate: 'Description',
	hideEdition: 'Connections',
	hideDoi: 'DOI',
	hideUrl: 'URL',
};

const labelsForPreviewConferenceElementFields: Record<PreviewConferenceElementField, string> = {
	hideTheme: 'Byline',
	hideAcronym: 'Contributors',
	hideDate: 'Dates',
	hideLocation: 'Description',
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
	const disabledBecauseMinimal =
		field === 'hideTheme' || field === 'hideAcronym' || field === 'hideLocation';
	return {
		hidden: disabledBecauseMinimal ? true : fieldValue,
		disabled: disabledBecauseMinimal,
	};
};

const Metadata = (props: Props) => {
	const { content, onChangeContent, collection } = props;
	console.log(collection);
	return (
		<Card className="layout-editor-pubs_preview-elements-component">
			{Object.entries(labelsForPreviewConferenceElementFields).map((entry) => {
				const [field, label] = entry;
				const { disabled, hidden } = deriveFieldStatus(
					content,
					field as PreviewConferenceElementField,
				);
				return (
					<Checkbox
						key={field}
						disabled={disabled}
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
