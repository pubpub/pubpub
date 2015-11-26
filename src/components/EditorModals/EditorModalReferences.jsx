import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {Reference} from '../';
import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';

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
		console.log(this.getInitialState());
		this.setState({
			showAddOptions: !this.state.showAddOptions,	
			editingRefName: null,
			manualFormData: this.getInitialState().manualFormData,
		});
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
		newReferencesObject[this.state.manualFormData.refName] = this.state.manualFormData;
		this.props.updateReferences(newReferencesObject);
		this.toggleShowAddOptions();
	},

	editReference: function(referenceObject) {
		return ()=>{
			this.setState({
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
				<h2 style={baseStyles.topHeader}>References</h2>

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
						<textarea></textarea>
					</div>
					

					<h2 style={[styles.sectionHeader, this.state.editingRefName && styles.hideOnEdit]}>Manual Entry</h2>
					<h2 style={[styles.sectionHeader, styles.sectionHeaderHidden, this.state.editingRefName && styles.showOnEdit]}>Edit Entry</h2>
					<div style={styles.saveManualForm} onClick={this.saveManualForm}>Save</div>
					<div style={styles.manualFormWrapper}>
						{
							Object.keys(this.state.manualFormData).map((inputItem)=>{
								return (
									<div key={'manualForm-' + inputItem} style={styles.manualFormInputWrapper}>
										<input style={styles.manualFormInput} placeholder={inputItem} name={inputItem} type="text" onChange={this.handleManualInputFormChange} value={this.state.manualFormData[inputItem]}/>
									</div>
									
								);
							})
						}
					</div>

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
	sectionHeaderHidden: {
		display: 'none',
	},
	saveManualForm: {
		textAlign: 'right',
	},
	hideOnEdit: {
		display: 'none',
	},
	showOnEdit: {
		display: 'block',
	},
	manualFormWrapper: {

	},
	manualFormInputWrapper: {
		width: '29%',
		margin: '5px 2%',
		float: 'left',
	},
	manualFormInput: {

	}
};
