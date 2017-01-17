import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Menu, MenuDivider, NonIdealState } from '@blueprintjs/core';
import { PreviewDiscussion, PreviewPub, DropdownButton } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const UserPubs = React.createClass({
	propTypes: {
		user: PropTypes.object,
		ownProfile: PropTypes.bool,
		pathname: PropTypes.string, 
		query: PropTypes.object,
	},

	sortList: function(list) {
		return list.sort((foo, bar)=> {
			const query = this.props.query;

			const fooTitle = foo.firstName || foo.title || '';
			const barTitle = bar.firstName || bar.title || '';
			
			const fooDate = foo.updatedAt;
			const barDate = bar.updatedAt;

			const newest = query.sort === 'Most Recently Updated' || query.sort === undefined;
			const oldest = query.sort === 'Least Recently Updated';

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
		const user = this.props.user || {};

		const contributions = user.contributions || [];
		const pubs = contributions.map((item)=> {
			return {
				...item.pub,
				isAuthor: item.isAuthor
			};
		});
		
		const query = this.props.query || {};
		const mode = query.mode;
		const sortList = ['Most Recently Updated', 'Least Recently Updated', 'A → Z', 'Z → A'];

		const discussions = pubs.filter((pub)=> {
			return !!pub.replyRootPubId;
		});
		const notDiscussions = pubs.filter((pub)=> {
			return !pub.replyRootPubId;
		});
		const authoredPubs = notDiscussions.filter((pub)=>{
			return pub.isAuthor;
		});
		const contributedPubs = notDiscussions.filter((pub)=>{
			return !pub.isAuthor;
		});

		return (
			<div style={styles.container}>
				<div style={styles.headerWrapper}>
					<div style={styles.headerTitle}>
						<h2 style={styles.header}>Pubs</h2>
					</div>
					<div style={styles.headerOptions}>
						<div className="pt-button-group pt-minimal">
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: undefined } }} className={mode === undefined || mode === 'authored' ? 'pt-button pt-active' : 'pt-button'}>Authored</Link>
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: 'contributed' } }} className={mode === 'contributed' ? 'pt-button pt-active' : 'pt-button'}>Contributed</Link>
							<Link to={{ pathname: this.props.pathname, query: { ...query, mode: 'discussions' } }} className={mode === 'discussions' ? 'pt-button pt-active' : 'pt-button'}>Discussions</Link>
							{/* <Link to={{ pathname: this.props.pathname, query: { ...query, mode: 'all' } }} className={mode === 'all' ? 'pt-button pt-active' : 'pt-button'}>All</Link> */}
						</div>
					</div>
					<div style={styles.headerRight}>
						<DropdownButton 
							content={
								<Menu>
									<li className={'pt-menu-header'}><h6>Sort by:</h6></li>
									<MenuDivider />
									{sortList.map((sort, index)=> {
										const sortMode = query.sort || 'Most Recently Updated';
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

				{(mode === undefined || mode === 'authored') && 
					<div>
						{authoredPubs.length
							? this.sortList(authoredPubs).map((pub, index)=> {
								return <PreviewPub key={'pub-' + pub.id} pub={pub} />;
							})
							: <NonIdealState title={'No Authored Pubs'} visual={'application'} />
						}	
					</div>
				}

				{ mode === 'contributed' && 
					<div>
						{contributedPubs.length
							? this.sortList(contributedPubs).map((pub, index)=> {
								return <PreviewPub key={'pub-' + pub.id} pub={pub} />;
							})
							: <NonIdealState title={'No Contributed Pubs'} visual={'application'} />
						}	
					</div>
				}

				{ mode === 'discussions' && 
					<div>
						{discussions.length
							? this.sortList(discussions).map((pub, index)=> {
								return <PreviewDiscussion key={'pub-' + pub.id} discussion={pub} parent={pub.replyRootPub} />;
							})
							: <NonIdealState title={'No Contributed Pubs'} visual={'application'} />
						}	
					</div>
				}

				{ mode === 'all' && 
					<div>
						{notDiscussions.length
							? this.sortList(notDiscussions).map((pub, index)=> {
								return <PreviewPub key={'pub-' + pub.id} pub={pub} />;
							})
							: <NonIdealState title={'No Pubs'} visual={'application'} />
						}	
					</div>
				}

				

			</div>
		);
	}
});

export default Radium(UserPubs);

styles = {
	container: {
		
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
};
