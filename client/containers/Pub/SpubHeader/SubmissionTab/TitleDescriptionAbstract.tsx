import React from 'react';
import { Label, InputGroup } from '@blueprintjs/core';
import { useDebouncedCallback } from 'use-debounce';

import { PubPageData, Pub, DocJson } from 'types';
import { MinimalEditor } from 'components';

type Props = {
	pub: Pub;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
};

const TitleDescriptionAbstract = (props: Props) => {
	const [onUpdatePubDebounced] = useDebouncedCallback(props.onUpdatePub, 250);
	return (
		<>
			The information you enter in this form and pub body below will be used to create a
			submission pub, which you can preview at any time before making your final submission.
			<Label>
				Title of your submission pub
				<InputGroup
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
						onUpdatePubDebounced({ title: evt.target.value })
					}
					defaultValue={props.pub.title}
					placeholder="Enter pub title here..."
				/>
			</Label>
			<Label>Abstract</Label>
			<MinimalEditor
				initialContent={props.abstract}
				onEdit={(doc) => props.onUpdateAbstract(doc.toJSON() as DocJson)}
				debounceEditsMs={300}
				getButtons={(buttons) => buttons.workflowButtonSet}
				useFormattingBar
				constrainHeight
			/>
			<Label>
				Description
				<InputGroup
					placeholder="Enter description text here..."
					defaultValue={props.pub.description}
					onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
						onUpdatePubDebounced({ description: evt.target.value })
					}
				/>
			</Label>
		</>
	);
};

export default TitleDescriptionAbstract;
