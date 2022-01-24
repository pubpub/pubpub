import React from 'react';
import { Button } from '@blueprintjs/core';

import { DefinitelyHas, Pub, SubmissionStatus, DocJson } from 'types';
import { Icon, IconName, DialogLauncher } from 'client/components';
import { apiFetch } from 'client/utils/apiFetch';
import VerdictDialog from './VerdictDialog';

require('./arbitrationMenu.scss');

type Props = {
	pub: DefinitelyHas<Pub, 'submission'>;
	onJudgePub: (pubId: string, status?: SubmissionStatus) => void;
};

const ArbitrationMenu = (props: Props) => (
	<div className="arbitration-menu-component">
		<div style={{ gridColumn: 1 }}>
			<DialogLauncher
				renderLauncherElement={({ openDialog }) => (
					<Button
						minimal
						small
						icon={<Icon icon={'cross' as IconName} iconSize={20} />}
						onClick={openDialog}
					/>
				)}
			>
				{({ isOpen, onClose }) => (
					<VerdictDialog
						isOpen={isOpen}
						onClose={onClose}
						shouldOfferEmail={false}
						actionTitle="Delete"
						completedName="deleted"
						onSubmit={() =>
							apiFetch('/api/pub', {
								method: 'DELETE',
								body: JSON.stringify({
									id: props.pub.submission.pubId,
								}),
							}).then(() => props.pub.submission)
						}
						pub={props.pub as DefinitelyHas<Pub, 'submission'>}
						onJudgePub={props.onJudgePub}
					/>
				)}
			</DialogLauncher>
		</div>
		{[
			{ presentTense: 'Decline', pastTense: 'declined', iconName: 'thumbs-down' },
			{ presentTense: 'Accept', pastTense: 'accepted', iconName: 'endorsed' },
		].map(
			({ presentTense, pastTense, iconName }, index) =>
				props.pub.submission.status !== pastTense && (
					<div style={{ gridColumn: index + 2 }}>
						<DialogLauncher
							renderLauncherElement={({ openDialog }) => (
								<Button
									minimal
									small
									icon={<Icon icon={iconName as IconName} iconSize={20} />}
									onClick={openDialog}
								/>
							)}
						>
							{({ isOpen, onClose }) => (
								<VerdictDialog
									isOpen={isOpen}
									onClose={onClose}
									shouldOfferEmail={true}
									actionTitle={presentTense}
									completedName={pastTense}
									status={pastTense as SubmissionStatus}
									initialEmailText={
										props.pub.submission.submissionWorkflow?.[
											`${pastTense}Text`
										]
									}
									onSubmit={(
										customEmailText?: DocJson,
										shouldSendEmail?: boolean,
									) =>
										apiFetch.put('/api/submissions', {
											id: props.pub.submission.id,
											status: pastTense,
											skipEmail: !shouldSendEmail,
											customEmailText:
												customEmailText ||
												props.pub.submission.submissionWorkflow?.[
													`${pastTense}Text`
												],
										})
									}
									pub={props.pub as DefinitelyHas<Pub, 'submission'>}
									onJudgePub={props.onJudgePub}
								/>
							)}
						</DialogLauncher>
					</div>
				),
		)}
	</div>
);

export default ArbitrationMenu;
