import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import {push} from 'redux-router';
import Helmet from 'react-helmet';
import {getAtomEdit, saveVersion, updateAtomDetails, publishVersion, getAtomEditModalData, addContributor, updateContributor, deleteContributor} from './actions';
import {safeGetInToJS} from 'utils/safeParse';

import {HorizontalNav} from 'components';
import AtomEditorHeader from './AtomEditorHeader';
import AtomEditorPane from './AtomEditorPane';
import AtomEditorModals from './AtomEditorModals';

import { StickyContainer as UnwrappedStickyContainer, Sticky } from 'react-sticky';
const StickyContainer = Radium(UnwrappedStickyContainer);
import smoothScroll from 'smoothscroll';

// import {globalStyles} from 'utils/styleConstants';
// import {generateTOC} from 'utils/generateTOC';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const AtomEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
		slug: PropTypes.string,
		dispatch: PropTypes.func,
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			return dispatch(getAtomEdit(routeParams.slug));
		}
	},

	componentDidMount() {
	// 	this.moveMenu();
	},

	// moveMenu: function() {
	// 	if (typeof(document) !== 'undefined') {
	// 		const menuBar = document.getElementsByClassName('ProseMirror-menubar')[0];
	// 		const menuBarPlaceholder = document.getElementById('menu-placeholder');
	// 		menuBarPlaceholder.appendChild(menuBar);
	// 	}
	// },

	componentWillReceiveProps(nextProps) {
		// If we transition from loading to not loading, without error, close modal
		// Don't do this if we're on the publishing modal though.
		const previousLoading = safeGetInToJS(this.props.atomEditData, ['loading']);
		const nextLoading = safeGetInToJS(nextProps.atomEditData, ['loading']);
		const nextError = safeGetInToJS(nextProps.atomEditData, ['error']);
		
		if (previousLoading === true && nextLoading === false && !nextError && this.state.modalMode !== 'publishing') { 
			this.closeModal();
		}

		const oldSlug = safeGetInToJS(this.props.atomEditData, ['atomData', 'slug']);
		const newSlug = safeGetInToJS(nextProps.atomEditData, ['atomData', 'slug']);
		if (oldSlug !== newSlug) {
			this.props.dispatch(push('/pub/' + newSlug + '/edit'));
		}
	},

	getInitialState() {
		return {
			modalMode: undefined,
		};
	},

	saveVersionClick: function() {
		this.setState({modalMode: 'saveVersion'});
	},

	saveVersionSubmit: function(versionMessage) {
		const newVersionContent = this.refs.atomEditorPane.refs.editor.getSaveVersionContent();
		const atomData = this.props.atomEditData.get('atomData').toJS();
		const newVersion = {
			type: atomData.type,
			message: versionMessage,
			parent: atomData._id,
			content: newVersionContent
		};
		this.props.dispatch(saveVersion(newVersion));
	},

	updateDetails: function(newDetails) {
		const atomID = safeGetInToJS(this.props.atomEditData, ['atomData', '_id']);
		this.props.dispatch(updateAtomDetails(atomID, newDetails));
	},

	publishVersionHandler: function(versionID) {
		this.props.dispatch(publishVersion(versionID));
	},

	handleAddContributor: function(contributorID) {
		const atomID = safeGetInToJS(this.props.atomEditData, ['atomData', '_id']);
		this.props.dispatch(addContributor(atomID, contributorID));
	},

	handleUpdateContributor: function(linkID, linkType, linkRoles) {
		this.props.dispatch(updateContributor(linkID, linkType, linkRoles));
	},

	handleDeleteContributor: function(linkID) {
		this.props.dispatch(deleteContributor(linkID));
	},

	openModal: function(mode) {
		this.setState({modalMode: mode});
	},

	closeModal: function() {
		this.setState({modalMode: undefined});
	},

	getModalData: function(mode) {
		const atomID = safeGetInToJS(this.props.atomEditData, ['atomData', '_id']);
		this.props.dispatch(getAtomEditModalData(atomID, mode));
	},

	toggleDiscussions: function() {
		this.setState({cat: Math.random()});
	},
	render: function() {
		
		const atomEditData = safeGetInToJS(this.props.atomEditData, ['atomData']) || {};

		const metaData = {
			title: 'Editing ' + atomEditData.title + ' · PubPub',
			meta: [
				{'name': 'robots', 'content': 'noindex'},
				{'name': 'robots', 'content': 'nofollow'},
			]
		};

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'View', link: '/pub/' + this.props.slug },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const leftNav = [
			{text: 'View', link: '/pub/' + this.props.slug},
			{text: 'Edit', link: '/pub/' + this.props.slug + '/edit', active: true},
		];
		const navItems = [
			// {text: 'View', link: '/pub/' + this.props.slug},
			// {text: 'Edit', link: '/pub/' + this.props.slug + '/edit', active: true},
			{text: 'Details', rightAlign: true, action: this.openModal.bind(this, 'details')},
			{text: 'Contributors', rightAlign: true, action: this.openModal.bind(this, 'contributors')},
			// {text: 'Styles', rightAlign: true, action: this.openModal.bind(this, 'styles')},
			{text: 'Publishing', rightAlign: true, action: this.openModal.bind(this, 'publishing')},
		];

		
		const contributorsData = safeGetInToJS(this.props.atomEditData, ['contributorsData']) || [];
		const publishingData = safeGetInToJS(this.props.atomEditData, ['publishingData']) || [];
		const isLoading = safeGetInToJS(this.props.atomEditData, ['loading']);
		const error = safeGetInToJS(this.props.atomEditData, ['error']);
		const isModalLoading = safeGetInToJS(this.props.atomEditData, ['modalLoading']);
		const modalError = safeGetInToJS(this.props.atomEditData, ['modalError']);

		const showDiscussions = true;

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />


				{/* Pub Section */}
				<StickyContainer>
				<div style={styles.pubSection}>

					<div style={styles.readerNavBar}>
						<HorizontalNav navItems={leftNav} mobileNavButtons={mobileNavButtons}/>
						
						<Sticky>
							<div id={'menu-placeholder'}></div>	
						</Sticky>
						
					</div>

					<AtomEditorHeader
						title={atomEditData.title}
						saveVersionHandler={this.saveVersionClick} 
						openDetails={this.openModal.bind(this, 'details')} />

					<AtomEditorPane ref={'atomEditorPane'} atomEditData={this.props.atomEditData} loginData={this.props.loginData}/>

					<AtomEditorModals 
						atomEditData={this.props.atomEditData}
						contributorsData={contributorsData}
						publishingData={publishingData}
						getModalData={this.getModalData}
						mode={this.state.modalMode} 
						closeModalHandler={this.closeModal}
						handleVersionSave={this.saveVersionSubmit}
						updateDetailsHandler={this.updateDetails}
						publishVersionHandler={this.publishVersionHandler}
						handleAddContributor={this.handleAddContributor}
						handleUpdateContributor={this.handleUpdateContributor}
						handleDeleteContributor={this.handleDeleteContributor}
						isLoading={isLoading}
						error={error}
						isModalLoading={isModalLoading}
						modalError={modalError} />

				</div>
				</StickyContainer>

				<StickyContainer style={[styles.discussionSection, !showDiscussions && styles.hideDiscussion]}>
					<Sticky>
						<div className={'lightest-bg-hover lighter-border-hover'} onClick={this.toggleDiscussions} style={styles.closeButton}>
							<span style={styles.closeText}>...</span>
						</div>
						<HorizontalNav navItems={navItems} mobileNavButtons={mobileNavButtons}/>
						
						<div className={'contenty'} style={styles.contenty}>
							BLURGGGG
						</div>
						
					</Sticky>
				</StickyContainer>

			</div>
		);
	}

});


export default connect( state => {
	return {
		atomEditData: state.atomEdit,
		loginData: state.login,
		slug: state.router.params.slug,
		query: state.router.location.query,

		meta: state.router.params.meta,
		metaID: state.router.params.metaID,
	};
})( Radium(AtomEditor) );

styles = {
	// pubSection: {
	// 	display: 'table-cell',
	// 	verticalAlign: 'top',
	// 	padding: '0em 2em',
	// 	position: 'relative',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'block',
	// 		padding: '0em 1em',
	// 	},
	// },
	container: {
		// display: 'table',
		width: '100%',
		// tableLayout: 'fixed',
		overflow: 'hidden',
		minHeight: '100vh',
		position: 'relative',
	},
	pubSection: {
		verticalAlign: 'top',
		padding: '0em 4em',
		position: 'relative',
		marginRight: '35vw',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '0em 1em',
			marginRight: '0vw',
		},
	},
	readerNavBar: {
		width: 'calc(100% + 8em)',
		left: '-4em',
		position: 'relative',
	},
	pubSectionFull: {
		marginRight: '0vw',
	},
	discussionSection: {
		verticalAlign: 'top',
		padding: '0em 0em',
		width: '35vw',
		height: '100%',
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		position: 'absolute',
		right: 0,
		top: 0,
		transition: '.15s ease-in-out transform',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	closeButton: {
		position: 'absolute',
		
		height: '100vh',
		top: '0',
		textAlign: 'center',
		cursor: 'pointer',
		width: '2em',
		left: 'calc(-2em - 1px)',
		color: '#58585B',
	},
	closeText: {
		transform: 'rotate(90deg)',
		height: '1em',
		lineHeight: '.4em',
		display: 'block',
		position: 'relative',
		top: '50%',
	},
	hideDiscussion: {
		transform: 'translate3d(100%, 0, 0)'
	},

	contenty: {
		// backgroundColor: 'green',
		height: 'calc(100vh - 40px)',
		width: 'calc(100% - 4em)',
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '0em 2em 1em',
	},

};
