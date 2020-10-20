import React from 'react';
import { AnchorButton } from '@blueprintjs/core';

import { GridWrapper, Icon } from 'components';

require('./layoutManageNotice.scss');

type Props = {
	type: 'page' | 'collection';
	isPublic: boolean;
	manageUrl?: string;
};

const LayoutManageNotice = (props: Props) => {
	const { type, isPublic, manageUrl } = props;
	const displayType = type === 'collection' ? 'Collection' : 'Page';

	if (isPublic && !manageUrl) {
		return null;
	}

	const renderNotice = () => {
		if (isPublic) {
			return (
				<>
					This is a preview of a public {displayType} as visitors to this Community will
					see it.
				</>
			);
		}
		return (
			<>
				This is a preview of a private {displayType}. It will only be visible to Members
				until it is made public.
			</>
		);
	};

	return (
		<div className="layout-manage-notice-component">
			<GridWrapper columnClassName="inner">
				<div className="notice">
					<Icon icon={isPublic ? 'globe' : 'lock2'} />
					{renderNotice()}
				</div>
				{manageUrl && (
					<AnchorButton outlined href={manageUrl} icon="edit">
						Edit
					</AnchorButton>
				)}
			</GridWrapper>
		</div>
	);
};

export default LayoutManageNotice;
