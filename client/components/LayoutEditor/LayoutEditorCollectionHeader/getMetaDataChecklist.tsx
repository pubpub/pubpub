import React from 'react';
import { Card, Checkbox } from '@blueprintjs/core';

import { LayoutBlockCollectionHeader } from 'utils/layout';
import { Collection } from 'types';

type Content = LayoutBlockCollectionHeader['content'];

type Props = {
	content: Content;
	onChange: (nextContent: Partial<Content>) => unknown;
	collection: Collection;
};

type CheckBoxProps = {
	content: Content;
	onChange: (nextContent: Partial<Content>) => unknown;
};

const PreviewIssueElementFields = (props: CheckBoxProps) => {
	const { content, onChange } = props;
	const {
		hidePrintIssn,
		hideElectronicIssn,
		hideVolume,
		hideIssue,
		hideIssuePrintPublicationDate,
		hideIssuePublicationDate,
	} = content;

	return (
		<>
			<Checkbox
				checked={!hidePrintIssn}
				onChange={() => onChange({ hidePrintIssn: !hidePrintIssn })}
				label="Print ISSN"
			/>
			<Checkbox
				checked={!hideElectronicIssn}
				onChange={() => onChange({ hideElectronicIssn: !hideElectronicIssn })}
				label="Electronic ISSN"
			/>
			<Checkbox
				checked={!hideVolume}
				onChange={() => onChange({ hideVolume: !hideVolume })}
				label="Volume"
			/>
			<Checkbox
				checked={!hideIssue}
				onChange={() => onChange({ hideIssue: !hideIssue })}
				label="Issue"
			/>
			<Checkbox
				checked={!hideIssuePrintPublicationDate}
				onChange={() =>
					onChange({ hideIssuePrintPublicationDate: !hideIssuePrintPublicationDate })
				}
				label="Print Publication Date"
			/>
			<Checkbox
				checked={!hideIssuePublicationDate}
				onChange={() => onChange({ hideIssuePublicationDate: !hideIssuePublicationDate })}
				label="Publication Date"
			/>
		</>
	);
};

const PreviewBookElementFields = (props: CheckBoxProps) => {
	const { content, onChange } = props;
	const { hideIsbn, hideCopyrightYear, hideBookPublicationDate, hideEdition } = content;

	return (
		<>
			<Checkbox
				checked={!hideIsbn}
				onChange={() => onChange({ hideIsbn: !hideIsbn })}
				label="ISBN"
			/>
			<Checkbox
				checked={!hideCopyrightYear}
				onChange={() => onChange({ hideCopyrightYear: !hideCopyrightYear })}
				label="Copyright Year"
			/>
			<Checkbox
				checked={!hideBookPublicationDate}
				onChange={() => onChange({ hideBookPublicationDate: !hideBookPublicationDate })}
				label="Publication Date"
			/>
			<Checkbox
				checked={!hideEdition}
				onChange={() => onChange({ hideEdition: !hideEdition })}
				label="Edition"
			/>
		</>
	);
};

const PreviewConferenceElementFields = (props: CheckBoxProps) => {
	const { content, onChange } = props;
	const { hideTheme, hideAcronym, hideConferenceDate, hideLocation } = content;

	return (
		<>
			<Checkbox
				checked={!hideTheme}
				onChange={() => onChange({ hideTheme: !hideTheme })}
				label="Theme"
			/>
			<Checkbox
				checked={!hideAcronym}
				onChange={() => onChange({ hideAcronym: !hideAcronym })}
				label="Acronym"
			/>
			<Checkbox
				checked={!hideConferenceDate}
				onChange={() => onChange({ hideConferenceDate: !hideConferenceDate })}
				label="Conference Date"
			/>
			<Checkbox
				checked={!hideLocation}
				onChange={() => onChange({ hideLocation: !hideLocation })}
				label="Location"
			/>
		</>
	);
};

const Metadata = (props: Props) => {
	const { content, onChange, collection } = props;

	return (
		<Card className="layout-editor-pubs_preview-elements-component">
			{collection.kind === 'conference' && (
				<PreviewConferenceElementFields content={content} onChange={onChange} />
			)}
			{collection.kind === 'book' && (
				<PreviewBookElementFields content={content} onChange={onChange} />
			)}
			{collection.kind === 'issue' && (
				<PreviewIssueElementFields content={content} onChange={onChange} />
			)}
		</Card>
	);
};

export default Metadata;
