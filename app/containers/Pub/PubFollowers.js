import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Menu, MenuDivider } from '@blueprintjs/core';
import PreviewUser from 'components/PreviewUser/PreviewUser';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import { globalMessages } from 'utils/globalMessages';

let styles;

export const PubFollowers = React.createClass({
	propTypes: {
		followers: PropTypes.array,
		pathname: PropTypes.string,
		query: PropTypes.object,
	},

	sortList: function(list) {
		return list.sort((foo, bar)=> {
			const query = this.props.query;

			const fooTitle = foo.firstName || foo.title || '';
			const barTitle = bar.firstName || bar.title || '';

			const fooFollowObject = foo.FollowsJournal || foo.FollowsPub || foo.FollowsUser || foo.FollowsLabel || {};
			const barFollowObject = bar.FollowsJournal || bar.FollowsPub || bar.FollowsUser || bar.FollowsLabel || {};
			
			const fooDate = fooFollowObject.createdAt;
			const barDate = barFollowObject.createdAt;

			const newest = query.sort === 'Most Recently Followed' || query.sort === undefined;
			const oldest = query.sort === 'Least Recently Followed';

			const aToZ = query.sort === 'A → Z';
			const zToA = query.sort === 'Z → A';

			if (newest && fooDate > barDate) { return -1; }
			if (newest && fooDate < barDate) { return 1; }

			if (oldest && fooDate > barDate) { return 1; }
			if (oldest && fooDate < barDate) { return -1; }

			if (aToZ && fooTitle > barTitle) { return 1; }
			if (aToZ && fooTitle < barTitle) { return -1; }

			if (zToA && fooTitle > barTitle) { return -1; }
			if (zToA && fooTitle < barTitle) { return 1; }

			return 0;
		});
	},

	render() {
		const followers = this.props.followers || [];
		const query = this.props.query || {};
		const sortList = ['Most Recently Followed', 'Least Recently Followed', 'A → Z', 'Z → A'];

		return (
			<div style={styles.container}>
				<div style={styles.headerWrapper}>
					<div style={styles.headerTitle}>
						<h2 style={styles.header}>Followers</h2>
					</div>
					<div style={styles.headerOptions} />
					<div style={styles.headerRight}>
						<DropdownButton 
							content={
								<Menu>
									<li className={'pt-menu-header'}><h6>Sort by:</h6></li>
									<MenuDivider />
									{sortList.map((sort, index)=> {
										const sortMode = query.sort || 'Most Recently Followed';
										return (
											<li key={'sortFilter-' + index}><Link to={{ pathname: this.props.pathname, query: { ...this.props.query, sort: sort } }} className="pt-menu-item pt-popover-dismiss">
												{sort}
												{sortMode === sort && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
											</Link></li>
										);
									})}
								</Menu>
							}
							title={'Sort'} 
							position={2} />
					</div>
				</div>

				{this.sortList(followers).map((follower, index)=> {
					return <PreviewUser key={'follower-' + index} user={follower} />;
				})}

			</div>
		);
	}
});

export default Radium(PubFollowers);

styles = {
	container: {
		padding: '1.5em',
	},
	headerWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '1em',
	},
	headerTitle: {
		display: 'table-cell',
		verticalAlign: 'middle',
		paddingRight: '1em',
		width: '1%',
		whiteSpace: 'nowrap',
	},
	header: {
		margin: 0,
	},
	headerOptions: {
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	headerRight: {
		display: 'table-cell',
		verticalAlign: 'middle',
		width: '1%',
	},
	noWrap: {
		whiteSpace: 'nowrap',
	},
};
