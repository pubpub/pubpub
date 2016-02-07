import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const EditorTopNac = React.createClass({
	propTypes: {
		status: PropTypes.string,
		darkMode: PropTypes.bool,
		openModalHandler: PropTypes.func,
		editorSaveStatus: PropTypes.string,
		toggleLivePreviewHandler: PropTypes.func,
		viewMode: PropTypes.string,
	},

	render: function() {
		
		return (
			
			<div id="editorTopNav" style={[styles.editorTopNav, globalStyles.hiddenUntilLoad, globalStyles[this.props.status], this.props.darkMode && styles.editorTopNavDark, this.props.viewMode === 'read' && globalStyles.invisible]}>
				<ul style={styles.editorNav}>

					<li key="editorNav0"style={[styles.editorNavItem]} onClick={this.props.openModalHandler('Assets')}>
						<FormattedMessage {...globalMessages.assets} />
					</li>
					<li style={styles.editorNavSeparator}></li>
					<li key="editorNav1"style={[styles.editorNavItem]} onClick={this.props.openModalHandler('References')}>
						<FormattedMessage {...globalMessages.references} />
					</li>
					<li style={styles.editorNavSeparator}></li>
					<li key="editorNav2"style={[styles.editorNavItem]} onClick={this.props.openModalHandler('Collaborators')}>
						<FormattedMessage {...globalMessages.collaborators} />
					</li>
					<li key="editorNavUsers" style={[styles.editorNavItemUsers]}>
						<div id={'userlist'}></div>
					</li>

					<li key="editorNav3"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.props.openModalHandler('Publish')}>
						<FormattedMessage {...globalMessages.publish} />
					</li>
					<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
					<li key="editorNav4"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.props.toggleLivePreviewHandler}>
						<FormattedMessage id="editor.livePreview" defaultMessage="Live Preview"/>
					</li>
					<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
					<li key="editorNav5"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.props.openModalHandler('Style')}>
						<FormattedMessage {...globalMessages.settings} />
					</li>
					<li key="editorNav7"style={[styles.editorNavItemSaveStatus, styles.editorNavRight]}>
						{(()=>{
							switch (this.props.editorSaveStatus) {
							case 'saved':
								return <FormattedMessage id="editor.pubSaved" defaultMessage="Pub Saved"/>;
							case 'saving':
								return <FormattedMessage id="editor.pubSaving" defaultMessage="Pub Saving..."/>;
							default:
								return <FormattedMessage id="editor.disconnected" defaultMessage="Disconnected"/>;
							}
							// this.state.editorSaveStatus === 'saved' ? 'Pub Saved' : 'Pub Saving...'}
						})()}

					</li>

				</ul>
			</div>
		);
	}
});

export default Radium(EditorTopNac);

styles = {
	editorTopNav: {
		position: 'fixed',
		top: 30,
		width: '100%',
		backgroundColor: globalStyles.sideBackground,
		zIndex: 10,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	editorTopNavDark: {
		backgroundColor: '#272727',
	},
	editorNav: {
		listStyle: 'none',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,

	},
	editorNavItem: {
		height: '100%',
		padding: '0px 20px',
		lineHeight: globalStyles.headerHeight,
		float: 'left',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
	},
	editorNavSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'left',
	},
	editorNavItemUsers: {
		height: '100%',
		padding: '0px 0px',
		lineHeight: globalStyles.headerHeight,
		float: 'left',
	},
	editorNavItemSaveStatus: {
		height: '100%',
		padding: '0px 10px 0px 0px',
		lineHeight: 'calc(' + globalStyles.headerHeight + ' + 2px)',
		float: 'right',
		fontFamily: 'Courier',
		color: '#AAA',
		fontSize: '14px',
	},
	editorNavRight: {
		float: 'right',
	},
};
