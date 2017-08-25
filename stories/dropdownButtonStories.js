import React from 'react';
import { storiesOf } from '@storybook/react';
import DropdownButton from 'components/DropdownButton/DropdownButton';

const wrapperStyle = { margin: '1em' };
const menu = (
	<ul className={'pt-menu'}>
		<li>
			<div className="pt-menu-item pt-popover-dismiss">
				Hello
			</div>
			<div className="pt-menu-item pt-popover-dismiss">
				Option 1
			</div>
			<div className="pt-menu-item pt-popover-dismiss">
				Option 2
			</div>
		</li>
	</ul>
);
storiesOf('DropdownButton', module)
.add('Default', () => (
	<div>
		<div style={{ wrapperStyle, float: 'right' }}>
			<DropdownButton label={'My Button'} isRightAligned={true}>
				{menu}
			</DropdownButton>
		</div>
		<div style={wrapperStyle}>
			<DropdownButton label={'My Button'}>
				{menu}
			</DropdownButton>
		</div>
		<div style={wrapperStyle}>
			<DropdownButton icon={'pt-icon-predictive-analysis'}>
				{menu}
			</DropdownButton>
		</div>
		<div style={wrapperStyle}>
			<DropdownButton icon={'pt-icon-predictive-analysis pt-small'}>
				{menu}
			</DropdownButton>
		</div>
	</div>
));
