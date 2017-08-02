import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Header from 'components/Header/Header';

storiesOf('Header2', module)
.add('Default2', () => (
	<Header isHome={false} logo={'https://assets.pubpub.org/_site/logo_dark.png'} />
));