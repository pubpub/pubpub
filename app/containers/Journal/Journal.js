import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';

import { FollowButton } from 'containers';
import { NavContentWrapper, PreviewPub } from 'components';
import { NoMatch } from 'containers';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { getJournalData } from './actions';

import JournalHeader from './JournalHeader';
import JournalLayout from './JournalLayout';
import JournalDetails from './JournalDetails';
import JournalSubmits from './JournalSubmits';
import JournalFeatures from './JournalFeatures';
import JournalAdmins from './JournalAdmins';
import JournalAbout from './JournalAbout';
import JournalCollection from './JournalCollection';
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

	// statics: {
	// 	readyOnActions: function(dispatch, params) {
	// 		return Promise.all([
	// 			dispatch(getJournalData(params.slug))
	// 		]);
	// 	}
	// },

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
	
	handleHeaderUpdate: function(updateObject) {
		this.setState(updateObject);
	},

	render() {
		const slug = this.props.params.slug;
		let mode = this.props.params.mode;
		const query = this.props.location.query;
		const pathname = this.props.location.pathname;
		const collection = this.props.params.collection;
		const journal = this.props.journalData.journal || {};
		const followers = journal.followers || [];
		const pubFeatures = journal.pubFeatures || [];
		const isAdmin = this.props.journalData.isAdmin || true; // The || true is for dev only.

		const accountData = this.props.accountData || {};
		const accountUser = accountData.user || {};
		const accountId = accountUser.id;
		const followData = followers.reduce((previous, current)=> {
			if (current.id === accountId) { return current.FollowsJournal; }
			return previous;
		}, undefined);

		const metaData = {
			title: journal.name + ' · PubPub',
			meta: [
				{ property: 'og:title', content: (journal.name || journal.slug) },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:description', content: journal.shortDescription },
				{ property: 'og:url', content: 'https://www.pubpub.org/' + journal.slug },
				{ property: 'og:image', content: journal.icon },
				{ property: 'og:image:url', content: journal.icon },
				{ property: 'og:image:width', content: '500' },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:site', content: '@pubpub' },
				{ name: 'twitter:title', content: (journal.name || journal.slug) },
				{ name: 'twitter:description', content: journal.shortDescription || journal.longDescription || journal.name || journal.slug },
				{ name: 'twitter:image', content: journal.icon },
				{ name: 'twitter:image:alt', content: 'Image for ' + (journal.name || journal.slug) }
			]
		};

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.About} />, link: '/' + this.props.params.slug + '/about' },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu} />, action: undefined },
		];

		let adminNav = [
			{ type: 'title', text: <FormattedMessage {...globalMessages.Admin} /> },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Details} />, link: '/' + this.props.params.slug + '/details', active: mode === 'details' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Layout} />, link: '/' + this.props.params.slug + '/layout', active: mode === 'layout' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Featured} />, link: '/' + this.props.params.slug + '/featured', active: mode === 'featured' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Submitted} />, link: '/' + this.props.params.slug + '/submitted', active: mode === 'submitted' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Admins} />, link: '/' + this.props.params.slug + '/admins', active: mode === 'admins' },
			{ type: 'spacer' },
			{ type: 'title', text: <FormattedMessage {...globalMessages.Public} /> },
		];

		if (!isAdmin) {
			adminNav = [];
		}

		const collections = journal.collections || [];
		const collectionItems = collections.map((item, index)=> {
			return { type: 'link', text: item.title, link: '/' + this.props.params.slug + '/collection/' + item.title, active: collection === item.title };
		});

		const navItems = [
			...adminNav,
			{ type: 'link', text: <FormattedMessage {...globalMessages.About} />, link: '/' + this.props.params.slug + '/about', active: mode === 'about' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.RecentActivity} />, link: '/' + this.props.params.slug, active: !mode},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Followers} />, link: '/' + this.props.params.slug + '/followers', active: mode === 'followers'},

			{ type: 'spacer' },
			...collectionItems,
		];

		if (!isAdmin && (mode === 'details' || mode === 'layout' || mode === 'featured' || mode === 'submitted' || mode === 'collections' || mode === 'admins')) {
			mode = 'notFound';
		}

		if (this.props.journalData.error) {
			return <NoMatch />;
		}

		return (
			<div style={styles.container}>
				<Helmet {...metaData} />
			

				<JournalHeader
					journalName={journal.name}
					journalSlug={journal.slug}
					journalID={journal.id}
					isFollowing={false}
					description={journal.shortDescription}
					logo={this.state.logo || journal.logo}
					followContent={
						<div style={styles.followButtonWrapper}>
							<FollowButton 
								journalId={journal.id} 
								followData={followData} 
								followerCount={followers.length} 
								followersLink={'/' + journal.slug + '/followers'}
								dispatch={this.props.dispatch} />
						</div>
					}
					headerColor={this.state.headerColor || journal.headerColor}
					headerMode={this.state.headerMode || journal.headerMode}
					headerAlign={this.state.headerAlign || journal.headerAlign}
					headerImage={this.state.headerImage === null ? undefined : this.state.headerImage || journal.headerImage} />

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
					{(() => {
						switch (mode) {
						case 'layout':
							return (
								<JournalLayout
									journal={journal}
									handleHeaderUpdate={this.handleHeaderUpdate}
									isLoading={this.props.journalData.putDataLoading}
									error={this.props.journalData.putDataError}
									dispatch={this.props.dispatch} />
							);
						case 'details':
							return (
								<JournalDetails
									journal={journal}
									isLoading={this.props.journalData.putDataLoading}
									error={this.props.journalData.putDataError}
									dispatch={this.props.dispatch} />
							);
						case 'submitted':
							return (
								<JournalSubmits
									journal={journal}
									isLoading={this.props.journalData.submitsLoading}
									error={this.props.journalData.submitsError}
									dispatch={this.props.dispatch} />
							);
						case 'featured':
							return (
								<JournalFeatures
									journal={journal}
									isLoading={this.props.journalData.featuresLoading}
									error={this.props.journalData.featuresError}
									pathname={pathname}
									query={query}
									dispatch={this.props.dispatch} />
							);
						case 'admins':
							return (
								<JournalAdmins
									journal={journal}
									isLoading={this.props.journalData.adminsLoading}
									error={this.props.journalData.adminsError}
									dispatch={this.props.dispatch} />
							);
						case 'about':
							return (
								<JournalAbout journal={journal} />
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
									<h2>Recently Featured</h2>
									{pubFeatures.map((pubFeature, index)=> {
										return <PreviewPub key={'collectionItem-' + index} pub={pubFeature.pub} />;
									})}
								</div>
							);
						}
					})()}
				</NavContentWrapper>

				
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
	followButtonWrapper: {
		float: 'right',
		position: 'relative',
		zIndex: '3',
	},
};
