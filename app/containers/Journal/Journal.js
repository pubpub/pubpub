import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';

import { NavContentWrapper } from 'components';
import { NoMatch } from 'containers';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { getJournalData } from './actions';

import JournalHeader from './JournalHeader';
import JournalLayout from './JournalLayout';
import JournalDetails from './JournalDetails';

let styles;

export const Journal = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		journalData: PropTypes.object,
		params: PropTypes.object,
		dispatch: PropTypes.func,
	},

	statics: {
		readyOnActions: function(dispatch, params) {
			return Promise.all([
				dispatch(getJournalData(params.slug))
			]);
		}
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

	componentDidMount() {
		// Need to check here so that getUser doesn't make a fetch twice
		const journal = this.props.journalData.journal || {};
		const params = this.props.params || {};
		if (this.props.journalData.journal !== null && journal.slug !== params.slug) {
			Journal.readyOnActions(this.props.dispatch, this.props.params);	
		}
	},
	
	handleHeaderUpdate: function(updateObject) {
		this.setState(updateObject);
	},

	render() {
		const slug = this.props.params.slug;
		let mode = this.props.params.mode;
		const journal = this.props.journalData.journal || {};
		const pubsFeatured = journal.pubsFeatured || [];
		const isAdmin = this.props.journalData.isAdmin || true; // The || true is for dev only.

		const metaData = {
			title: journal.name + ' · PubPub',
			meta: [
				{property: 'og:title', content: (journal.name || journal.slug)},
				{property: 'og:type', content: 'article'},
				{property: 'og:description', content: journal.shortDescription},
				{property: 'og:url', content: 'https://www.pubpub.org/' + journal.slug},
				{property: 'og:image', content: journal.icon},
				{property: 'og:image:url', content: journal.icon},
				{property: 'og:image:width', content: '500'},
				{name: 'twitter:card', content: 'summary'},
				{name: 'twitter:site', content: '@pubpub'},
				{name: 'twitter:title', content: (journal.name || journal.slug)},
				{name: 'twitter:description', content: journal.shortDescription || journal.longDescription || journal.name || journal.slug},
				{name: 'twitter:image', content: journal.icon},
				{name: 'twitter:image:alt', content: 'Image for ' + (journal.name || journal.slug)}
			]
		};

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.About}/>, link: '/' + this.props.params.slug + '/about' },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu}/>, action: undefined },
		];

		let adminNav = [
			{ type: 'title', text: <FormattedMessage {...globalMessages.Admin}/>},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Details}/>, link: '/' + this.props.params.slug + '/details', active: mode === 'details' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Layout}/>, link: '/' + this.props.params.slug + '/layout', active: mode === 'layout' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Featured}/>, link: '/' + this.props.params.slug + '/featured', active: mode === 'featured' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Submitted}/>, link: '/' + this.props.params.slug + '/submitted', active: mode === 'submitted' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Collections}/>, link: '/' + this.props.params.slug + '/collections', active: mode === 'collections' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Admins}/>, link: '/' + this.props.params.slug + '/admins', active: mode === 'admins' },
			{ type: 'spacer' },
			{ type: 'title', text: <FormattedMessage {...globalMessages.Public}/>},
		];

		if (!isAdmin) {
			adminNav = [];
		}

		const collections = journal.collections || [];
		const collectionItems = collections.map((item, index)=> {
			return { type: 'link', text: item.title, link: '/' + this.props.params.slug + '/' + item._id, active: mode === item._id };
		});

		const navItems = [
			...adminNav,
			{ type: 'link', text: <FormattedMessage {...globalMessages.About}/>, link: '/' + this.props.params.slug + '/about', active: mode === 'about' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.RecentActivity}/>, link: '/' + this.props.params.slug, active: !mode},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Followers}/>, link: '/' + this.props.params.slug + '/followers', active: mode === 'followers'},

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
						case 'notFound':
							return null;

						default:
							return (
								<div>
									<div>{this.props.params.mode}</div>
									{pubsFeatured.map((pub, index)=> {
										return (<div>
											<Link to={'/pub/' + pub.slug}>{pub.title}</Link>
											<p style={{ paddingLeft: '1em' }}>{pub.description}</p>
										</div>);
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
	
};
