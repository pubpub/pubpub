import React from 'react';

import { Pub } from 'utils/types';
import { LayoutBlockPubs } from 'utils/layout/types';

import BaseLayoutPubs from './BaseLayoutPubs';

type Props = {
	content: LayoutBlockPubs['content'];
	pubs: Pub[];
};

const LayoutPubs = (props: Props) => {
	const { content, pubs } = props;
	return (
		<BaseLayoutPubs
			pubs={pubs}
			className="layout-pubs-component"
			pubsContentOptions={content}
		/>
	);
};

export default LayoutPubs;
