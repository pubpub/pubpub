import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {Autocomplete} from '../../containers';
// import {Reference} from '../';
import {EditorModalReferencesRow} from './';
import {baseStyles} from './editorModalStyle';
import {globalStyles} from '../../utils/styleConstants';
import bibtexParse from 'bibtex-parse-js';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, FormattedMessage} from 'react-intl';

let styles = {};

const EditorModalReferences = React.createClass({
	propTypes: {
		referenceData: PropTypes.object,
		updateReferences: PropTypes.func,
		referenceStyle: PropTypes.string,
		intl: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			referenceData: {},
		};
	},

	getInitialState: function() {
		return {
			isLoading: false,
			showAddOptions: false,
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

	toggleShowAddOptions: function() {
		this.setState({
			isLoading: false,
			showAddOptions: !this.state.showAddOptions,
			editingRefName: null,
			manualFormData: this.getInitialState().manualFormData,
		});
		this.refs.bibtexForm.value = '';
	},

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

	deleteReference: function(refName) {
		return ()=>{
			const newReferencesObject = this.props.referenceData;
			delete newReferencesObject[refName];
			this.props.updateReferences(newReferencesObject);
		};

	},

	renderReferencesSearchResults: function(results) {
		console.log(results);
		return (<div>Results</div>);
	},

	setAddOptionMode: function(mode) {
		return ()=>{
			this.setState({addOptionMode: mode});
		};
	},

	render: function() {
		const referenceData = [];
		for ( const key in this.props.referenceData ) {
			if (this.props.referenceData.hasOwnProperty(key)) {
				referenceData.push(this.props.referenceData[key]);
			}
		}
		// Disabled: Searching for References
		/*
		const messages = defineMessages({
			searchForRef: {
				id: 'editor.searchForRef',
				defaultMessage: 'Search for a reference',
			},
		});
		*/

		return (
			<div>
				<div style={baseStyles.topHeader}>
					<FormattedMessage {...globalMessages.references} />
					<span style={[styles.topHeaderSubtext, this.state.editingRefName && styles.showOnEdit]}> : <FormattedMessage {...globalMessages.edit} /></span></div>

				{/* Search for new Ref bar and advanced add option */}

				{
				// Disabled: Searching for References
				/*
				<div style={[baseStyles.rightCornerSearch, styles.mainContent[this.state.showAddOptions]]}>

					<Autocomplete
						autocompleteKey={'referencesAutocomplete'}
						route={'autocompleteReferences'}
						placeholder={this.props.intl.formatMessage(messages.searchForRef)}
						textAlign={'right'}
						resultRenderFunction={this.renderReferencesSearchResults}/>
					
				</div> */}

				<div key="refAdvancedText" style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[!this.state.showAddOptions]]} onClick={this.toggleShowAddOptions}>
					<FormattedMessage id="editor.addReference" defaultMessage="Add Reference"/>
				</div>


				{/* Back button that displays in advanced mode */}
				<div style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[this.state.showAddOptions]]} onClick={this.toggleShowAddOptions}>
					<FormattedMessage {...globalMessages.back} />
				</div>

				{/* Show a note if no content has been added yet */}
				{referenceData.length === 0 && this.state.showAddOptions === false
					? <div style={baseStyles.noContentBlock}>
						<FormattedMessage
							id="editor.noRefsAdded"
							defaultMessage="No References Added"/>
					</div>
					: null
				}

				{/* Main References table */}
				<div className="main-ref-content" style={[styles.mainContent[this.state.showAddOptions], referenceData.length === 0 && styles.hide]}>
					{/* References table header */}
					<div style={styles.rowContainer}>
						<div style={[styles.refNameColumn, styles.columnHeader]}>
							<FormattedMessage {...globalMessages.refName} />
						</div>
						<div style={[styles.bodyColumn, styles.columnHeader]}>
							<FormattedMessage {...globalMessages.citation} />
						</div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={styles.clearfix}></div>
					</div>

					{/* Iterate over citations */}
					{
						referenceData.map((citation, index) => {
							return (
								<EditorModalReferencesRow
									key={'citation-' + index}
									citation={citation}
									index={index}
									editRefFunction={this.editReference}
									deleteRefFunction={this.deleteReference}/>
							);
						})
					}

				</div>

				{/* Content section displayed when in advanced add mode */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptions[this.state.showAddOptions], styles.addOptionsContent]}>

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
						<div style={styles.saveForm} key={'referencesBibtexFormSaveButton'} onClick={this.saveBibtexForm}>
							<FormattedMessage {...globalMessages.save} />
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
								Object.keys(this.state.manualFormData).map((inputItem)=>{
									return (
										<div key={'manualForm-' + inputItem} style={styles.manualFormInputWrapper}>
											<label style={styles.manualFormInputTitle} htmlFor={inputItem}>
												<FormattedMessage {...globalMessages[inputItem]} />
											</label>
											<input style={styles.manualFormInput} name={inputItem} id={inputItem} type="text" onChange={this.handleManualInputFormChange} value={this.state.manualFormData[inputItem]}/>
										</div>

									);
								})
							}
							<div style={styles.clearfix}></div>
						</div>
						<div style={styles.saveForm} key={'referencesManualFormSaveButton'} onClick={this.saveManualForm}>
							<FormattedMessage {...globalMessages.save} />
						</div>

						<div style={styles.clearfix}></div>
					</div>
				</div>

			</div>
		);
	}
});

export default injectIntl(Radium(EditorModalReferences));

styles = {
	mainContent: {
		true: {
			display: 'none',
		},
	},
	addOptions: {
		true: {
			display: 'block',
		},
		display: 'none',

	},
	addOptionsContent: {
		padding: '15px 25px',
	},
	rowContainer: {
		width: 'calc(100% - 30px)',
		padding: 15,
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
	},
	refNameColumn: {
		width: 'calc(25% - 20px)',
		padding: '0px 10px',
		float: 'left',
	},
	columnHeader: {
		fontFamily: baseStyles.rowHeaderFontFamily,
		fontSize: baseStyles.rowHeaderFontSize,
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
