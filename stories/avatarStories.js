import React from 'react';
import { storiesOf } from '@storybook/react';
import Avatar from 'components/Avatar/Avatar';

const wrapperStyle = { padding: '1em', display: 'flex', alignItems: 'flex-end' };

const plain = {
	userInitials: 'MF',
};

const image = {
	userAvatar: '/dev/maggie.jpg',
	width: 50,
};

const border = {
	userAvatar: '/dev/maggie.jpg',
	borderColor: 'red',
};

const sizes = [25, 50, 100, 250];
const colors = ['green', 'blue', 'red', 'purple', 'cyan', 'orange', 'magenta', 'pink'];
storiesOf('Avatar', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			{sizes.map((size)=> {
				return <Avatar key={`plain-${size}`} {...plain} width={size} />;
			})}
		</div>

		<div style={wrapperStyle}>
			{sizes.map((size)=> {
				return <Avatar key={`image-${size}`} {...image} width={size} />;
			})}
		</div>

		<div style={wrapperStyle}>
			{sizes.map((size)=> {
				return <Avatar key={`border-${size}`} {...border} width={size} />;
			})}
		</div>

		<div style={wrapperStyle}>
			{colors.map((color)=> {
				return <Avatar key={`overlap-${color}`} {...image} borderColor={color} doesOverlap={true} />;
			})}
		</div>
		<div style={wrapperStyle}>
			{colors.map((color)=> {
				return <Avatar key={`overlapImage-${color}`} {...image} doesOverlap={true} />;
			})}
		</div>

		<div style={wrapperStyle}>
			{colors.map((color)=> {
				return <Avatar key={`overlapSmall-${color}`} {...image} borderColor={color} width={25} doesOverlap={true} />;
			})}
		</div>

	</div>
));
