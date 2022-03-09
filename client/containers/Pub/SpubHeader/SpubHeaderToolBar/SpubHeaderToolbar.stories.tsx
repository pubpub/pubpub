import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { TabId } from '@blueprintjs/core';

import { pubData } from 'utils/storybook/data';
import { Submission } from 'types';

import SpubHeaderToolBar from './SpubHeaderToolbar';
import '../SpubHeader.stories.scss';

const StatefulSpubHeaderToolBaraWrapper = () => {
	const [selectedTab, setSelectedTab] = useState<TabId>('instructions');
	return (
		<SpubHeaderToolBar
			selectedTab={selectedTab}
			onSelectTab={setSelectedTab}
			submission={pubData.submission as Submission}
		/>
	);
};

storiesOf('containers/Pub/SpubHeader/SpubHeaderToolbar', module).add('default', () => (
	<StatefulSpubHeaderToolBaraWrapper />
));
