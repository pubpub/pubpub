import React, { PropTypes } from 'react';
import { Sticky, StickyContainer } from 'react-sticky';
import { Tab2, Tabs2 } from "@blueprintjs/core";

import { Button } from '@blueprintjs/core';
import ColorPicker from 'components/ColorPicker/ColorPicker';
import Helmet from 'react-helmet';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import { globalStyles } from 'utils/globalStyles';
import { putJournal } from './actions';

let styles = {};

export const JournalEdit = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		handleHeaderUpdate: PropTypes.func,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			logo: undefined,
			headerColor: '',
			headerMode: '',
			headerAlign: '',
			headerImage: null,
			avatar: undefined,
			title: '',
			description: '',
			canSave: false,
		};
	},

	componentWillMount() {
		const journal = this.props.journal || {};
		this.setState({
			slug: journal.slug || '',
			title: journal.title || '',
			avatar: journal.avatar || 'https://assets.pubpub.org/_site/journal.png',
			logo: journal.logo,
			description: journal.description || '',
			headerColor: journal.headerColor || '#13A6EF',
			headerMode: journal.headerMode || 'title',
			headerAlign: journal.headerAlign || 'left',
			headerImage: journal.headerImage,
			website: journal.website || '',
			twitter: journal.twitter || '',
			facebook: journal.facebook || '',
		});
	},

	componentWillReceiveProps(nextProps) {
		// If the slug changed, redirect to new slug.
		const lastSlug = this.props.journal.slug;
		const nextSlug = nextProps.journal.slug;
		if (lastSlug && nextSlug && lastSlug !== nextSlug) {
			browserHistory.push('/' + nextSlug + '/details');
		}
	},

	componentWillUnmount() {
		this.props.handleHeaderUpdate({
			logo: undefined,
			headerColor: undefined,
			headerMode: undefined,
			headerAlign: undefined,
			headerImage: undefined,
		});
	},

	clearHeaderImageFinish: function() {
		this.setState({ headerImage: null });
		this.props.handleHeaderUpdate({ headerImage: null });
	},

	handleColorChange: function(colorChange) {
		this.setState({ headerColor: colorChange.hex, canSave: true });
		this.props.handleHeaderUpdate({ headerColor: colorChange.hex });
	},

	handleHeaderModeChange: function(value, evt) {
		evt.preventDefault();
		const newHeaderMode = value;
		this.setState({ headerMode: newHeaderMode, canSave: true });
		this.props.handleHeaderUpdate({ headerMode: newHeaderMode });
	},

	handleHeaderAlignChange: function(value, evt) {
		evt.preventDefault();
		const newHeaderAlign = value;
		this.setState({ headerAlign: newHeaderAlign, canSave: true });
		this.props.handleHeaderUpdate({ headerAlign: newHeaderAlign });
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value, canSave: true });
	},

	inputUpdateLowerCase: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value.toLowerCase(), canSave: true });
	},

	descriptionUpdate: function(evt) {
		const description = evt.target.value || '';
		this.setState({ description: description.substring(0, 280), canSave: true });
	},

	saveJournal: function(evt) {
		evt.preventDefault();

		const newJournalData = {};
		Object.keys(this.state).map((key)=> {
			newJournalData[key] = this.state[key];
		});

		this.setState({ canSave: false });
		this.props.dispatch(putJournal(this.props.journal.id, newJournalData));
	},
	handleIconFinish: function(imageUrl) {
		this.setState({ avatar: imageUrl, canSave: true });
		this.props.handleHeaderUpdate({ avatar: imageUrl });
	},

	handleLogoFinish: function(imageUrl) {
		this.setState({ logo: imageUrl, canSave: true });
		this.props.handleHeaderUpdate({ logo: imageUrl });
	},
	handleHeaderImageFinish: function(imageUrl) {
		this.setState({ headerImage: imageUrl, canSave: true });
		this.props.handleHeaderUpdate({ headerImage: imageUrl });
	},

	render: function() {
		const journal = this.props.journal || {};

		const metaData = {
			title: 'Edit · ' + journal.title,
		};

		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;

		const basicPanel = (
			<div style={styles.formContentWrapper}>
				<label style={styles.label} htmlFor={'title'}>
					Journal Name
					<input className={'pt-input margin-bottom'} id={'title'} name={'title'} type="text" style={styles.input} value={this.state.title} onChange={this.inputUpdate.bind(this, 'title')} />
				</label>

				<ImageUpload
					defaultImage={this.state.avatar}
					userCrop={true}
					label={'Journal Avatar'}
					tooltip={'Used as the Journal\'s preview image in search results and throughout the site.'}
					containerStyle={styles.imageContainer}
					onNewImage={this.handleIconFinish} />

				<ImageUpload
					defaultImage={this.state.logo}
					userCrop={false}
					label={'Logo'}
					tooltip={'Used in the Header bar for all branded Journal pages'}
					containerStyle={styles.imageContainer}
					onNewImage={this.handleLogoFinish}
					canClear={true} />


				<ImageUpload
					defaultImage={this.state.headerImage}
					userCrop={false}
					label={'Background Image'}
					tooltip={'Used for the Joural\'s header background'}
					containerStyle={styles.imageContainer}
					onNewImage={this.handleHeaderImageFinish}
					canClear={true} />


				<label htmlFor={'headerMode'} style={{ display: 'inline-block', padding: '1em 2em 1em 0em', verticalAlign: 'top'}}>
					Header Mode

					<div style={{ margin: '0.5em 0em', display: 'block' }} className={'pt-button-group'}>
						<button className={this.state.headerMode === 'title' ? 'pt-button pt-active' : 'pt-button'} onClick={this.handleHeaderModeChange.bind(this, 'title')}>Title</button>
						<button className={this.state.headerMode === 'logo' ? 'pt-button pt-active' : 'pt-button'} onClick={this.handleHeaderModeChange.bind(this, 'logo')}>Logo</button>
						<button className={this.state.headerMode === 'both' ? 'pt-button pt-active' : 'pt-button'} onClick={this.handleHeaderModeChange.bind(this, 'both')}>Both</button>
					</div>
				</label>


				<label htmlFor={'headerAlign'} style={{ display: 'inline-block', padding: '1em 2em 1em 0em', verticalAlign: 'top'}}>
					Header Align
					<div style={{margin:'0.5em', display: 'block'}} className={'pt-button-group'}>
						<button className={this.state.headerAlign === 'left' ? 'pt-button pt-active' : 'pt-button'} onClick={this.handleHeaderAlignChange.bind(this, 'left')}>Left</button>
						<button className={this.state.headerAlign === 'center' ? 'pt-button pt-active' : 'pt-button'} onClick={this.handleHeaderAlignChange.bind(this, 'center')}>Center</button>
					</div>
				</label>


				<label style={{ display: 'inline-block', padding: '1em 2em 1em 0em', verticalAlign: 'top' }}>
					Background Color
					<div style={{ margin: '0.75em 0em', display: 'block' }}>
						<ColorPicker
							color={this.state.headerColor}
							onChange={this.handleColorChange}
							colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b']} />
					</div>

				</label>

				<label style={styles.label} htmlFor={'slug'}>
					Journal URL
					<input className={'pt-input margin-bottom'} id={'slug'} name={'slug'} type="text" style={styles.input} value={this.state.slug} onChange={this.inputUpdate.bind(this, 'slug')} />
				</label>

				<label style={styles.label} htmlFor={'description'}>
					Short Description
					<textarea className={'pt-input margin-bottom'} id={'description'} name={'description'} type="text" style={[styles.input, styles.textarea]} onChange={this.descriptionUpdate} value={this.state.description} />
					<div className={'light-color inputSubtext'}>
						{this.state.description.length} / 280
					</div>
				</label>


				<label style={styles.label} htmlFor={'website'}>
					Website
					<input className={'pt-input margin-bottom'} id={'website'} name={'website'} type="text" style={styles.input} value={this.state.website} onChange={this.inputUpdate.bind(this, 'website')} />
				</label>

				<label htmlFor={'twitter'}>
					Twitter
					<div className="pt-control-group prefixed-group margin-bottom">
						<div className={'pt-button pt-disabled input-prefix'}>@</div>
						<input className={'pt-input prefixed-input'} id={'twitter'} name={'twitter'} type="text" style={styles.input} value={this.state.twitter} onChange={this.inputUpdate.bind(this, 'twitter')} />
					</div>
				</label>

				<label htmlFor={'facebook'}>
					Facebook
					<div className="pt-control-group prefixed-group margin-bottom">
						<div className={'pt-button pt-disabled input-prefix'}>facebook.com/</div>
						<input className={'pt-input prefixed-input'} id={'facebook'} name={'facebook'} type="text" style={styles.input} value={this.state.facebook} onChange={this.inputUpdate.bind(this, 'facebook')} />
					</div>
				</label>

			</div>);

		const advancedPanel = (
			<div>Advanced Edit</div>
		);

		return (
			<div>
				<Helmet {...metaData} />

				<StickyContainer>
				<form onSubmit={this.saveJournal} style={styles.form}>
					<Sticky>
					<div style={styles.buttonWrapper}>
						<Button
							type="button"
							className={'pt-intent-primary'}
							disabled={!this.state.canSave}
							onClick={this.saveJournal}
							text={'Save Journal'}
							loading={isLoading} />


						<div style={styles.errorMessage}>{errorMessage}</div>
					</div>
					</Sticky>


					<Tabs2 id="Tabs2Example">
					    <Tab2 id="basic" title="Basic" panel={basicPanel} />
							<Tab2 id="advanced" title="Advanced" panel={advancedPanel} />
					</Tabs2>


				</form>
				</StickyContainer>

			</div>
		);
	}

});

export default Radium(JournalEdit);

styles = {
	form: {
		// width: '500px',
		// position: 'relative',
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	width: 'auto',
		// }
	},
	buttonWrapper: {
		// float: 'right',
		position: 'absolute',
		right: 0,
	},
	formContentWrapper: {
		width: '500px',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	imageContainer: {
		marginRight: '3em',
	},
	input: {
		width: 'calc(100% - 20px)', // Calculations come from padding and border
	},
	image: {
		maxWidth: '100%',
	},

	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	radioInput: {
		margin: '0em 1em',
		display: 'inline-block',
	},
	clear: {
		cursor: 'pointer',
	},
};
