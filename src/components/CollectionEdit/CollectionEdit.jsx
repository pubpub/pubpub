import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {LoaderIndeterminate} from '../../components';
import {PubPreview} from '../../components/ItemPreviews';
import {s3Upload} from '../../utils/uploadFile';
import {Autocomplete} from '../../containers';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const CollectionEdit = React.createClass({
	propTypes: {
		collectionData: PropTypes.object,
		handleCollectionSave: PropTypes.func,
		saveStatus: PropTypes.string,
		journalID: PropTypes.string,
		intl: PropTypes.object,
	},

	getDefaultProps: function() {
		
	},

	getInitialState() {
		return {
			// collectionSlug: this.props.collectionData.slug,
			headerImageURL: null,
		};
	},

	// updateNewCollectionSlug: function(evt) {
	// 	this.setState({collectionSlug: this.refs.slug.value.replace(/[^\w\s]/gi, '').replace(/ /g, '_').toLowerCase()});
	// },

	saveCollection: function() {
		const newCollectionData = {
			title: this.refs.title.value,
			// slug: this.refs.slug.value.replace(/[^\w\s]/gi, '').replace(/ /g, '_').toLowerCase(),
			description: this.refs.description.value,
		};
		if (this.state.headerImageURL) {
			newCollectionData.headerImageURL = this.state.headerImageURL;
		}
		this.props.handleCollectionSave(newCollectionData);
	},

	handleNewImage: function(evt) {
		// console.log(evt);
		if (evt.target.files && evt.target.files[0]) {
			const reader = new FileReader();
			reader.onload = (input)=> {
				const preview = input.target.result;
				// console.log('gunna set', input.target.result);
				// this.setState({previewImage: input.target.result});
				const binary = atob(preview.split(',')[1]);
				const mimeString = preview.split(',')[0].split(':')[1].split(';')[0];
				const array = [];
				for (let iii = 0; iii < binary.length; iii++) { array.push(binary.charCodeAt(iii));}
				const file = new Blob([new Uint8Array(array)], {type: mimeString});
				s3Upload(file, 'collectionHeaders', ()=>{}, this.onFileFinish, 0);	
			};
			reader.readAsDataURL(evt.target.files[0]);
		}

	},

	onFileFinish: function(evt, index, type, filename) {
		this.setState({headerImageURL: 'https://s3.amazonaws.com/pubpub-upload/' + filename});
		// console.log('https://s3.amazonaws.com/pubpub-upload/' + filename);
	},

	featurePub: function(input) {
		return ()=> {
			// console.log(input);
			const newPubs = this.props.collectionData.pubs.map((item)=>{
				return item._id;
			}); 
			newPubs.push(input);
			// console.log(newPubs);
			this.props.handleCollectionSave({pubs: newPubs});

		};
	},

	removePub: function(input) {
		return ()=> {
			// console.log(input);
			const newPubs = this.props.collectionData.pubs.map((item)=>{
				return item._id;
			}); 
			const index = newPubs.indexOf(input);
			if (index > -1) {
				newPubs.splice(index, 1);
			}

			this.props.handleCollectionSave({pubs: newPubs});

		};
	},

	renderPubSearchResults: function(results) {
		let totalCount = 0; // This is in the case that we have no results because the users in the list are already added
		const featuredObject = {};
		for (let index = this.props.collectionData.pubs.length; index--; ) {
			featuredObject[this.props.collectionData.pubs[index]._id] = true;
		}

		return (
			<div style={styles.results}>
				{

					results.map((pub, index)=>{

						if (pub._id in featuredObject) {
							return null;
						}

						totalCount++;
						return (<div key={'featuredPubSearch-' + index} style={styles.result}>

							<div style={styles.resultDetails}>
								<PubPreview 
									pubData={pub} 
									headerFontSize={'16px'}
									textFontSize={'13px'} 
									hideBottomLine={true}/>

							</div>
							
							<div style={styles.action} key={'featuredPubSearchAdd-' + index} onClick={this.featurePub(pub._id)}>
								<FormattedMessage {...globalMessages.add} />
							</div>
						</div>);	
					})
				}
				{results.length === 0 || totalCount === 0
					? <div style={styles.noResults}>
						<FormattedMessage {...globalMessages.noResults} />
					</div>
					: null
				}
				
			</div>
		);
	},

	render: function() {
		const messages = defineMessages({
			addPubsToCollection: {
				id: 'collections.addPubsToCollection',
				defaultMessage: 'Add Pubs to Collection',
			},
		});

		return (
			<div style={styles.container}>

				<div key={'collectionForm-title'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'title'}>
						<FormattedMessage
							id="collections.collectionTitle"
							defaultMessage="Collection Title"/>
					</label>
					<input style={styles.manualFormInput} name={'title'} id={'collectionForm-title'} ref={'title'} type="text" defaultValue={this.props.collectionData.title}/>
				</div>

				{/* <div key={'collectionForm-slug'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'slug'}>URL</label>
					<input style={styles.manualFormInput} name={'slug'} id={'collectionForm-slug'} ref={'slug'} type="text" onChange={this.updateNewCollectionSlug} value={this.state.collectionSlug} />
					<div style={styles.infoText}>Collection will live at <span style={styles.url}>{typeof(window) !== 'undefined' ? window.location.hostname : ''}/collection/<span style={styles.dark}>{(this.state.collectionSlug === '' || this.state.collectionSlug === undefined) ? '[URL]' : this.state.collectionSlug}</span></span></div>
				</div> */}

				<div key={'collectionForm-description'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'description'}>
						<FormattedMessage
							id="collections.description"
							defaultMessage="Description"/>
					</label>
					<textarea style={[styles.manualFormInput, styles.manualFormTextArea]} name={'description'} id={'collectionForm-description'} ref={'description'} defaultValue={this.props.collectionData.description}></textarea>
				</div>

				<div key={'collectionForm-headerImage'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'headerImage'}>
						<FormattedMessage
							id="collections.headerImage"
							defaultMessage="Header Image"/>
					</label>
					<input style={[styles.manualFormInput, styles.manualFormFile]} type="file" name={'headerImage'} ref={'headerImage'} accept="image/*" onChange={this.handleNewImage} />
					{this.state.headerImageURL ? <img src={this.state.headerImageURL} style={styles.previewImage}/> : null}
				</div>

				<div style={styles.saveSettings} key={'userSettingsSaveButton'} onClick={this.saveCollection}>
					<FormattedMessage {...globalMessages.save} />
				</div>

				<div style={styles.loader}>
					{this.props.saveStatus === 'saving'
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<div style={styles.editHeader}>
					<FormattedMessage {...globalMessages.pubs} />
				</div>
				<div style={styles.autocompleteWrapper}>
					<Autocomplete 
						autocompleteKey={'collectionFeatureAutocomplete'} 
						route={'autocompletePubs?journalID=' + this.props.journalID} 
						placeholder={this.props.intl.formatMessage(messages.addPubsToCollection)}
						resultRenderFunction={this.renderPubSearchResults}/>
				</div>
				
				{(()=>{
					const length = this.props.collectionData.pubs ? this.props.collectionData.pubs.length : 0;
					if (!length) {
						return (<div style={styles.emptyBlock}>
							<FormattedMessage
								id="collections.noPubsAddedToCollection"
								defaultMessage="No Pubs Added to Collection"/>
						</div>);
					} 
					const output = [];
					for (let index = length; index--;) {
						output.push(<div key={'collectionPubItem-' + index} style={styles.result}>

									<div style={styles.resultDetails}>
										<PubPreview 
											pubData={this.props.collectionData.pubs[index]} 
											headerFontSize={'16px'}
											textFontSize={'13px'} 
											hideBottomLine={true}/>

									</div>
									
									<div style={styles.action} key={'submittedPubItemAdd-' + index} onClick={this.removePub(this.props.collectionData.pubs[index]._id)}>
										<FormattedMessage {...globalMessages.remove} />
									</div>
								</div>);
					}
					return output;
				})()}

			</div>
		);
	}
});

export default injectIntl(Radium(CollectionEdit));

styles = {
	container: {
		margin: '10px 0px',
		fontFamily: 'Courier',
		position: 'relative',
	},
	inputWrapper: {
		width: '500px',
		margin: '30px 20px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
		},
	},
	manualFormInputTitle: {
		fontSize: 20,
		color: '#BBB',
	},
	manualFormInput: {
		width: '100%',
		fontFamily: 'Courier',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#BBB',
		outline: 'none',
		fontSize: 18,
		color: '#555',
	},
	manualFormFile: {
		fontSize: 14,
		margin: '10px 0px',
	},
	manualFormTextArea: {
		borderWidth: '1px 1px 1px 1px',
		resize: 'vertical',
	},
	saveSettings: {
		fontSize: 20,
		width: '52px',
		padding: '0px 20px',
		marginBottom: 20,
		fontFamily: globalStyles.headerFont,
		cursor: 'pointer',
		':hover': {
			color: 'black',
		}
	},
	loader: {
		position: 'absolute',
		bottom: 35,
		width: '100%',
	},
	infoText: {
		color: globalStyles.sideText,
		whiteSpace: 'nowrap',
	},
	dark: {
		color: 'black',
	},
	url: {
		fontFamily: 'Courier',
		fontSize: '15px',
		padding: '0px 5px',
	},
	previewImage: {
		width: '100px',
	},
	editHeader: {
		fontFamily: globalStyles.headerFont,
		fontSize: '25px',
	},
	autocompleteWrapper: {
		margin: '20px auto',
		width: '80%',
	},
	results: {
		boxShadow: '0px 0px 2px 2px #D7D7D7',
		width: 'calc(100% - 6px)',
		margin: '0 auto 5px auto',
		backgroundColor: 'white',

	},
	result: {
		padding: '5px 0px',
		// margin: '0px 5px',
		borderBottom: '1px solid #F0F0F0',
		display: 'table',
		tableLayout: 'fixed',
		width: '100%',
	},
	resultDetails: {
		display: 'table-cell',
		width: 'calc(100% - 80px)',
		padding: '5px 5px',
	},
	action: {
		display: 'table-cell',
		fontFamily: 'Courier',
		width: '80px',
		// backgroundColor: 'rgba(200,100,0,0.2)',
		verticalAlign: 'middle',
		userSelect: 'none',
		textAlign: 'center',
		cursor: 'pointer',
		':hover': {
			color: 'black',
		}
	},
	noResults: {
		fontFamily: 'Courier',
		fontSize: '15px',
		height: 30,
		lineHeight: '30px',
		textAlign: 'center',
	},
	emptyBlock: {
		backgroundColor: '#f6f6f6',
		width: '75%',
		margin: '0px auto',
		height: '85px',
		lineHeight: '85px',
		textAlign: 'center',
		border: '1px solid rgba(0,0,0,0.05)',
		borderRadius: '2px',
	},
};
