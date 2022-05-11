import React from 'react';
import { storiesOf } from '@storybook/react';

import { usePageContext } from 'utils/hooks';

import HeaderControls from './HeaderControls';

type Props = Omit<React.ComponentProps<typeof HeaderControls>, 'onCreatePub' | 'onLogout'> & {
	title: string;
};

const WrappedHeaderControls = (props: Props) => {
	const { title, ...restProps } = props;
	const { communityData } = usePageContext();
	return (
		<div style={{ marginBottom: '1em' }}>
			<h4>{title}</h4>
			<div
				style={{
					width: '100%',
					backgroundColor: communityData.accentColorDark,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
					minHeight: '40px',
				}}
			>
				<HeaderControls {...restProps} onCreatePub={() => {}} onLogout={() => {}} />
			</div>
		</div>
	);
};

storiesOf('components/HeaderControls', module).add('default', () => (
	<>
		<WrappedHeaderControls loggedIn={true} title="Logged in" />
		<WrappedHeaderControls loggedIn={false} title="Logged out" />
		<WrappedHeaderControls isBasePubPub loggedIn={true} title="Logged in (base)" />
		<WrappedHeaderControls isBasePubPub loggedIn={false} title="Logged out (base)" />
	</>
));
