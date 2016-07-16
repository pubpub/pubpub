import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getAtomEdit, saveVersion} from './actions';
import {safeGetInToJS, safeToJS} from 'utils/safeParse';

import {HorizontalNav} from 'components';
import AtomEditorHeader from './AtomEditorHeader';
import AtomEditorPane from './AtomEditorPane';
import AtomEditorModals from './AtomEditorModals';
import AtomEditorContributors from './AtomEditorContributors';


// import {globalStyles} from 'utils/styleConstants';
// import {generateTOC} from 'utils/generateTOC';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const AtomEditor = React.createClass({
	propTypes: {

		mode: PropTypes.string,

		//within AtomEditData
		atomData: PropTypes.object,
		contributorData: PropTypes.object,

		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
		slug: PropTypes.string,
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			return dispatch(getAtomEdit(routeParams.slug));
		}
	},

	getInitialState() {
		return {
			modalMode: undefined,
		};
	},

	saveVersionSubmit: function() {
		const newVersionContent = this.refs.atomEditorPane.refs.editor.getSaveVersionContent();
		const atomData = this.props.atomData.toJS();
		const newVersion = {
			type: atomData.type,
			message: '',
			parent: atomData._id,
			content: newVersionContent
		};
		this.props.dispatch(saveVersion(newVersion));
	},

	openModal: function(mode) {
		this.setState({modalMode: mode});
	},

	fetchModalData: function(mode) {
			return dispatch(getPubEdit(routeParams.slug));
	},

	closeModal: function() {
		this.setState({modalMode: undefined});
	},

	render: function() {

		const metaData = {};


		const navItems = [
			{text: 'View', link: '/a/' + this.props.slug},
			{text: 'Edit', link: '/a/' + this.props.slug + '/draft', active: true},
			{text: 'Details', rightAlign: true, action: this.openModal.bind(this, 'details')},
			{text: 'Contributors', rightAlign: true, action: this.openModal.bind(this, 'contributors')},
			{text: 'Styles', rightAlign: true, action: this.openModal.bind(this, 'styles')},
			{text: 'Publishing', rightAlign: true, action: this.openModal.bind(this, 'publishing')},
		];

		const atomEditData = safeGetInToJS(this.props.atomEditData, ['atomData']) || {};
		const contributorData = safeToJS(this.props.contributorData) || [];

		// debugger;

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />


				{/* Pub Section */}
				<div style={styles.pubSection}>
					<HorizontalNav navItems={navItems} />

					<AtomEditorHeader
						title={atomEditData.title}
						saveVersionHandler={this.saveVersionSubmit} />

					<AtomEditorPane ref={'atomEditorPane'} atomEditData={this.props.atomEditData} loginData={this.props.loginData}/>

					<AtomEditorModals mode={this.state.modalMode} closeModalHandler={this.closeModal}>

						{(()=>{
							switch (this.state.modalMode) {
							case 'contributors':
								return <AtomEditorContributors contributorData={contributorData}/>;
							default:
								return <div>SPAM SPAM SPMA</div>;
							}
						})()}

					</AtomEditorModals>/>

				</div>

			</div>
		);
	}

});


export default connect( state => {
	return {
		atomEditData: state.atomEdit,
		// atomData: state.atomEdit.get('atomData'),
		contributorData: state.atomEdit.get('contributorData'),
		loginData: state.login,
		slug: state.router.params.slug,
		query: state.router.location.query,

		meta: state.router.params.meta,
		metaID: state.router.params.metaID,
		inviteStatus: state.user.get('inviteStatus')
	};
})( Radium(AtomEditor) );

styles = {
	tocSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '300px',
		backgroundColor: '#F3F3F4',
		borderRight: '1px solid #E4E4E4',
		fontSize: '0.9em',
	},
	tocHover: {
		width: '2em',
		position: 'absolute',
		top: '0px',
		bottom: '0px',
		paddingTop: '15px',
	},
	tocIcon: {
		position: 'relative',
		width: '10px',
		height: '2px',
		marginBottom: '1px',
		backgroundColor: '#BBBDC0',
		borderRadius: '1px',
	},

	tocPopout: {
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '2em',
	},
	pubSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '0em 2em',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '0em 1em',
		},
	},
	iconLeft: {
		position: 'absolute',
		width: '1.5em',
		height: '100%',
		cursor: 'pointer',
		top: 0,
		left: 0,
		opacity: 0,
		backgroundColor: '#F3F3F4',
		borderRight: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	iconRight: {
		position: 'absolute',
		width: '1.5em',
		height: '100%',
		cursor: 'pointer',
		top: 0,
		right: 0,
		opacity: 0,
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	discussionSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '0em 2%',
		width: '35%',
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	pubBodyWrapper: {
		maxWidth: '650px',
		margin: '0 auto',
		padding: '0em 3em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			maxWidth: 'auto',
			padding: '0em 0em',
		},
	},
	pubMetaWrapper: {
		maxWidth: '1024px',
		margin: '0 auto',
		padding: '2em 3em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			maxWidth: 'auto',
			padding: '1em 0em',
		},
	},

	container: {
		display: 'table',
		width: '100%',
		tableLayout: 'fixed',
		overflow: 'hidden',
		minHeight: '100vh',
	},

	tocItem: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		paddingRight: '2em',
		paddingTop: '1em',
		paddingBottom: '1em',
		paddingLeft: '2em',
	},

	tocLevels: [
		{paddingLeft: '2em'},
		{paddingLeft: '4em'},
		{paddingLeft: '5em'},
		{paddingLeft: '6em'},
		{paddingLeft: '7em'},
		{paddingLeft: '8em'},
	],
	noBottomMargin: {
		marginBottom: '0px',
	},

};
