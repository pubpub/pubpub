import React from 'react';

import { SubmissionWorkflow } from 'types';
import { Editor } from 'components';

type Props = {
	workflow: SubmissionWorkflow;
};

const InstructionsTab = (props: Props) => {
	const { workflow } = props;
	return (
		<>
			<h1 className="submission-workflow-title">{workflow.title}</h1>
			<Editor initialContent={workflow.instructionsText} isReadOnly />
		</>
	);
};

export default InstructionsTab;
