import React from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';
import { Submission, Pub } from 'types';

type Props = {
	onUpdatePub?: (pub: Partial<Pub>) => unknown;
	onUpdateSubmission?: (submission: Partial<Submission>) => unknown;
};

const TitleDescriptionAbstract = (props: Props) => {
	// TODO: weave these in to actually manage the spub
	const { onUpdatePub: _, onUpdateSubmission: __ } = props;

	return (
		<>
			The information you enter in this form and pub body below will be used to create a
			submission pub, which you can preview at any time before making your final submission.
			<br />
			<br />
			<FormGroup label="Title of your submission pub " labelFor="text-input">
				<InputGroup id="text-input" placeholder="Enter pub title here..." />
			</FormGroup>
			<br />
			<FormGroup label="Abstract Description " labelFor="text-input">
				<InputGroup id="text-input" placeholder="Enter abstruct here..." />
			</FormGroup>
			<br />
			<FormGroup label=" Description " labelFor="text-input">
				<InputGroup id="text-input" placeholder="Enter description text here..." />
			</FormGroup>
			<br />
			Pub Content Enter your primary submission content in the pub body below by typing or by
			importing files in which you already have content prepared.
		</>
	);
};

export default TitleDescriptionAbstract;
