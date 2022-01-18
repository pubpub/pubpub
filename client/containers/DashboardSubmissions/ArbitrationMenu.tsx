import React from 'react';
import { Button } from '@blueprintjs/core';

import { DefinitelyHas, Pub, SubmissionWorkflow, SubmissionStatus } from 'types';
import { Icon, IconName, DialogLauncher } from 'client/components';
import VerdictDialog from './VerdictDialog';

require('./arbitrationMenu.scss');

const getArbitrationOptions = (submissionWorkflow?: SubmissionWorkflow) =>
	!submissionWorkflow
		? []
		: [
				{
					icon: 'cross',
					actionTitle: 'Delete',
					completedName: 'deleted',
					apiMethod: 'DELETE',
				},
				{
					icon: 'thumbs-down',
					actionTitle: 'Decline',
					completedName: 'declined',
					apiMethod: 'PUT',
					status: 'declined' as SubmissionStatus,
					initialEmailText: submissionWorkflow.declinedText,
				},
				{
					icon: 'endorsed',
					actionTitle: 'Accept',
					completedName: 'accepted',
					apiMethod: 'PUT',
					status: 'accepted' as SubmissionStatus,
					initialEmailText: submissionWorkflow.acceptedText,
				},
		  ];

type Props = {
	pub: DefinitelyHas<Pub, 'submission'>;
	onJudgePub: (pubId: string, status?: SubmissionStatus) => void;
};

const ArbitrationMenu = (props: Props) => (
	<div className="arbitration-menu">
		{getArbitrationOptions(props.pub.submission.submissionWorkflow).map((option, index) => (
			<div style={{ gridColumn: index + 1 }} key={option.actionTitle}>
				{props.pub.submission.status !== option.status && (
					<DialogLauncher
						renderLauncherElement={({ openDialog }) => (
							<Button
								minimal
								small
								icon={<Icon icon={option.icon as IconName} iconSize={20} />}
								onClick={openDialog}
							/>
						)}
					>
						{({ isOpen, onClose }) => (
							<VerdictDialog
								isOpen={isOpen}
								onClose={onClose}
								{...option}
								pub={props.pub as DefinitelyHas<Pub, 'submission'>}
								onJudgePub={props.onJudgePub}
							/>
						)}
					</DialogLauncher>
				)}
			</div>
		))}
	</div>
);

export default ArbitrationMenu;
