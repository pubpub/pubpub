import React from 'react';
import { storiesOf } from '@storybook/react';
import Footer from 'components/Footer/Footer';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark, accentDataLight } from './_data';

storiesOf('Footer', module)
.add('Styled Dark', () => (
	<div>
		<AccentStyle {...accentDataDark} />
		<Footer isAdmin={true} />
	</div>
))
.add('Styled Light', () => (
	<div>
		<AccentStyle {...accentDataLight} />
		<Footer />
	</div>
));
