import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';

import { FollowButton, NoMatch } from 'containers';
import { Menu, MenuDivider } from '@blueprintjs/core';
import { DropdownButton } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { getJournalData } from './actions';

import JournalHeader from './JournalHeader';
import JournalEdit from './JournalEdit';
import JournalSubmits from './JournalSubmits';
import JournalFeatures from './JournalFeatures';
import JournalAbout from './JournalAbout';
import JournalCollection from './JournalCollection';
import JournalCollections from './JournalCollections';
import JournalFollowers from './JournalFollowers';

let styles;

export const Journal = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		journalData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			logo: undefined,
			headerColor: '',
			headerMode: '',
			headerAlign: '',
			headerImage: '',
		};
	},

	componentWillMount() {
		this.props.dispatch(getJournalData(this.props.params.slug));
	},
	componentWillReceiveProps(nextProps) {
		const params = this.props.params || {};
		const nextParams = nextProps.params || {};
		if (params.slug !== nextParams.slug) {
			this.props.dispatch(getJournalData(nextParams.slug));
		}
	},
	
	handleHeaderUpdate: function(updateObject) {
		this.setState(updateObject);
	},

	sortList: function(list) {
		return list.sort((foo, bar)=> {
			const query = this.props.location.query || {};

			const fooTitle = foo.firstName || foo.title || '';
			const barTitle = bar.firstName || bar.title || '';
			
			const fooDate = foo.updatedAt;
			const barDate = bar.updatedAt;

			const newest = query.sort === 'Most Recent' || query.sort === undefined;
			const oldest = query.sort === 'Least Recent';

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
		let mode = this.props.params.mode;
		
		const query = this.props.location.query || {};
		const view = query.view;
		const sortList = ['Most Recent', 'Least Recent', 'A → Z', 'Z → A'];

		
		const pathname = this.props.location.pathname;
		const collection = this.props.params.collection;
		const journal = this.props.journalData.journal || {};
		const collections = journal.collections || [];
		const followers = journal.followers || [];
		const isAdmin = journal.isAdmin; // Add || true for dev only.
		console.log(isAdmin);
		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;
		const followData = followers.reduce((previous, current)=> {
			if (current.id === accountId) { return current.FollowsJournal; }
			return previous;
		}, undefined);

		const metaData = {
			title: journal.title + ' · PubPub',
			meta: [
				{ property: 'og:title', content: (journal.title || journal.slug) },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:description', content: journal.description },
				{ property: 'og:url', content: 'https://www.pubpub.org/' + journal.slug },
				{ property: 'og:image', content: journal.avatar },
				{ property: 'og:image:url', content: journal.avatar },
				{ property: 'og:image:width', content: '500' },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:site', content: '@pubpub' },
				{ name: 'twitter:title', content: (journal.title || journal.slug) },
				{ name: 'twitter:description', content: journal.description || journal.about || journal.title || journal.slug },
				{ name: 'twitter:image', content: journal.avatar },
				{ name: 'twitter:image:alt', content: 'Image for ' + (journal.title || journal.slug) }
			]
		};

		if (!isAdmin && (mode === 'about' || mode === 'collections' || mode === 'followers')) {
			mode = 'notFound';
		}

		if (this.props.journalData.error) {
			return <NoMatch />;
		}

		if (!journal.title && !this.props.journalData.error) {
			return <div>Loading</div>;
		}
		if (!journal.title && this.props.journalData.error) {
			return <div>Error</div>;
		}

		return (
			<div style={styles.container}>
				<Helmet {...metaData} />
			

				<JournalHeader
					journal={journal}
					followContent={
						<div style={styles.followButtonWrapper}>
							{isAdmin &&
								<div className={'pt-button-group'} style={styles.editButton}>
									<Link className={'pt-button pt-icon-edit'} to={'/' + journal.slug + '/edit'} >Edit Journal</Link>
								</div>
							}
							
							
							<FollowButton 
								journalId={journal.id} 
								followData={followData} 
								followerCount={followers.length} 
								followersLink={{ pathname: '/' + journal.slug + '/followers' }}
								dispatch={this.props.dispatch} />
						</div>
					}
					logo={this.state.logo || journal.logo}
					headerColor={this.state.headerColor || journal.headerColor}
					headerMode={this.state.headerMode || journal.headerMode}
					headerAlign={this.state.headerAlign || journal.headerAlign}
					headerImage={this.state.headerImage === null ? undefined : this.state.headerImage || journal.headerImage} />

				<div style={styles.content}>
					{(() => {
						switch (mode) {
						case 'edit': 
							return (
								<JournalEdit
									journal={journal}
									handleHeaderUpdate={this.handleHeaderUpdate}
									isLoading={this.props.journalData.putDataLoading}
									error={this.props.journalData.putDataError}
									dispatch={this.props.dispatch} />
							);
						
						case 'about':
							return (
								<JournalAbout 
									journal={journal} 
									isLoading={this.props.journalData.putDataLoading}
									error={this.props.journalData.putDataError}
									dispatch={this.props.dispatch} />
							);
						case 'collection':
							return (
								<JournalCollection 
									journal={journal}
									collection={collection} />
							);
						case 'followers':
							return (
								<JournalFollowers journal={journal} />
							);
						case 'notFound':
							return null;

						default:
							return (
								<div>
									<div style={styles.headerWrapper}>
										<div style={styles.headerOptions}>
											<div className="pt-button-group pt-minimal">
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: undefined } }} className={view === undefined || view === 'featured' ? 'pt-button pt-active' : 'pt-button'}>Featured</Link>
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: 'submitted' } }} className={view === 'submitted' ? 'pt-button pt-active' : 'pt-button'}>Submitted</Link>
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: 'collections' } }} className={view === 'collections' ? 'pt-button pt-active' : 'pt-button'}>Collections</Link>
											</div>
										</div>
										<div style={styles.headerRight}>
											<DropdownButton 
												content={
													<Menu>
														<li className={'pt-menu-header'}><h6>Sort by:</h6></li>
														<MenuDivider />
														{sortList.map((sort, index)=> {
															const sortMode = query.sort || 'Most Recent';
															return (
																<li key={'sortFilter-' + index}><Link to={{ pathname: '/' + journal.slug, query: { ...query, sort: sort } }} className="pt-menu-item pt-popover-dismiss">
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

									{(query.view === undefined || query.view === 'featured') &&
										<JournalFeatures
											journal={journal}
											isLoading={this.props.journalData.featuresLoading}
											error={this.props.journalData.featuresError}
											pathname={pathname}
											query={query}
											dispatch={this.props.dispatch} />
									}

									{query.view === 'submitted' &&
										<JournalSubmits
											journal={journal}
											isLoading={this.props.journalData.submitsLoading}
											error={this.props.journalData.submitsError}
											dispatch={this.props.dispatch} />
									}

									{query.view === 'collections' &&
										<JournalCollections
											journal={journal}
											isLoading={this.props.journalData.collectionsLoading}
											error={this.props.journalData.collectionsError}
											dispatch={this.props.dispatch} />
									}
								</div>
							);
						}
					})()}
				</div>

				
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		journalData: state.journal.toJS(),
		accountData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Journal));

styles = {
	container: {

	},
	editButton: {
		// display: 'block',
		marginRight: '0.5em',
	},
	followButtonWrapper: {
		// float: 'right',
		right: 0,
		top: 0,
		// position: 'relative',
		position: 'absolute',
		zIndex: '3',
		textAlign: 'right',
	},
	headerWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '2em',
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
	content: {
		maxWidth: '1024px',
		margin: '0 auto',
		padding: '0em 2em 2em',
	},
};
