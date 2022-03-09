import React from 'react';
import { Tab, Tabs, TabId, Icon, IconName } from '@blueprintjs/core';

import { GridWrapper } from 'components';
import { DefinitelyHas, DocJson, PubHistoryState, PubPageData } from 'types';

const renderTabTitle = (icon: IconName, title: string) => (
	<>
		<Icon icon={icon} /> {title}
	</>
);

type Props = {
	pubData: DefinitelyHas<PubPageData, 'submission'>;
	abstract: DocJson;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
	onUpdateAbstract: (abstract: DocJson) => Promise<unknown>;
	historyData: PubHistoryState;
	updateHistoryData: (patch: Partial<PubHistoryState>) => unknown;
};

const SpubHeaderToolbar = (props: Props) => {
	return <GridWrapper>Its a tool bar not a box lol</GridWrapper>;
};

export default SpubHeaderToolbar;
