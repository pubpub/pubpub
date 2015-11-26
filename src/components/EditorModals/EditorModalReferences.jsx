import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {Reference} from '../';
import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';
import bibtexParse from 'bibtex-parse-js';

let styles = {};

const EditorModalReferences = React.createClass({
	propTypes: {
		referenceData: PropTypes.object,
		updateReferences: PropTypes.func,
		referenceStyle: PropTypes.string,
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
		const newManualFormData = this.state.manualFormData;
		newManualFormData[event.target.name] = event.target.value;
		this.setState({newManualFormData});
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
				date: newRef.entryTags.year ? newRef.entryTags.year : null,
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

	render: function() {
		const referenceData = [];
		for ( const key in this.props.referenceData ) {
			if (this.props.referenceData.hasOwnProperty(key)) {
				referenceData.push(this.props.referenceData[key]);
			}
		}

		return (
			<div>
				<h2 style={baseStyles.topHeader}>References <span style={[styles.topHeaderSubtext, this.state.editingRefName && styles.showOnEdit]}>: Edit</span></h2>

				{/* Search for new Ref bar and advanced add option */}
				<div style={[baseStyles.rightCornerSearch, styles.mainContent[this.state.showAddOptions]]}>
					<Autocomplete 
						autocompleteKey={'referencesAutocomplete'} 
						route={'autocompleteReferences'} 
						placeholder="Search for reference" 
						textAlign={'right'}
						resultRenderFunction={this.renderReferencesSearchResults}/>

					<div key="refAdvancedText" style={baseStyles.rightCornerSearchAdvanced} onClick={this.toggleShowAddOptions}>more add options</div>
				</div>


				{/* Back button that displays in advanced mode */}
				<div style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[this.state.showAddOptions]]} onClick={this.toggleShowAddOptions}>
					Back
				</div>

				{/* Main References table */}
				<div className="main-ref-content" style={styles.mainContent[this.state.showAddOptions]}>
					{/* References table header */}
					<div style={styles.rowContainer}>
						<div style={[styles.refNameColumn, styles.columnHeader]}>refName</div>
						<div style={[styles.bodyColumn, styles.columnHeader]}>citation</div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>
						<div style={styles.clearfix}></div>
					</div>
					
					{/* Iterate over citations */}
					{
						referenceData.map((citation, index) => {
							return (
								<div key={'citation-' + index} style={styles.rowContainer}>
									<div style={[styles.refNameColumn]}>{citation.refName}</div>
									<div style={[styles.bodyColumn]}> <Reference citationObject={citation} mode={this.props.referenceStyle} /> </div>
									<div style={[styles.optionColumn, styles.optionColumnClickable]} key={'referenceListOptionColumnEdit-' + index} onClick={this.editReference(citation)}>edit</div>
									<div style={[styles.optionColumn, styles.optionColumnClickable]} key={'referenceListOptionColumnDelete-' + index} onClick={this.deleteReference(citation.refName)}>delete</div>
									<div style={styles.clearfix}></div>
								</div>
							);
						})
					}
					
				</div>

				{/* Content section displayed when in advanced add mode */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptions[this.state.showAddOptions], styles.addOptionsContent]}>
					<div style={this.state.editingRefName && styles.hideOnEdit}>
						<h2 style={styles.sectionHeader}>Add Bibtex</h2>
						<div style={styles.inputFormWrapper}>
							<textarea style={styles.textArea} ref="bibtexForm"></textarea>
						</div>
						<div style={styles.saveForm} key={'referencesBibtexFormSaveButton'} onClick={this.saveBibtexForm}>Save</div>
						<div style={styles.clearfix}></div>
					</div>
					

					<h2 style={[styles.sectionHeader, this.state.editingRefName && styles.hideOnEdit]}>Manual Entry</h2>
					<div style={styles.inputFormWrapper}>
						{
							Object.keys(this.state.manualFormData).map((inputItem)=>{
								return (
									<div key={'manualForm-' + inputItem} style={styles.manualFormInputWrapper}>
										<label style={styles.manualFormInputTitle} htmlFor={inputItem} >{inputItem}</label>
										<input style={styles.manualFormInput} name={inputItem} id={inputItem} type="text" onChange={this.handleManualInputFormChange} value={this.state.manualFormData[inputItem]}/>
									</div>
									
								);
							})
						}
						<div style={styles.clearfix}></div>
					</div>
					<div style={styles.saveForm} key={'referencesManualFormSaveButton'} onClick={this.saveManualForm}>Save</div>

					<div style={styles.clearfix}></div>
				</div>

			</div>
		);
	}
});

export default Radium(EditorModalReferences);

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
	optionColumnClickable: {
		userSelect: 'none',
		color: globalStyles.veryLight,
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},
	clearfix: {
		// necessary because we float elements with variable height 
		display: 'table',
		clear: 'both',
	},
	sectionHeader: {
		margin: 0,
	},
	topHeaderSubtext: {
		display: 'none',
		fontSize: 25,
	},
	saveForm: {
		textAlign: 'right',
		fontSize: 20,
		position: 'relative',
		left: '20px',
		width: '52px',
		float: 'right',
		paddingRight: '10px',
		marginBottom: 10,

		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
	textArea: {
		margin: '8px 2%',
		maxWidth: '96%',
		width: '60%',
		height: 50,
		outline: 'none',
		fontFamily: 'Courier',
		fontSize: 13,
		padding: 5,
	},
	hideOnEdit: {
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
		margin: '8px 2%',
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
	}
};
