import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getJournal, updateJournal, createCollection, updateCollection, deleteCollection, featureAtom, rejectAtom, collectionsChange, addAdmin, deleteAdmin} from './actions';
// import {NotFound} from 'components';
import JournalProfileAbout from './JournalProfileAbout';
import JournalProfileAdmins from './JournalProfileAdmins';
import JournalProfileDetails from './JournalProfileDetails';
import JournalProfileLayout from './JournalProfileLayout';
import JournalProfileRecent from './JournalProfileRecent';
import JournalProfileHeader from './JournalProfileHeader';
import JournalProfileFeatured from './JournalProfileFeatured';
import JournalProfileSubmitted from './JournalProfileSubmitted';
import JournalProfileCollections from './JournalProfileCollections';
import JournalProfileFollowers from './JournalProfileFollowers';
import {NavContentWrapper} from 'components';
import {safeGetInToJS} from 'utils/safeParse';

// import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const JournalProfile = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		slug: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routerParams) {
			return dispatch(getJournal(routerParams.slug, routerParams.mode));
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

	handleUpdateJournal: function(newJournalData) {
		this.props.dispatch(updateJournal(this.props.slug, newJournalData));
	},

	handleHeaderUpdate: function(updateObject) {
		this.setState(updateObject);
	},

	handleCreateCollection: function(newCollectionTitle) {
		const journalID = safeGetInToJS(this.props.journalData, ['journalData', '_id']);
		return this.props.dispatch(createCollection(journalID, newCollectionTitle));
	},

	handleUpdateCollection: function(collectionID, collectionData) {
		return this.props.dispatch(updateCollection(collectionID, collectionData));
	},

	handleDeleteCollection: function(collectionID) {
		const journalID = safeGetInToJS(this.props.journalData, ['journalData', '_id']);
		return this.props.dispatch(deleteCollection(journalID, collectionID));
	},

	handleFeatureAtom: function(atomID) {
		const journalID = safeGetInToJS(this.props.journalData, ['journalData', '_id']);
		return this.props.dispatch(featureAtom(journalID, atomID));
	},

	handleRejectAtom: function(atomID) {
		const journalID = safeGetInToJS(this.props.journalData, ['journalData', '_id']);
		return this.props.dispatch(rejectAtom(journalID, atomID));
	},

	handleCollectionsChange: function(linkID, collectionIDs) {
		return this.props.dispatch(collectionsChange(linkID, collectionIDs));
	},

	handleAddAdmin: function(adminID) {
		const journalID = safeGetInToJS(this.props.journalData, ['journalData', '_id']);
		return this.props.dispatch(addAdmin(journalID, adminID));
	},

	handleDeleteAdmin: function(adminID) {
		const journalID = safeGetInToJS(this.props.journalData, ['journalData', '_id']);
		return this.props.dispatch(deleteAdmin(journalID, adminID));
	},

	render: function() {
		const journalData = safeGetInToJS(this.props.journalData, ['journalData']) || {};

		const metaData = {
			title: journalData.journalName + ' · PubPub',
			meta: [
				{property: 'og:title', content: (journalData.journalName || journalData.slug)},
				{property: 'og:type', content: 'article'},
				{property: 'og:description', content: journalData.description},
				{property: 'og:url', content: 'https://www.pubpub.org/' + journalData.slug},
				{property: 'og:image', content: journalData.icon},
				{property: 'og:image:url', content: journalData.icon},
				{property: 'og:image:width', content: '500'},
				{name: 'twitter:card', content: 'summary'},
				{name: 'twitter:site', content: '@pubpub'},
				{name: 'twitter:title', content: (journalData.journalName || journalData.slug)},
				{name: 'twitter:description', content: journalData.description || journalData.about || journalData.journalName || journalData.slug},
				{name: 'twitter:image', content: journalData.icon},
				{name: 'twitter:image:alt', content: 'Image for ' + (journalData.journalName || journalData.slug)}
			]
		};

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.About}/>, link: '/' + this.props.slug + '/about' },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu}/>, action: undefined },
		];

		let adminNav = [
			{ type: 'title', text: <FormattedMessage {...globalMessages.Admin}/>},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Details}/>, link: '/' + this.props.slug + '/details', active: this.props.mode === 'details' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Layout}/>, link: '/' + this.props.slug + '/layout', active: this.props.mode === 'layout' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Featured}/>, link: '/' + this.props.slug + '/featured', active: this.props.mode === 'featured' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Submitted}/>, link: '/' + this.props.slug + '/submitted', active: this.props.mode === 'submitted' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Collections}/>, link: '/' + this.props.slug + '/collections', active: this.props.mode === 'collections' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Admins}/>, link: '/' + this.props.slug + '/admins', active: this.props.mode === 'admins' },
			{ type: 'spacer' },
			{ type: 'title', text: <FormattedMessage {...globalMessages.Public}/>},
		];

		if (!journalData.isAdmin) {
			adminNav = [];
		}

		const collections = journalData.collections || [];
		const collectionItems = collections.map((item, index)=> {
			return { type: 'link', text: item.title, link: '/' + this.props.slug + '/' + item._id, active: this.props.mode === item._id };
		});

		const navItems = [
			...adminNav,
			{ type: 'link', text: <FormattedMessage {...globalMessages.About}/>, link: '/' + this.props.slug + '/about', active: this.props.mode === 'about' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.RecentActivity}/>, link: '/' + this.props.slug, active: !this.props.mode},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Followers}/>, link: '/' + this.props.slug + '/followers', active: this.props.mode === 'followers'},

			{ type: 'spacer' },
			...collectionItems,
		];

		let mode = this.props.mode;
		if (!journalData.isAdmin && (mode === 'details' || mode === 'layout' || mode === 'featured' || mode === 'submitted' || mode === 'collections' || mode === 'admins')) {
			mode = 'notFound';
		}
		return (
			<div>

				<Helmet {...metaData} />

				<JournalProfileHeader
					journalName={this.state.journalName || journalData.journalName}
					journalSlug={journalData.slug}
					journalID={journalData._id}
					isFollowing={journalData.isFollowing}
					description={this.state.description || journalData.description}
					logo={this.state.logo || journalData.logo}
					headerColor={this.state.headerColor || journalData.headerColor}
					headerMode={this.state.headerMode || journalData.headerMode}
					headerAlign={this.state.headerAlign || journalData.headerAlign}
					headerImage={this.state.headerImage === null ? undefined : this.state.headerImage || journalData.headerImage} />

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>

					{(() => {
						switch (mode) {
						case 'about':
							return (
								<JournalProfileAbout
									journalData={this.props.journalData}/>
							);
						case 'followers':
							return (
								<JournalProfileFollowers
									journalData={this.props.journalData}/>
							);
						case 'details':
							return (
								<JournalProfileDetails
									journalData={this.props.journalData}
									handleUpdateJournal={this.handleUpdateJournal} />
							);
						case 'layout':
							return (
								<JournalProfileLayout
									journalData={this.props.journalData}
									handleUpdateJournal={this.handleUpdateJournal}
									handleHeaderUpdate={this.handleHeaderUpdate} />
							);
						case 'featured':
							return (
								<JournalProfileFeatured
									journalData={this.props.journalData}
									handleCollectionsChange={this.handleCollectionsChange}/>
							);
						case 'submitted':
							return (
								<JournalProfileSubmitted
									journalData={this.props.journalData}
									handleFeatureAtom={this.handleFeatureAtom}
									handleRejectAtom={this.handleRejectAtom} />
							);
						case 'collections':
							return (
								<JournalProfileCollections
									journalData={this.props.journalData}
									handleUpdateJournal={this.handleUpdateJournal}
									handleCreateCollection={this.handleCreateCollection}
									handleUpdateCollection={this.handleUpdateCollection}
									handleDeleteCollection={this.handleDeleteCollection}
									slug={this.props.slug} />
							);
						case 'admins':
							return (
								<JournalProfileAdmins
									journalData={this.props.journalData}
									handleAddAdmin={this.handleAddAdmin}
									handleDeleteAdmin={this.handleDeleteAdmin}/>
							);
						case 'notFound':
							return null;

						default:
							return (
								<JournalProfileRecent
									journalData={this.props.journalData} />
							);
						}
					})()}

				</NavContentWrapper>

			</div>
		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
		slug: state.router.params.slug,
		mode: state.router.params.mode,
	};
})( Radium(JournalProfile) );
