import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Tab, TabList, useTabState } from 'reakit/Tab';

import { SubmissionWorkflowConfigStep, submissionWorkflowConfigSteps } from './types';

require('./submissionWorkflowStepPicker.scss');

type Props = {
	selectedStep: SubmissionWorkflowConfigStep;
	onSelectStep: (step: SubmissionWorkflowConfigStep) => unknown;
	stepCompletions: Record<SubmissionWorkflowConfigStep, boolean>;
};

const stepLabels: Record<SubmissionWorkflowConfigStep, React.ReactNode> = {
	'instructions-requirements': 'Instructions & Requirements',
	'response-emails': 'Email templates',
	'layout-banner': 'Invitation text',
};

const SubmissionWorkflowStepPicker = (props: Props) => {
	const { selectedStep, onSelectStep, stepCompletions } = props;
	const tabs = useTabState({ currentId: selectedStep });
	const selectedStepIndex = submissionWorkflowConfigSteps.indexOf(selectedStep);

	useEffect(() => {
		if (tabs.currentId) {
			onSelectStep(tabs.currentId as SubmissionWorkflowConfigStep);
		}
	}, [tabs.currentId, onSelectStep]);

	return (
		<TabList
			{...tabs}
			className="submission-workflow-step-picker-component"
			aria-label="Workflow configuration steps"
		>
			{Object.entries(stepLabels).map(([step, label], index) => {
				const complete = stepCompletions[step];
				const passed = selectedStepIndex >= index;
				return (
					<>
						<Tab
							{...tabs}
							id={step}
							as="div"
							className={classNames('step', passed && 'passed')}
							stopId=""
						>
							<div className="label">
								<span className="number">{index + 1}</span>
								{label}
							</div>
							<div className="progress-indicator" />
						</Tab>
					</>
				);
			})}
		</TabList>
	);
};

export default SubmissionWorkflowStepPicker;
