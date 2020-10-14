import React from 'react';
import classNames from 'classnames';

import { getPubsByBlockIndex } from 'utils/layout';
import { LayoutBlock, LayoutOptions } from 'utils/layout/types';
import { usePageContext } from 'utils/hooks';

import LayoutPubs from './LayoutPubs';
import LayoutHtml from './LayoutHtml';
import LayoutBanner from './LayoutBanner';
import LayoutText from './LayoutText';
import LayoutPagesCollections from './LayoutPagesCollections';

require('./layout.scss');

type Props = LayoutOptions & {
	blocks: LayoutBlock[];
	id?: string;
	pubs: any[];
	collectionId?: string;
};

const Layout = (props: Props) => {
	const { locationData, loginData, communityData } = usePageContext();
	const { blocks, isNarrow, pubs, id = '', collectionId } = props;
	const pubBlocksLists = getPubsByBlockIndex(blocks, pubs, { collectionId: collectionId });

	const renderBlock = (block: LayoutBlock, index: number) => {
		if (block.type === 'pubs') {
			return (
				<div className="layout-pubs-block">
					<LayoutPubs key={index} content={block.content} pubs={pubBlocksLists[index]} />
				</div>
			);
		}
		if (block.type === 'text') {
			return <LayoutText key={index} content={block.content} />;
		}
		if (block.type === 'html') {
			return <LayoutHtml key={index} content={block.content} />;
		}
		if (block.type === 'banner') {
			return (
				<LayoutBanner
					key={index}
					content={block.content}
					communityData={communityData}
					loginData={loginData}
					locationData={locationData}
				/>
			);
		}
		if (block.type === 'pages' || block.type === 'collections-pages') {
			return (
				<div className="layout-pages-block">
					<LayoutPagesCollections
						key={index}
						content={block.content}
						pages={communityData.pages}
						collections={communityData.collections}
					/>
				</div>
			);
		}
		return null;
	};

	return (
		<div
			id={id}
			className={classNames(
				'layout-component',
				isNarrow && 'narrow',
				locationData.query.display === 'ultrawide' && 'ultrawide',
			)}
		>
			{blocks.map(renderBlock)}
		</div>
	);
};

export default Layout;
