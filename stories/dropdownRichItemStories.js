import React from 'react';
import { storiesOf } from '@storybook/react';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';

const wrapperStyle = {
	display: 'inline-block',
	margin: '1em',
	boxShadow: '0px 0px 2px #CCC'
};

storiesOf('DropdownRichItem', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<DropdownRichItem
				title={'Private Collaboration'}
				description={'Collaborators must be invited. The public can view and make suggestions on published snapshots.'}
				icon={'pt-icon-lock2'}
			/>
		</div>
		<div style={wrapperStyle}>
			<DropdownRichItem
				title={'Private Collaboration'}
				icon={'pt-icon-lock2'}
			/>
		</div>
		<div style={wrapperStyle}>
			<DropdownRichItem
				title={'Private Collaboration'}
				description={'Collaborators must be invited. The public can view and make suggestions on published snapshots.'}
			/>
		</div>

		<div style={{ margin: '1em', }}>
			<DropdownButton label={'Public Collaboration'} icon={'pt-icon-globe'}>
				<div className={'pt-menu'}>
					<DropdownRichItem
						title={'Private Collaboration'}
						description={'Collaborators must be invited. The public can view and make suggestions on published snapshots.'}
						icon={'pt-icon-lock2'}
					/>
					<DropdownRichItem
						title={'Public Suggestions'}
						description={'The working draft will be visible to all and suggestions can be made.'}
						icon={'pt-icon-team'}
					/>
					<DropdownRichItem
						title={'Public Collaboration'}
						description={'The working draft will be editable by anyone.'}
						icon={'pt-icon-globe'}
						hideBottomBorder={true}
					/>
				</div>
			</DropdownButton>
		</div>
	</div>
));
