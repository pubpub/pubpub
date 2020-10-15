import React from 'react';
import Color from 'color';

import { Byline, GridWrapper } from 'components';
import { Collection } from 'utils/types';
import { LayoutBlockCollectionHeader } from 'utils/layout/types';
import { usePageContext } from 'utils/hooks';
import { getAllCollectionContributors } from 'utils/contributors';

require('./layoutCollectionHeader.scss');

type Props = {
	collection: Collection;
	content: LayoutBlockCollectionHeader['content'];
};

const LayoutCollectionHeader = (props: Props) => {
	const {
		collection,
		content: { hideByline },
	} = props;
	const {
		communityData: { accentColorDark },
	} = usePageContext();
	const backgroundColor = Color(accentColorDark).mix(Color('white'), 0.8);
	const bylineContributors = getAllCollectionContributors(collection, false, true);
	return (
		<div
			className="layout-collection-header-component"
			style={{ backgroundColor: backgroundColor }}
		>
			<GridWrapper>
				<h1>{collection.title}</h1>
				{bylineContributors && !hideByline && <Byline contributors={bylineContributors} />}
			</GridWrapper>
		</div>
	);
};

export default LayoutCollectionHeader;
