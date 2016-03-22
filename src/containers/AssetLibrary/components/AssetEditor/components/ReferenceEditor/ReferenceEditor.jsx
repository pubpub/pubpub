import React, {PropTypes} from 'react';
import Radium from 'radium';

import {globalStyles} from 'utils/styleConstants';
import bibtexParse from 'bibtex-parse-js';
import {Button} from 'components';

// import {globalMessages} from 'utils/globalMessages';
import {injectIntl} from 'react-intl';

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
		addAssets: PropTypes.func,
		updateAssets: PropTypes.func,
		close: PropTypes.func,
		assetLoading: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			addOptionMode: 'manual',
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.assetLoading && !nextProps.assetLoading) {
			this.props.close();
		}
	},

	saveManualForm: function() {
		const oldAssetData = this.props.assetObject.assetData || {};
		const newAssetObject = {};
		const newAssetData = {};

		newAssetObject._id = this.props.assetObject._id;
		newAssetObject.assetType = 'reference';
		newAssetObject.label = this.refs.label.value;
		newAssetObject.authors = this.props.assetObject.authors;

		for (const key in {...defaultFields, ...oldAssetData}) {
			if (key) {
				newAssetData[key] = this.refs[key].value;
			}

		}

		newAssetObject.assetData = newAssetData;

		// If there is an _id, update
		// Else, save it as new asset
		if (newAssetObject._id) {
			this.props.updateAssets([newAssetObject]);
		} else {
			this.props.addAssets([newAssetObject]);
		}
	},

	saveBibtexForm: function() {
		if (!Array.isArray(this.state.bibtexResult)) {
			return;
		}

		const newReferences = this.state.bibtexResult.map((result)=>{
			const newReference = {
				assetType: 'reference',
				label: result.citationKey || result.title || Date(),
				assetData: {},
			};
			for (const key in result.entryTags) {
				if (key) {
					newReference.assetData[key] = result.entryTags[key];
				}
			}
			return newReference;
		});
		this.props.addAssets(newReferences);
	},

	bibtexUpdate: function() {
		let output;
		try {
			output = bibtexParse.toJSON(this.refs.bibtexForm.value);
		} catch (err) {
			output = 'Error parsing Bibtex: ' + err;
		}

		this.setState({bibtexResult: output});
	},

	handleSaveClick: function() {
		if (this.state.addOptionMode === 'manual') {
			this.saveManualForm();
		} else if (this.state.addOptionMode === 'bibtex') {
			this.saveBibtexForm();
		}
	},
	setAddOptionMode: function(mode) {
		return ()=>{
			this.setState({addOptionMode: mode});
		};
	},

	render: function() {
		const assetObject = this.props.assetObject || {};
		const assetData = assetObject.assetData || {};

		return (
			<div>
				<div style={styles.buttons}>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Save'}
							onClick={this.handleSaveClick}
							isLoading={this.props.assetLoading} />
					</div>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Cancel'}
							onClick={this.props.close} />
					</div>

				</div>

				{/* Content section displayed when in advanced add mode */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptionsContent]}>

					{/* Input mode toggle buttons */}
					<div style={[styles.addOptionModes, this.props.assetObject.assetData && styles.hide]}>
						<div style={[styles.addOptionMode, this.state.addOptionMode === 'manual' && styles.addOptionModeActive]} key={'addOptionMode-manual'}onClick={this.setAddOptionMode('manual')}>Manual</div>
						<div style={[styles.addOptionMode, this.state.addOptionMode === 'bibtex' && styles.addOptionModeActive]} key={'addOptionMode-bibtex'}onClick={this.setAddOptionMode('bibtex')}>Bibtex</div>
					</div>

					{/* Bibtex input form */}
					<div style={[(this.state.editingRefName || this.state.addOptionMode !== 'bibtex') && styles.hide]}>
						<div style={styles.inputFormWrapper}>
							<textarea style={styles.textArea} ref="bibtexForm"
								placeholder="@article{bracewell1965fourier,
								title={The Fourier Transform and IIS Applications},
								author={Bracewell, Ron},journal={New York},year={1965}}" onChange={this.bibtexUpdate}></textarea>

								<div style={styles.bibtexRenderArea}>
									{Array.isArray(this.state.bibtexResult) && this.state.bibtexResult.map((result, index)=>{
										return (<div key={'bibtexResult-' + index}>
											<div style={styles.bibtexResultHeader}>
												{result.citationKey || result.title || Date()}
											</div>
											{Object.keys(result.entryTags).map((key)=>{
												return (
													<div key={'bibtexResultField-' + key}>
														<div style={styles.bibtexResultLabel}> {key} </div>
														<div style={styles.bibtexResultItem}> {result.entryTags[key]} </div>
													</div>
												);
											})}
											<hr/>
										</div>);
									})}
									{!Array.isArray(this.state.bibtexResult) && this.state.bibtexResult}
								</div>
						</div>

						<div style={styles.clearfix}></div>
					</div>


					{/* Manual input and edit form */}
					<div style={[(this.state.addOptionMode !== 'manual' && !this.state.editingRefName) && styles.hide]}>

						<div style={styles.inputFormWrapper}>
							<div key={'manualForm-labeldefault'} style={[styles.manualFormInputWrapper, {float: 'none', width: 'calc(100% - 40px)'}]}>
								<label style={styles.manualFormInputTitle} htmlFor={'label'}>
									{/* <FormattedMessage {...globalMessages['Label']} /> */}
									Label
								</label>
								<input style={styles.manualFormInput} ref={'label'} name={'label'} id={'label'} type="text" onChange={this.handleManualInputFormChange} defaultValue={assetObject.label}/>
							</div>

							{
								Object.keys({...defaultFields, ...assetData}).map((inputItem)=>{
									return (
										<div key={'manualForm-' + inputItem} style={styles.manualFormInputWrapper}>
											<label style={styles.manualFormInputTitle} htmlFor={inputItem}>
												{/* <FormattedMessage {...globalMessages[inputItem]} /> */}
												{inputItem}
											</label>
											<input style={styles.manualFormInput} ref={inputItem} name={inputItem} id={inputItem} type="text" onChange={this.handleManualInputFormChange} defaultValue={assetData[inputItem]}/>
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
		width: 'calc(50% - 40px - 10px - 2px)',
		height: 150,
		outline: 'none',
		fontFamily: 'Courier',
		fontSize: 16,
		padding: 5,
		float: 'left',
	},
	bibtexRenderArea: {
		margin: '8px 20px',
		padding: 5,
		width: 'calc(50% - 40px - 10px)',
		float: 'left',
	},
	bibtexResultLabel: {
		paddingLeft: '20px',
	},
	bibtexResultItem: {
		paddingLeft: '40px',
		paddingBottom: '10px',
		color: '#777',
		wordWrap: 'break-word',
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
		width: 'calc(50% - 40px)',
		margin: '8px 20px 16px 20px',
		float: 'left',
	},
	manualFormInputTitle: {
		fontSize: 14,
		color: '#BBB',
	},
	manualFormInput: {
		width: '100%',
		fontFamily: 'Courier',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#BBB',
		outline: 'none',
		fontSize: 16,
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
