import React from 'react';

import { SubmissionWorkflow } from 'types';

type Props = {
	instructions: SubmissionWorkflow['instructionsText'];
};

const InstructionTab = (props: Props) => {
	const { instructions = null } = props;
	return <>{instructions?.content[0]}</>;
};

export default InstructionTab;
