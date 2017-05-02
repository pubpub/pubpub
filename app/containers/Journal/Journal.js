import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Link from 'components/Link/Link';
import Radium from 'radium';
import Helmet from 'react-helmet';

import FollowButton from 'containers/FollowButton/FollowButton';
import NoMatch from 'containers/NoMatch/NoMatch';
import { Menu, MenuDivider, Spinner } from '@blueprintjs/core';
import DropdownButton from 'components/DropdownButton/DropdownButton';

import { getJournalData } from './actions';

import JournalHeader from './JournalHeader';
import JournalEdit from './JournalEdit';
import JournalSubmits from './JournalSubmits';
import JournalFeatures from './JournalFeatures';
import JournalPeople from './JournalPeople';
import JournalPage from './JournalPage';
import JournalPages from './JournalPages';
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
		const urlTerms = window.location.href.split('/');
		const currentRootAddress = `${urlTerms[0]}//${urlTerms[2]}`;
		this.props.dispatch(getJournalData(this.props.params.slug || currentRootAddress));
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

		const location = this.props.location;
		const pathname = location.pathname;
		const pageSlug = this.props.params.pageSlug;
		const journal = this.props.journalData.journal || {};
		const pages = journal.pages || [];
		const page = pages.reduce((previous, current)=> {
			if (current.slug === pageSlug) { return current; }
			return previous;
		}, {});

		if (!window.isJournal && journal.customDomain) {
			const reducedPathname = location.pathname.substring(journal.slug.length + 1, location.pathname.length);
			window.location.replace(`${journal.customDomain}${reducedPathname}${location.search}`);
		}

		const followers = journal.followers || [];
		const isAdmin = journal.isAdmin; // Add || true for dev only.
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
				{ name: 'description', content: journal.description },
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
			],
			link: window.isJournal
				? [{ rel: 'shortcut icon', type: 'image/png', href: `https://jake.pubpub.org/unsafe/32x32/filters:format(png)/${journal.avatar}` }]
				: [],
		};

		if (!isAdmin && mode === 'edit') {
			mode = 'notFound';
		}

		if (this.props.journalData.error) {
			return <NoMatch />;
		}

		if (!journal.title && !this.props.journalData.error) {
			return <div style={{ margin: '5em auto', width: '50px' }}><Spinner /></div>;
		}
		if (!journal.title && this.props.journalData.error) {
			return <div>Error</div>;
		}

		return (
			<div style={styles.container}>
				<Helmet {...metaData} />
			

				<JournalHeader
					journal={journal}
					page={page}
					followContent={
						<div style={styles.followButtonWrapper}>
							<FollowButton 
								journalId={journal.id} 
								journalCustomDomain={journal.customDomain}
								followData={followData} 
								followerCount={followers.length} 
								followersLink={{ pathname: '/' + journal.slug + '/followers' }}
								dispatch={this.props.dispatch} />
							{isAdmin &&
								<div style={styles.editButton}>
									<Link className={'pt-button pt-icon-edit'} to={'/' + journal.slug + '/edit'} customDomain={journal.customDomain}>Edit Journal</Link>
								</div>
							}
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
						
						// case 'about':
						// 	return (
						// 		<JournalPeople 
						// 			journal={journal} 
						// 			isLoading={this.props.journalData.putDataLoading}
						// 			error={this.props.journalData.putDataError}
						// 			dispatch={this.props.dispatch} />
						// 	);
						case 'page':
							return (
								<JournalPage 
									journal={journal}
									page={page}
									isLoading={this.props.journalData.pagesLoading}
									error={this.props.journalData.pagesError}
									dispatch={this.props.dispatch} />
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
									{journal.slug === 'resci' &&
										<div style={styles.hardcodedText}>
											<p style={styles.hardcodedTextP}>
												<b>Responsive Science</b> is a way of conducting research that invites openness and community involvement from the earliest stages of each project. Real-time interaction between scientists, citizens, and broader communities allows questions and concerns to be identified before experiments are performed, fosters open discussion, and encourages research studies and new technologies to be redesigned in response to societal feedback. 
											</p>
											<p style={styles.hardcodedTextP}>
												<b>Community Involvement</b>
												<br />
												Transparency and societal accountability are critical for any research that involves the shared environment. Responsive Science currently focuses on applied ecological research, including gene drive systems for altering wild populations. Discussions are facilitated by <a href={'https://www.pubpub.org'}>PubPub</a>, a unique collaborative tool for sharing and evaluating research, and our dedicated <Link to={{ pathname: '/' + journal.slug, query: { ...query, view: 'people' } }} customDomain={journal.customDomain}>team</Link>.
											</p>
											<p style={styles.hardcodedTextP}>
												<b>Wise Choices</b>
												<br />
												Increasingly powerful technologies demand greater wisdom. Share your thoughts on early stage <Link to={'/page/projects'} customDomain={journal.customDomain}>projects</Link> to shape a better future for society and the natural world.
											</p>
										</div>
									}
									<div style={styles.headerWrapper}>
										<div style={styles.headerOptions}>
											<div className="pt-button-group pt-minimal">
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: undefined } }} customDomain={journal.customDomain} className={view === undefined || view === 'featured' ? 'pt-button pt-active' : 'pt-button'}>Featured</Link>
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: 'submitted' } }} customDomain={journal.customDomain} className={view === 'submitted' ? 'pt-button pt-active' : 'pt-button'}>Submitted</Link>
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: 'pages' } }} customDomain={journal.customDomain} className={view === 'pages' ? 'pt-button pt-active' : 'pt-button'}>Pages</Link>
												<Link to={{ pathname: '/' + journal.slug, query: { ...query, view: 'people' } }} customDomain={journal.customDomain} className={view === 'people' ? 'pt-button pt-active' : 'pt-button'}>People</Link>
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
																<li key={'sortFilter-' + index}><Link to={{ pathname: '/' + journal.slug, query: { ...query, sort: sort } }} className="pt-menu-item pt-popover-dismiss" customDomain={journal.customDomain}>
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

									{query.view === 'pages' &&
										<JournalPages
											journal={journal}
											isLoading={this.props.journalData.pagesLoading}
											error={this.props.journalData.pagesError}
											dispatch={this.props.dispatch} />
									}

									{query.view === 'people' &&
										<JournalPeople 
											journal={journal} 
											isLoading={this.props.journalData.putDataLoading}
											error={this.props.journalData.putDataError}
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
		marginTop: '0.5em',
	},
	hardcodedText: {
		padding: '0em 0em 2em',
		fontSize: '1.2em',
		lineHeight: '1.4',
	},
	hardcodedTextP: {
		padding: '1em 0em',
	},
	followButtonWrapper: {
		// float: 'right',
		right: '2em',
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
