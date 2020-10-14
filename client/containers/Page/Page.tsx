import React from 'react';

import { Layout } from 'components';
import { LayoutBlock } from 'utils/layout/types';
import { getDefaultLayout } from 'utils/pages';

type Props = {
	pageData: {
		pubs: any[];
		isNarrow: boolean;
		layout: LayoutBlock[];
	};
};

export const validBlockTypes = [
	'pubs',
	'text',
	'html',
	'banner',
	'pages', // TODO(ian): Remove this after migration
	'collections-pages',
];

const Page = (props: Props) => {
	const { pageData } = props;
	const blocks = pageData.layout || getDefaultLayout();
	return <Layout blocks={blocks} isNarrow={pageData.isNarrow} pubs={pageData.pubs} />;
};
export default Page;
