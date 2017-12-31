import React from 'react';
import { storiesOf } from '@storybook/react';
import Login from 'containers/Login/Login';
import { initialData } from '../data';

require('containers/Login/login.scss');

storiesOf('Containers/Login', module)
.add('Default', () => (
	<Login {...initialData} />
));
