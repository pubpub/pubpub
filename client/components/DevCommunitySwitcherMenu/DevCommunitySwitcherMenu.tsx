import React from 'react';

import { Menu } from 'components/Menu';

import DevCommunitySwitcherMenuItems from './DevCommunitySwitcherMenuItems';

type Props = Omit<React.ComponentProps<typeof Menu>, 'children'>;

const DevCommunitySwitcherMenu = (props: Props) => {
	return (
		<Menu {...props}>
			<DevCommunitySwitcherMenuItems />
		</Menu>
	);
};

export default DevCommunitySwitcherMenu;
