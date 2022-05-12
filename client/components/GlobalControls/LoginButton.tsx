import React from 'react';
import { LocationData } from 'types';

import GlobalControlsButton from './GlobalControlsButton';

type Props = {
	locationData: LocationData;
};

const LoginButton = (props: Props) => {
	const { locationData } = props;
	const { path, queryString } = locationData;
	const redirectString = `?redirect=${path}${queryString.length > 1 ? queryString : ''}`;
	const loginHref = `/login${redirectString}`;
	return <GlobalControlsButton href={loginHref} mobileOrDesktop={{ text: 'Login or Signup' }} />;
};

export default LoginButton;
