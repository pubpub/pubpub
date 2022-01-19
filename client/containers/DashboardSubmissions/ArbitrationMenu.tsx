import React from 'react';
import { Button } from '@blueprintjs/core';

import { DefinitelyHas, Pub, SubmissionStatus, DocJson } from 'types';
import { Icon, IconName, DialogLauncher } from 'client/components';
import { apiFetch } from 'client/utils/apiFetch';
import VerdictDialog from './VerdictDialog';

require('./arbitrationMenu.scss');

const getArbitrationOptions = (submission) =>
	!submission.submissionWorkflow
		? []
		: [
				{
					icon: 'cross',
					shouldOfferEmail: false,
					actionTitle: 'Delete',
					completedName: 'deleted',
					onSubmit: () =>
						apiFetch('/api/pub', {
							method: 'DELETE',
							body: JSON.stringify({
								id: submission.pubId,
							}),
						}).then(() => submission),
				},
				{
					icon: 'thumbs-down',
					shouldOfferEmail: true,
					actionTitle: 'Decline',
					completedName: 'declined',
					status: 'declined' as SubmissionStatus,
					initialEmailText: submission.submissionWorkflow.declinedText,
					onSubmit: (customEmailText?: DocJson, shouldSendEmail?: boolean) =>
						apiFetch('/api/submissions', {
							method: 'PUT',
							body: JSON.stringify({
								id: submission.id,
								status: 'declined',
								skipEmail: !shouldSendEmail,
								customEmailText:
									customEmailText || submission.submissionWorkflow.declinedText,
							}),
						}),
				},
				{
					icon: 'endorsed',
					shouldOfferEmail: true,
					actionTitle: 'Accept',
					completedName: 'accepted',
					status: 'accepted' as SubmissionStatus,
					initialEmailText: submission.submissionWorkflow.acceptedText,
					onSubmit: (customEmailText?: DocJson, shouldSendEmail?: boolean) =>
						apiFetch('/api/submissions', {
							method: 'PUT',
							body: JSON.stringify({
								id: submission.id,
								status: 'accepted',
								skipEmail: !shouldSendEmail,
								...(customEmailText && { customEmailText }),
							}),
						}),
				},
		  ];

type Props = {
	pub: DefinitelyHas<Pub, 'submission'>;
	onJudgePub: (pubId: string, status?: SubmissionStatus) => void;
};

const ArbitrationMenu = (props: Props) => (
	<div className="arbitration-menu">
		{getArbitrationOptions(props.pub.submission).map((option, index) => (
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
