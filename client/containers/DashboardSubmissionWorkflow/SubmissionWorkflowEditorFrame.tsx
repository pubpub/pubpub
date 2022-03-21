import React from 'react';

require('./submissionWorkflowEditorFrame.scss');

type Props = {
	top: React.ReactNode;
	children: React.ReactNode;
};

const SubmissionWorkflowEditorFrame = (props: Props) => {
	const { top, children } = props;
	return (
		<div className="submission-workflow-editor-frame-component">
			<div className="submission-workflow-editor-frame-top">{top}</div>
			<div className="contents">{children}</div>
		</div>
	);
};

export default SubmissionWorkflowEditorFrame;
