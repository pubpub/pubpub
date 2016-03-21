import React, {PropTypes} from 'react';
import Radium from 'radium';

import {globalStyles} from 'utils/styleConstants';
import {Button} from 'components';

import {globalMessages} from 'utils/globalMessages';
import {injectIntl, FormattedMessage} from 'react-intl';

let styles = {};

const defaultFields = {
	url: '',
	thumbnail: '',
	
};

const ReferenceEditor = React.createClass({
	propTypes: {
		assetObject: PropTypes.object,
		addAssets: PropTypes.func,
		updateAsets: PropTypes.func,
		close: PropTypes.func,
		assetLoading: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			// isLoading: false,
			// showAddOptions: true,
			// addOptionMode: 'manual',
			// editingRefName: null,
			// manualFormData: {
			// 	refName: null,
			// 	title: null,
			// 	url: null,
			// 	author: null,
			// 	journal: null,
			// 	volume: null,
			// 	number: null,
			// 	pages: null,
			// 	year: null,
			// 	publisher: null,
			// 	note: null,
			// }
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.assetLoading && !nextProps.assetLoading) {
			this.props.close();
		}
	},
	// toggleShowAddOptions: function() {
	// 	this.setState({
	// 		isLoading: false,
	// 		showAddOptions: !this.state.showAddOptions,
	// 		editingRefName: null,
	// 		manualFormData: this.getInitialState().manualFormData,
	// 	});
	// 	this.refs.bibtexForm.value = '';
	// },

	

	render: function() {
		const assetObject = this.props.assetObject || {};

		return (
			<div>
				<div style={styles.buttons}>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Save'}
							onClick={undefined}
							isLoading={this.props.assetLoading} />
					</div>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Cancel'}
							onClick={this.props.close}/>
					</div>

				</div>

				<p>{JSON.stringify(assetObject)}</p>
				
			</div>
		);
	}
});

export default injectIntl(Radium(ReferenceEditor));

styles = {
	mainContent: {
		true: {
			display: 'none',
		},
	},
	addOptions: {
		
		display: 'block',
		

	},
	buttons: {
		position: 'absolute',
		top: 30,
		right: 20,
	},
	buttonWrapper: {
		float: 'right',
		marginLeft: '20px',
	},

	addOptionsContent: {
		padding: '15px 2px',
	},
	
	bodyColumn: {
		width: 'calc(55% - 20px)',
		padding: '0px 10px',
		float: 'left',
		overflow: 'hidden',
	},
	optionColumn: {
		width: 'calc(10% - 10px)',
		padding: '0px 5px',
		float: 'left',
		textAlign: 'center',
	},
	clearfix: {
		// necessary because we float elements with variable height
		display: 'table',
		clear: 'both',
	},
	sectionHeader: {
		margin: 0,
		fontSize: '1.5em',
	},
	sectionDivider: {
		width: '90%',
		marginBottom: '30px',
		borderColor: 'rgba(102, 102, 102, 0.15)',
		backgroundColor: 'transparent',
	},
	topHeaderSubtext: {
		display: 'none',
		fontSize: 25,
		margin: '.83em 0px',
	},
	saveForm: {
		// textAlign: 'center',
		fontSize: 20,
		// position: 'relative',
		// left: '20px',
		width: '52px',
		// backgroundColor: 'red',
		// float: 'right',
		padding: '0px 20px',
		marginBottom: 20,

		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
	textArea: {
		margin: '8px 20px',
		maxWidth: '96%',
		width: '60%',
		height: 50,
		outline: 'none',
		fontFamily: 'Courier',
		fontSize: 13,
		padding: 5,
	},
	hide: {
		display: 'none',
	},
	showOnEdit: {
		display: 'inline',
	},
	inputFormWrapper: {
		margin: '10px 0px',
		fontFamily: 'Courier',
	},
	manualFormInputWrapper: {
		width: '29%',
		margin: '8px 20px',
		float: 'left',
	},
	manualFormInputTitle: {
		fontSize: 13,
		color: '#BBB',
	},
	manualFormInput: {
		width: '100%',
		fontFamily: 'Courier',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#BBB',
		outline: 'none',
		fontSize: 14,
	},
	addOptionModes: {
		fontSize: '26px',
		marginBottom: '25px',
	},
	addOptionText: {
		color: '#222',
		display: 'inline-block',
	},
	addOptionMode: {
		display: 'inline-block',
		padding: '0px 15px',
		color: '#aaa',
		':hover': {
			cursor: 'pointer',
			color: '#222',
		},
	},
	addOptionModeActive: {
		color: '#222',
	}

};
