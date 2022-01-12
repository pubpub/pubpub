import React from 'react';
import { Button } from '@blueprintjs/core';

import { DefinitelyHas, Pub } from 'types';
import { Icon, IconName, DialogLauncher } from 'client/components';
import VerdictDialog from './VerdictDialog';

require('./arbitrationMenu.scss');

const arbitrationOptions = [
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
		status: 'declined',
	},
	{
		icon: 'endorsed',
		actionTitle: 'Accept',
		completedName: 'accepted',
		apiMethod: 'PUT',
		status: 'accepted',
	},
];

type Props = {
	pub: DefinitelyHas<Pub, 'submission'>;
};

const ArbitrationMenu = (props: Props) => {
	return (
		<div className="arbitration-menu">
			{arbitrationOptions.map((option, index) => (
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
									pub={props.pub}
								/>
							)}
						</DialogLauncher>
					)}
				</div>
			))}
		</div>
	);
};

export default ArbitrationMenu;
