import React, {PropTypes} from 'react';
import Radium from 'radium';

// import {globalStyles} from 'utils/styleConstants';
import {Button} from 'components';

// import {globalMessages} from 'utils/globalMessages';
import {injectIntl} from 'react-intl';

let styles = {};

const defaultFields = {
	// filetype: '', // READONLY: Original file extension, e.g. .jpg, .png, .csv
	// originalFilename: '', // READONLY: Original filename of the asset. Static for each file
	// thumbnail: '', // READONLY: Scaled version of the document.
	// url: '', // READONLY: Original - full-size version of the asset
	license: '',
	attribution: '',
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
		return { };
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.assetLoading && !nextProps.assetLoading) {
			this.props.close();
		}
	},

	saveAsset: function() {
		const oldAssetData = this.props.assetObject.assetData || {};
		const newAssetObject = {};
		const newAssetData = {};

		newAssetObject._id = this.props.assetObject._id;
		newAssetObject.assetType = this.props.assetObject.assetType;
		newAssetObject.label = this.refs.label.value;
		newAssetObject.authors = this.props.assetObject.authors;

		for (const key in {...defaultFields, ...oldAssetData}) {
			if (key && this.refs[key]) {
				newAssetData[key] = this.refs[key].value;
			} else {
				newAssetData[key] = oldAssetData[key];
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
							onClick={this.saveAsset}
							isLoading={this.props.assetLoading} />
					</div>
					<div style={styles.buttonWrapper}>
						<Button
							key={'customStyleSaveButton'}
							label={'Cancel'}
							onClick={this.props.close}/>
					</div>

				</div>

				<div style={styles.thumbnailWrapper}>
					<img style={styles.thumbnail} src={assetData.thumbnail} />
				</div>

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
							if (inputItem === 'filetype' || inputItem === 'originalFilename' || inputItem === 'thumbnail' || inputItem === 'url') {
								return null;
							}
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
	thumbnailWrapper: {
		margin: '10px 20px',
		width: '100px',
	},
	thumbnail: {
		width: '100%',
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

};
