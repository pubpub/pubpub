import React, {PropTypes} from 'react';
import Radium from 'radium';

import {globalStyles} from '../../utils/styleConstants';
import bibtexParse from 'bibtex-parse-js';
import {Button} from '../';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, FormattedMessage} from 'react-intl';

let styles = {};

const defaultFields = {
	title: '',
	url: '',
	author: '',
	journal: '',
	volume: '',
	number: '',
	pages: '',
	year: '',
	publisher: '',
	doi: '',
	note: '',
};

const ReferenceEditor = React.createClass({
	propTypes: {
		assetObject: PropTypes.object,
		addAset: PropTypes.func,
		updateAset: PropTypes.func,

	},

	getInitialState: function() {
		return {
			isLoading: false,
			showAddOptions: true,
			addOptionMode: 'manual',
			editingRefName: null,
			manualFormData: {
				refName: null,
				title: null,
				url: null,
				author: null,
				journal: null,
				volume: null,
				number: null,
				pages: null,
				year: null,
				publisher: null,
				note: null,
			}
		};
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

	handleManualInputFormChange: function(event) {
		const newManualFormData = {...this.state.manualFormData};
		newManualFormData[event.target.name] = event.target.value;
		this.setState({manualFormData: newManualFormData});
	},

	saveManualForm: function() {
		const newReferencesObject = this.props.referenceData;
		if (this.state.editingRefName) {
			delete newReferencesObject[this.state.editingRefName];
		}
		// Check for refname or create
		const thisRefName = this.state.manualFormData.refName ? this.state.manualFormData.refName : 'newRef' + Date.now();
		const newRefData = this.state.manualFormData;
		newRefData.refName = thisRefName; // This is redundant if it has a refName, but sets one in case it wasn't input

		newReferencesObject[thisRefName] = newRefData;
		this.props.updateReferences(newReferencesObject);
		this.toggleShowAddOptions();
	},

	saveBibtexForm: function() {

		// console.log(this.refs.bibtexForm.value);
		// Convert all the text into new reference objects
		const output = bibtexParse.toJSON(this.refs.bibtexForm.value);
		console.log(output);

		const newReferencesObject = this.props.referenceData;

		// Add all the new bibtex items to newReferencesObject
		output.map((newRef)=>{
			const refName = newRef.citationKey ? newRef.citationKey.replace(/[^a-zA-Z0-9 ]/g, '') : 'newRef' + Date.now();
			newReferencesObject[refName] = {
				refName: refName,
				title: newRef.entryTags.title ? newRef.entryTags.title : null,
				author: newRef.entryTags.author ? newRef.entryTags.author : null,
				url: newRef.entryTags.url ? newRef.entryTags.url : null,
				journal: newRef.entryTags.journal ? newRef.entryTags.journal : null,
				volume: newRef.entryTags.volume ? newRef.entryTags.volume : null,
				number: newRef.entryTags.number ? newRef.entryTags.number : null,
				pages: newRef.entryTags.pages ? newRef.entryTags.pages : null,
				year: newRef.entryTags.year ? newRef.entryTags.year : null,
				publisher: newRef.entryTags.publisher ? newRef.entryTags.publisher : null,
				note: newRef.entryTags.note ? newRef.entryTags.note : null,
			};
		});

		// console.log(newReferencesObject);
		this.props.updateReferences(newReferencesObject);
		this.toggleShowAddOptions();


	},

	editReference: function(referenceObject) {
		return ()=>{
			this.setState({
				isLoading: false,
				showAddOptions: true,
				editingRefName: referenceObject.refName,
				manualFormData: {...this.getInitialState().manualFormData, ...referenceObject},
			});
		};
	},

	setAddOptionMode: function(mode) {
		return ()=>{
			this.setState({addOptionMode: mode});
		};
	},

	render: function() {
		const assetData = this.props.assetData || {};

		return (
			<div>
				<div style={styles.buttons}>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Save'}
							onClick={undefined}/>
					</div>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Cancel'}
							onClick={undefined}/>
					</div>

				</div>

				{/* Content section displayed when in advanced add mode */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptionsContent]}>

					<div style={[styles.addOptionModes, this.state.editingRefName && styles.hide]}>
						{/* <div style={[styles.addOptionText]}>Input Mode: </div> */}
						<div style={[styles.addOptionMode, this.state.addOptionMode === 'manual' && styles.addOptionModeActive]} key={'addOptionMode-manual'}onClick={this.setAddOptionMode('manual')}>Manual</div>
						<div style={[styles.addOptionMode, this.state.addOptionMode === 'bibtex' && styles.addOptionModeActive]} key={'addOptionMode-bibtex'}onClick={this.setAddOptionMode('bibtex')}>Bibtex</div>
					</div>

					<div style={[(this.state.editingRefName || this.state.addOptionMode !== 'bibtex') && styles.hide]}>
						{/* <div style={styles.sectionHeader}>
							<FormattedMessage
								id="editor.addBibtex"
								defaultMessage="Add Bibtex"/>
						</div> */}
						<div style={styles.inputFormWrapper}>
							<textarea style={styles.textArea} ref="bibtexForm"
								placeholder="@article{bracewell1965fourier,
								title={The Fourier Transform and IIS Applications},
								author={Bracewell, Ron},journal={New York},year={1965}}"></textarea>
						</div>

						<div style={styles.clearfix}></div>
					</div>

					{/* <hr style={styles.sectionDivider}/> */}

					<div style={[(this.state.addOptionMode !== 'manual' && !this.state.editingRefName) && styles.hide]}>
						{/* <div style={[styles.sectionHeader, this.state.editingRefName && styles.hide]}>
							<FormattedMessage
									id="editor.manualEntry"
									defaultMessage="Manual Entry"/>
						</div> */}
						<div style={styles.inputFormWrapper}>
							{
								Object.keys(defaultFields).map((inputItem)=>{
									return (
										<div key={'manualForm-' + inputItem} style={styles.manualFormInputWrapper}>
											<label style={styles.manualFormInputTitle} htmlFor={inputItem}>
												{/* <FormattedMessage {...globalMessages[inputItem]} /> */}
												{inputItem}
											</label>
											<input style={styles.manualFormInput} name={inputItem} id={inputItem} type="text" onChange={this.handleManualInputFormChange} defaultValue={assetData[inputItem]}/>
										</div>

									);
								})
							}
							<div style={styles.clearfix}></div>
						</div>


						<div style={styles.clearfix}></div>
					</div>
				</div>

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
