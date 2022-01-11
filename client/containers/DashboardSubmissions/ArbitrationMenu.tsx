import React from 'react';
import { Button, Dialog } from '@blueprintjs/core';

import { Submission, DefinitelyHas, Pub } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { Icon, IconName, DialogLauncher } from 'client/components';

require('./arbitrationMenu.scss');

const arbitrationOptions = [
	{
		icon: 'cross',
		actionTitle: 'Delete',
		actionHelpText: 'Would you like to delete this Submission?',
		onSubmit: (submission: Submission) => () => {
			apiFetch('/api/submissions', {
				method: 'DELETE',
				body: JSON.stringify(submission),
			});
		},
	},
	{
		icon: 'thumbs-down',
		targetStatus: 'declined',
		actionTitle: 'Decline',
		actionHelpText: 'Would you like to decline this Submission?',
		onSubmit: (submission: Submission) => () => {
			apiFetch('/api/submissions', {
				method: 'PUT',
				body: JSON.stringify({
					id: submission.id,
					status: 'declined',
				}),
			});
		},
	},
	{
		icon: 'endorsed',
		actionTitle: 'Accept',
		targetStatus: 'accepted',
		actionHelpText: 'Would you like to accept this Submission?',
		onSubmit: (submission: Submission) => () => {
			apiFetch('/api/submissions', {
				method: 'PUT',
				body: JSON.stringify({
					id: submission.id,
					status: 'accepted',
				}),
			});
		},
	},
];

type Props = {
	pub: DefinitelyHas<Pub, 'submission'>;
};

type DialogProps = {
	isOpen: boolean;
	actionTitle: string;
	actionHelpText: string;
	handleSubmission: () => any;
	onClose: (...args: any[]) => any;
};

const VerdictDialog = (props: DialogProps) => {
	const { isOpen, onClose, actionTitle, actionHelpText, handleSubmission } = props;
	return (
		<Dialog
			lazy={true}
			title={`${actionTitle} this submission`}
			className="verdictDialog"
			isOpen={isOpen}
			onClose={onClose}
		>
			<div>{actionHelpText}</div>
			<Button minimal onClick={handleSubmission}>
				{actionTitle}
			</Button>
		</Dialog>
	);
};

const ArbitrationMenu = (props: Props) => (
	<div className="arbitration-menu">
		{arbitrationOptions.map((option, index) => (
			<div style={{ gridColumn: index + 1 }} key={option.actionTitle}>
				{props.pub.submission.status !== option.targetStatus && (
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
								handleSubmission={option.onSubmit(props.pub.submission)}
								actionTitle={option.actionTitle}
								isOpen={isOpen}
								onClose={onClose}
								actionHelpText={option.actionHelpText}
							/>
						)}
					</DialogLauncher>
				)}
			</div>
		))}
	</div>
);

export default ArbitrationMenu;
