import React from 'react';

import { DocJson } from 'types';
import { Editor } from 'components';

type Props = {
	instructions: DocJson;
};

const InstructionsTab = (props: Props) => {
	const { instructions } = props;
	return <Editor initialContent={instructions} isReadOnly />;
};

export default InstructionsTab;
