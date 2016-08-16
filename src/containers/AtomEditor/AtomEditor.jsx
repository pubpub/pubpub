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

import AtomEditorDetails from './AtomEditorDetails';
import AtomEditorPublishing from './AtomEditorPublishing';
import AtomEditorSaveVersion from './AtomEditorSaveVersion';
import AtomEditorContributors from './AtomEditorContributors';

import {Loader} from 'components';

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

	componentWillReceiveProps(nextProps) {
		// If we transition from loading to not loading, without error, close modal
		// Don't do this if we're on the publishing modal though.

		// const previousLoading = safeGetInToJS(this.props.atomEditData, ['loading']);
		// const nextLoading = safeGetInToJS(nextProps.atomEditData, ['loading']);
		// const nextError = safeGetInToJS(nextProps.atomEditData, ['error']);
		// // if (previousLoading === true && nextLoading === false && !nextError && this.state.modalMode !== 'publishing') { 
		// // 	this.closeModal();
		// // }

		const oldSlug = safeGetInToJS(this.props.atomEditData, ['atomData', 'slug']);
		const newSlug = safeGetInToJS(nextProps.atomEditData, ['atomData', 'slug']);
		if (oldSlug !== newSlug) {
			this.props.dispatch(push('/pub/' + newSlug + '/edit'));
		}
	},

	getInitialState() {
		return {
			showRightPanel: true,
			rightPanelMode: 'details',
		};
	},

	toggleRightPanel: function() {
		this.setState({showRightPanel: !this.state.showRightPanel});
		setTimeout(()=> {
			window.scrollBy(0, 1);
			window.scrollBy(0, -1);
		}, 250);
	},

	setRightPanelMode: function(mode) {
		this.setState({rightPanelMode: mode});
		if (mode === 'details' || mode === 'contributors' || mode === 'publishing' ) {
			this.getModalData(mode);	
		}
	},

	// saveVersionClick: function() {
	// 	this.setState({modalMode: 'saveVersion'});
	// },

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

	// openModal: function(mode) {
	// 	this.setState({modalMode: mode});
	// },

	// closeModal: function() {
	// 	this.setState({modalMode: undefined});
	// },

	getModalData: function(mode) {
		const atomID = safeGetInToJS(this.props.atomEditData, ['atomData', '_id']);
		this.props.dispatch(getAtomEditModalData(atomID, mode));
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

		const atomNavItems = [
			{text: 'View', link: '/pub/' + this.props.slug},
			{text: 'Edit', link: '/pub/' + this.props.slug + '/edit', active: true},
		];

		const rightPanelNavItems = [
			{text: 'Details', action: this.setRightPanelMode.bind(this, 'details'), active: this.state.rightPanelMode === 'details'},
			{text: 'Contributors', action: this.setRightPanelMode.bind(this, 'contributors'), active: this.state.rightPanelMode === 'contributors'},
			{text: 'Publishing', action: this.setRightPanelMode.bind(this, 'publishing'), active: this.state.rightPanelMode === 'publishing'},

			// {text: 'Details', rightAlign: true, action: this.openModal.bind(this, 'details')},
			// {text: 'Contributors', rightAlign: true, action: this.openModal.bind(this, 'contributors')},
			// {text: 'Publishing', rightAlign: true, action: this.openModal.bind(this, 'publishing')},
		];

		
		const contributorsData = safeGetInToJS(this.props.atomEditData, ['contributorsData']) || [];
		const publishingData = safeGetInToJS(this.props.atomEditData, ['publishingData']) || [];
		const isLoading = safeGetInToJS(this.props.atomEditData, ['loading']);
		const error = safeGetInToJS(this.props.atomEditData, ['error']);
		const isModalLoading = safeGetInToJS(this.props.atomEditData, ['modalLoading']);
		const modalError = safeGetInToJS(this.props.atomEditData, ['modalError']);

		const authorsData = safeGetInToJS(this.props.atomEditData, ['authorsData']) || [];
		const authorList = atomEditData.customAuthorString ? [<a className={'author'} key={'customAuthorString'}>{atomEditData.customAuthorString}</a>] : authorsData.map((item, index)=> {
			return <a key={'atomAuthor-' + index} className={'author'}>{item.source.name}</a>;
		});

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				{/* Pub Section */}
				<StickyContainer>
					<div style={[styles.pubSection, !this.state.showRightPanel && styles.pubSectionFull]}>

						{/* Toggle Right Panel Button */}
						<div className={'opacity-on-hover'} style={styles.toggleRightPanelButton} onClick={this.toggleRightPanel}>
							<div style={styles.toggleRightPanelLine}></div>
							{this.state.showRightPanel &&
								<div style={styles.toggleRightHide}>Hide<br/>Panel</div>
							}
							{!this.state.showRightPanel &&
								<div style={styles.toggleRightShow}>Show<br/>Panel</div>
							}
						</div>

						<div style={styles.atomNavBar}>
							
							<Sticky style={styles.headerBar}>
								<HorizontalNav navItems={atomNavItems} mobileNavButtons={mobileNavButtons}/>
								<div style={styles.headerMenu} id={'headerPlaceholder'}></div>
								<div style={styles.headerStatus} className={'editor-participants opacity-on-hover'}></div>
							</Sticky>
							
						</div>

						<div className={safeGetInToJS(this.props.atomEditData, ['atomData', 'type']) === 'document' ? 'atom-reader atom-reader-meta' : 'atom-reader-meta'}>
							<AtomEditorHeader
								title={atomEditData.title}
								authors={authorList}
								saveVersionHandler={this.saveVersionClick} 
								openDetails={this.setRightPanelMode.bind(this, 'details')} />

							<AtomEditorPane ref={'atomEditorPane'} atomEditData={this.props.atomEditData} loginData={this.props.loginData}/>

						</div>
					</div>
				</StickyContainer>


				{/* Right Panel Section */}
				<StickyContainer style={[styles.rightPanel, !this.state.showRightPanel && styles.hideRightPanel]}>

					<Sticky>
						{/* <div className={'darker-color-hover'} onClick={this.toggleRightPanel} style={styles.toggleRightPanelButton}>
							<span style={styles.toggleRightPanelText}>...</span>
						</div> */}

						<HorizontalNav navItems={rightPanelNavItems} mobileNavButtons={mobileNavButtons}/>
						
						<div style={styles.rightPanelContent}>
							{(()=>{
								switch (this.state.rightPanelMode) {
								case 'saveVersion':
									return <AtomEditorSaveVersion handleVersionSave={this.saveVersionSubmit} isLoading={isLoading}/>;
								case 'details':
									return <AtomEditorDetails atomEditData={this.props.atomEditData} updateDetailsHandler={this.updateDetails} isLoading={isLoading} error={error}/>;
								case 'publishing':
									return <AtomEditorPublishing publishingData={publishingData} publishVersionHandler={this.publishVersionHandler} isLoading={isLoading} error={error}/>;
								case 'contributors':
									return (
										<AtomEditorContributors 
											contributorsData={contributorsData} 
											handleAddContributor={this.handleAddContributor}
											handleUpdateContributor={this.handleUpdateContributor}
											handleDeleteContributor={this.handleDeleteContributor}
											isLoading={isLoading} 
											error={error}/>
									);
								default:
									return <div style={styles.loadingWrapper}><Loader loading={isModalLoading} showCompletion={false}/></div>;
								}
							})()}
						</div>

						{/* <AtomEditorModals 
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
								modalError={modalError} /> */}
						
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
	pubSectionFull: {
		marginRight: '0vw',
	},
	atomNavBar: {
		width: 'calc(100% + 8em - 1px)',
		left: '-4em',
		position: 'relative',
	},
	rightPanel: {
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
	toggleRightPanelButton: {
		position: 'absolute',
		height: '100%',
		width: '4em',
		right: '-1em',
		top: '39px',
		cursor: 'pointer',
		opacity: 0,
		transition: '.2s linear opacity .1s',
		zIndex: 1,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	toggleRightPanelLine: {
		width: '1px',
		height: '100%',
		backgroundColor: '#2C2A2B',
		margin: '0em 1em 0em auto',
		
	},
	toggleRightHide: {
		position: 'fixed',
		top: '50%',
		right: 'calc(35vw + 5px)',
		textAlign: 'right',
	},
	toggleRightShow: {
		position: 'fixed',
		top: '50%',
		right: 'calc(0vw + 5px)',
		textAlign: 'right',
	},

	hideRightPanel: {
		transform: 'translate3d(100%, 0, 0)'
	},

	rightPanelContent: {
		// backgroundColor: 'green',
		height: 'calc(100vh - 40px)',
		width: 'calc(100% - 4em)',
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '0em 2em 1em',
	},
	headerBar: {
		position: 'relative',
		backgroundColor: 'white',
		zIndex: 1,
	},
	headerMenu: {
		position: 'absolute',
		right: 0,
		top: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'static',
		},
	},
	headerStatus: {
		position: 'absolute',
		left: 0,
		top: 44,
		opacity: 0.75,
		transition: '.1s linear opacity',
	},
	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		position: 'static',
	},

};
