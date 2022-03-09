import React from 'react';
import { Label, InputGroup } from '@blueprintjs/core';
import { useDebouncedCallback } from 'use-debounce';

import { PubPageData, Pub, DocJson } from 'types';
import { MinimalEditor, DownloadChooser } from 'components';

require('./submissionTab.scss');

type Props = {
	pub: Pub;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
};

const SubmissionTab = (props: Props) => {
	const [onUpdatePubDebounced] = useDebouncedCallback(props.onUpdatePub, 250);
	const renderDefaultDownloadFile = () => {
		return (
			<div className="submission-tab-prompt">
				<div className="submission-tab-prompt-text">
					<h2>Default Download File</h2>
					<p className="submission-tab-prompt-text">
						You can upload a file, like a PDF with custom styling, to associate with
						this submission
					</p>
				</div>

				<div>
					<DownloadChooser
						pubData={props.pub}
						communityId={props.pub.communityId}
						onSetDownloads={props.onUpdatePub}
						text="UPLOAD YOUR FILE"
						isMinimal
						isSmall
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<span className="info-text">
				The information you enter in this form and the content section below will be used to
				create your submission. You can use the Preview tab to see how your submission will
				appear.
			</span>
			<Label htmlFor="pub-title-input">
				<h2>Title of your submission pub</h2>
				<InputGroup
					className="submission-input"
					id="pub-title-input"
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
						onUpdatePubDebounced({ title: evt.target.value })
					}
					defaultValue={props.pub.title}
					placeholder="Type your submission's title here..."
				/>
			</Label>
			<Label htmlFor="abstract-input">
				<h2>Abstract</h2>
				<MinimalEditor
					placeholder="Type your submission's abstract here..."
					initialContent={props.abstract}
					onEdit={(doc) => props.onUpdateAbstract(doc.toJSON() as DocJson)}
					debounceEditsMs={300}
					getButtons={(buttons) => buttons.workflowButtonSet}
					useFormattingBar
					constrainHeight
				/>
			</Label>
			<Label>
				<h2>Pub Content</h2>
			</Label>
			{renderDefaultDownloadFile()}
		</>
	);
};

export default SubmissionTab;
