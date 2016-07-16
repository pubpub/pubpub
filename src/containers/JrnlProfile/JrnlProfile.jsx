import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getJrnl, updateJrnl, createCollection, updateCollection, deleteCollection, featureAtom, rejectAtom, collectionsChange} from './actions';
// import {NotFound} from 'components';
import JrnlProfileAbout from './JrnlProfileAbout';
import JrnlProfileDetails from './JrnlProfileDetails';
import JrnlProfileLayout from './JrnlProfileLayout';
import JrnlProfileRecent from './JrnlProfileRecent';
import JrnlProfileHeader from './JrnlProfileHeader';
import JrnlProfileFeatured from './JrnlProfileFeatured';
import JrnlProfileSubmitted from './JrnlProfileSubmitted';
import JrnlProfileCollections from './JrnlProfileCollections';
import {NavContentWrapper} from 'components';
import {safeGetInToJS} from 'utils/safeParse';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const JrnlProfile = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		slug: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routerParams) {
			return dispatch(getJrnl(routerParams.slug, routerParams.mode));
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

	handleUpdateJrnl: function(newJrnlData) {
		this.props.dispatch(updateJrnl(this.props.slug, newJrnlData));
	},

	handleHeaderUpdate: function(updateObject) {
		this.setState(updateObject);
	},

	handleCreateCollection: function(newCollectionTitle) {
		const jrnlID = safeGetInToJS(this.props.jrnlData, ['jrnlData', '_id']);
		return this.props.dispatch(createCollection(jrnlID, newCollectionTitle));
	},

	handleUpdateCollection: function(collectionID, collectionData) {
		return this.props.dispatch(updateCollection(collectionID, collectionData));
	},

	handleDeleteCollection: function(collectionID) {
		const jrnlID = safeGetInToJS(this.props.jrnlData, ['jrnlData', '_id']);
		return this.props.dispatch(deleteCollection(jrnlID, collectionID));
	},

	handleFeatureAtom: function(atomID) {
		const jrnlID = safeGetInToJS(this.props.jrnlData, ['jrnlData', '_id']);
		return this.props.dispatch(featureAtom(jrnlID, atomID));
	},

	handleRejectAtom: function(atomID) {
		const jrnlID = safeGetInToJS(this.props.jrnlData, ['jrnlData', '_id']);
		return this.props.dispatch(rejectAtom(jrnlID, atomID));
	},

	handleCollectionsChange: function(linkID, collectionIDs) {
		return this.props.dispatch(collectionsChange(linkID, collectionIDs))
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		const metaData = {};
		metaData.title = jrnlData.jrnlName + ' · PubPub';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'About', link: '/' + this.props.slug + '/about' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const adminNav = [
			{ type: 'title', text: 'Admin'},
			{ type: 'link', text: 'Details', link: '/' + this.props.slug + '/details', active: this.props.mode === 'details' },
			{ type: 'link', text: 'Layout', link: '/' + this.props.slug + '/layout', active: this.props.mode === 'layout' },
			{ type: 'link', text: 'Featured', link: '/' + this.props.slug + '/featured', active: this.props.mode === 'featured' },
			{ type: 'link', text: 'Submitted', link: '/' + this.props.slug + '/submitted', active: this.props.mode === 'submitted' },
			{ type: 'link', text: 'Collections', link: '/' + this.props.slug + '/collections', active: this.props.mode === 'collections' },
			{ type: 'spacer' },
			{ type: 'title', text: 'Public'},
		];

		const collections = jrnlData.collections || [];
		const collectionItems = collections.map((item, index)=> {
			return { type: 'link', text: item.title, link: '/' + this.props.slug + '/' + item._id, active: this.props.mode === item._id };
		});

		const navItems = [
			...adminNav,
			{ type: 'link', text: 'About', link: '/' + this.props.slug + '/about', active: this.props.mode === 'about' },
			{ type: 'link', text: 'Recent Activity', link: '/' + this.props.slug, active: !this.props.mode},
			{ type: 'spacer' },
			...collectionItems,
		];

		return (
			<div>

				<Helmet {...metaData} />

				<JrnlProfileHeader 
					jrnlName={this.state.jrnlName || jrnlData.jrnlName}
					description={this.state.description || jrnlData.description}
					logo={this.state.logo || jrnlData.logo}
					headerColor={this.state.headerColor || jrnlData.headerColor} 
					headerMode={this.state.headerMode || jrnlData.headerMode}
					headerAlign={this.state.headerAlign || jrnlData.headerAlign}
					headerImage={this.state.headerImage === null ? undefined : this.state.headerImage || jrnlData.headerImage} />

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>

					{(() => {
						switch (this.props.mode) {
						case 'about':
							return (
								<JrnlProfileAbout 
									jrnlData={this.props.jrnlData}/>
							);
						case 'details':
							return (
								<JrnlProfileDetails
									jrnlData={this.props.jrnlData}
									handleUpdateJrnl={this.handleUpdateJrnl} />
							);
						case 'layout':
							return (
								<JrnlProfileLayout
									jrnlData={this.props.jrnlData}
									handleUpdateJrnl={this.handleUpdateJrnl}
									handleHeaderUpdate={this.handleHeaderUpdate} />
							);
						case 'featured':
							return (
								<JrnlProfileFeatured 
									jrnlData={this.props.jrnlData} 
									handleCollectionsChange={this.handleCollectionsChange}/>
							);
						case 'submitted':
							return (
								<JrnlProfileSubmitted 
									jrnlData={this.props.jrnlData} 
									handleFeatureAtom={this.handleFeatureAtom} 
									handleRejectAtom={this.handleRejectAtom} />
							);
						case 'collections':
							return (
								<JrnlProfileCollections 
									jrnlData={this.props.jrnlData} 
									handleUpdateJrnl={this.handleUpdateJrnl} 
									handleCreateCollection={this.handleCreateCollection} 
									handleUpdateCollection={this.handleUpdateCollection} 
									handleDeleteCollection={this.handleDeleteCollection}
									slug={this.props.slug} />
							);
						default:
							return (
								<JrnlProfileRecent 
									jrnlData={this.props.jrnlData} />
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
		jrnlData: state.jrnl,
		slug: state.router.params.slug,
		mode: state.router.params.mode,
	};
})( Radium(JrnlProfile) );


