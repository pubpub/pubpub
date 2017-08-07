import React from 'react';
import { storiesOf } from '@storybook/react';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import Header from 'components/Header/Header';
import { Button, Intent, Tag } from '@blueprintjs/core';

// const pageStyle = { backgroundColor: '#555' };
const wrapperStyle = { padding: '1em', display: 'flex', alignItems: 'flex-end' };


storiesOf('AccentStyle', module)
.add('dark1', () => (
	<div>
		<AccentStyle
			accentColor={'#D13232'}
			accentTextColor={'#FFF'}
			accentActionColor={'#A72828'}
			accentHoverColor={'#BC2D2D'}
			accentMinimalColor={'rgba(209, 50, 50, 0.15)'}
		/>
		<Header
			userName={'Maggie Farnkrux'}
			userSlug={'maggiefarn'}
			userAvatar={'/dev/maggie.jpg'}
			userIsAdmin={true}
			pageSlug={'about'}
			appLogo={'/dev/viralLogo.png'}
		/>

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
					<div className={'pt-tag pt-intent-primary'}>Primary Tag!</div>
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
));
