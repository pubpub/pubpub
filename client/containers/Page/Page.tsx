import React from 'react';
import classNames from 'classnames';

import { getDefaultLayout, generateRenderLists } from 'utils/pages';
import { usePageContext } from 'utils/hooks';

import LayoutPubs from './LayoutPubs';
import LayoutHtml from './LayoutHtml';
import LayoutBanner from './LayoutBanner';
import LayoutText from './LayoutText';
import LayoutPagesCollections from './LayoutPagesCollections';

require('./page.scss');

type Props = {
	pageData: any;
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
	const { locationData, communityData, loginData } = usePageContext();
	const pageData = props.pageData;
	const slug = locationData.params.slug;
	const title = communityData.pages.reduce((prev, curr) => {
		if (curr.slug === '' && slug === undefined) {
			return curr.title;
		}
		if (curr.slug === slug) {
			return curr.title;
		}
		return prev;
	}, undefined);
	if (!title) {
		return <h1>Nothing</h1>;
	}

	const layout = pageData.layout || getDefaultLayout();
	const pubRenderLists = generateRenderLists(layout, props.pageData.pubs);
	return (
		<div
			id="page-container"
			className={classNames({
				narrow: pageData.isNarrowWidth,
				ultrawide: locationData.query.display === 'ultrawide',
			})}
		>
			{layout.map((item, index) => {
				const validType = validBlockTypes.indexOf(item.type) > -1;
				if (!validType) {
					return null;
				}
				return (
					<div key={`block-${item.id}`} className="component-wrapper">
						{item.type === 'pubs' && (
							<LayoutPubs
								key={`item-${item.id}`}
								content={item.content}
								pubRenderList={pubRenderLists[index]}
							/>
						)}
						{item.type === 'text' && (
							<LayoutText key={`item-${item.id}`} content={item.content} />
						)}
						{item.type === 'html' && (
							<LayoutHtml key={`item-${item.id}`} content={item.content} />
						)}
						{item.type === 'banner' && (
							<LayoutBanner
								key={`item-${item.id}`}
								content={item.content}
								communityData={communityData}
								loginData={loginData}
								locationData={locationData}
							/>
						)}
						{(item.type === 'pages' || item.type === 'collections-pages') && (
							<div className="layout-pages-block">
								<LayoutPagesCollections
									key={`item-${item.id}`}
									content={item.content}
									pages={communityData.pages}
									collections={communityData.collections}
								/>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};
export default Page;
