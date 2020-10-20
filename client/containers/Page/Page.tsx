import React from 'react';

import { Layout, LayoutManageNotice } from 'components/Layout';
import { LayoutBlock } from 'utils/layout/types';
import { getDefaultLayout } from 'utils/pages';
import { usePageContext } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';

type Props = {
	pageData: {
		pubs: any[];
		isNarrow: boolean;
		isPublic: boolean;
		slug: string;
		layout: LayoutBlock[];
	};
};

const Page = (props: Props) => {
	const { pageData } = props;
	const {
		scopeData: {
			activePermissions: { canManageCommunity },
		},
	} = usePageContext();
	const blocks = pageData.layout || getDefaultLayout();
	const manageUrl = canManageCommunity && getDashUrl({ mode: 'pages', subMode: pageData.slug });
	return (
		<>
			<LayoutManageNotice type="page" isPublic={pageData.isPublic} manageUrl={manageUrl} />
			<Layout blocks={blocks} isNarrow={pageData.isNarrow} pubs={pageData.pubs} />
		</>
	);
};

export default Page;
