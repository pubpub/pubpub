import React from 'react';
import { storiesOf } from '@storybook/react';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { Button, Intent, Tag } from '@blueprintjs/core';
import Header from 'components/Header/Header';
import NavBar from 'components/NavBar/NavBar';
import { navItems, accentDataDark, accentDataLight } from './_data';

const content = (
	<div>
		<Header
			userName={'Maggie Farnkrux'}
			userSlug={'maggiefarn'}
			userAvatar={'/dev/maggie.jpg'}
			userIsAdmin={true}
			pageSlug={'about'}
			appLogo={'/dev/viralLogo.png'}
			logoutHandler={()=>{}}
		/>
		<NavBar navItems={navItems} />

		<div className={'container'}>
			<div className={'row'}>
				<div className={'col-12'}>
					<h2>Buttons</h2>
					<button className={'pt-button'}>Plain Button</button>
					<span> · </span>
					<button className={'pt-button pt-intent-primary'}>Primary Button</button>
					<span> · </span>
					<Button intent={Intent.PRIMARY} text={'JS Primary Button'} />
				</div>
			</div>

			<div className={'row'}>
				<div className={'col-12'}>
					<h2>Tags</h2>
					<div className={'pt-tag'}>Plain Tag</div>
					<span> · </span>
					<div className={'pt-tag pt-intent-primary'}>Primary Tag</div>
					<span> · </span>
					<Tag intent={Intent.PRIMARY}>JS Primary Tag</Tag>
				</div>
			</div>
			<div className={'row'}>
				<div className={'col-12'}>
					<h2>Minimal Tags</h2>
					<div className={'pt-tag pt-minimal'}>Plain Minimal Tag</div>
					<span> · </span>
					<div className={'pt-tag pt-minimal pt-intent-primary'}>Primary Tag</div>
					<span> · </span>
					<Tag className={'pt-minimal'} intent={Intent.PRIMARY}>JS Primary Tag</Tag>
				</div>
			</div>

		</div>
	</div>
);

storiesOf('AccentStyle', module)
.add('Dark 1', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		{content}
	</div>
))
.add('Light 1', () => (
	<div>
		<AccentStyle {...accentDataLight} />
		{content}
	</div>
));
