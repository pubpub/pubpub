import React from 'react';
import { FormGroup, InputGroup } from '@blueprintjs/core';

const TitleDescriptionAbstract = () => {
	return (
		<>
			The information you enter in this form and pub body below will be used to create a
			submission pub, which you can preview at any time before making your final submission.
			<br />
			<br />
			<FormGroup
				helperText="Enter pub title here..."
				label="Title of your submission pub "
				labelFor="text-input"
			>
				<InputGroup id="text-input" placeholder="Placeholder text" />
			</FormGroup>
			<br />
			<FormGroup
				helperText="Enter abstruct here..."
				label="Abstract Description "
				labelFor="text-input"
			>
				<InputGroup id="text-input" placeholder="Placeholder text" />
			</FormGroup>
			<br />
			<FormGroup
				helperText="Enter description text here..."
				label=" Description "
				labelFor="text-input"
			>
				<InputGroup id="text-input" placeholder="Placeholder text" />
			</FormGroup>
			<br />
			Pub Content Enter your primary submission content in the pub body below by typing or by
			importing files in which you already have content prepared.
		</>
	);
};

export default TitleDescriptionAbstract;
