import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import NavDrag from 'components/NavDrag/NavDrag';
import { populateNavigationIds } from 'utilities';

require('./dashboardSite.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	error: PropTypes.string,
	isLoading: PropTypes.bool,
	onSave: PropTypes.func,
};
const defaultProps = {
	error: undefined,
	isLoading: false,
	onSave: ()=>{},
};

class DashboardSite extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.appData.title,
			subdomain: props.appData.subdomain,
			description: props.appData.description,
			// avatar: props.appData.avatar,
			favicon: props.appData.favicon,
			smallHeaderLogo: props.appData.smallHeaderLogo,
			largeHeaderLogo: props.appData.largeHeaderLogo,
			largeHeaderBackground: props.appData.largeHeaderBackground,
			accentColor: props.appData.accentColor,
			navigation: props.appData.navigation,
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleSubdomainChange = this.handleSubdomainChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		// this.handleAvatarChange = this.handleAvatarChange.bind(this);
		this.handleFaviconChange = this.handleFaviconChange.bind(this);
		this.handleSmallHeaderLogoChange = this.handleSmallHeaderLogoChange.bind(this);
		this.handleLargeHeaderLogoChange = this.handleLargeHeaderLogoChange.bind(this);
		this.handleLargeHeaderBackgroundChange = this.handleLargeHeaderBackgroundChange.bind(this);
		this.handleAccentColorChange = this.handleAccentColorChange.bind(this);
		this.handleNavigationChange = this.handleNavigationChange.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
	}
	handleTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}
	handleSubdomainChange(evt) {
		this.setState({ subdomain: evt.target.value.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase() });
	}
	handleDescriptionChange(evt) {
		this.setState({ description: evt.target.value.substring(0, 280).replace(/\n/g, ' ') });
	}
	// handleAvatarChange(val) {
	// 	this.setState({ avatar: val });
	// }
	handleFaviconChange(val) {
		this.setState({ favicon: val });
	}
	handleSmallHeaderLogoChange(val) {
		this.setState({ smallHeaderLogo: val });
	}
	handleLargeHeaderLogoChange(val) {
		this.setState({ largeHeaderLogo: val });
	}
	handleLargeHeaderBackgroundChange(val) {
		this.setState({ largeHeaderBackground: val });
	}
	handleAccentColorChange(evt) {
		this.setState({ accentColor: evt.target.value });
	}
	handleNavigationChange(val) {
		this.setState({ navigation: val });
	}
	handleSaveClick(evt) {
		evt.preventDefault();
		this.props.onSave({
			communityId: this.props.appData.id,
			...this.state
		});
	}
	render() {
		const collections = this.props.appData.collections || [];
		const navigation = this.props.appData.navigation || [];
		const initialNav = populateNavigationIds(collections, navigation);

		return (
			<div className={'dashboard-site'}>
				<h1 className={'content-title'}>Site</h1>
				<InputField
					label={'Title'}
					type={'text'}
					isRequired={true}
					value={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<InputField
					label={'Domain'}
					type={'text'}
					isRequired={true}
					value={this.state.subdomain}
					onChange={this.handleSubdomainChange}
				/>
				<InputField
					label={'Description'}
					type={'text'}
					isTextarea={true}
					value={this.state.description}
					onChange={this.handleDescriptionChange}
				/>
				{/* <ImageUpload
					htmlFor={'avatar-upload'}
					label={'Avatar Image'}
					defaultImage={this.state.avatar}
					onNewImage={this.handleAvatarChange}
					useCrop={true}
				/> */}
				<ImageUpload
					htmlFor={'favicon-upload'}
					label={'Favicon'}
					defaultImage={this.state.favicon}
					onNewImage={this.handleFaviconChange}
					helperText={'Used for browser icons. Must be square.'}
				/>
				<ImageUpload
					htmlFor={'small-header-logo-upload'}
					label={'Small Header Logo'}
					defaultImage={this.state.smallHeaderLogo}
					height={50}
					width={125}
					onNewImage={this.handleSmallHeaderLogoChange}
					helperText={'Used in the header bar. Suggested height: 40px'}
				/>
				<ImageUpload
					htmlFor={'large-header-logo-upload'}
					label={'Large Header Logo'}
					defaultImage={this.state.largeHeaderLogo}
					height={60}
					width={150}
					onNewImage={this.handleLargeHeaderLogoChange}
					helperText={'Used on the landing page. Suggested height: 200px'}
				/>
				<ImageUpload
					htmlFor={'large-header-background-upload'}
					label={'Large Header Background'}
					defaultImage={this.state.largeHeaderBackground}
					onNewImage={this.handleLargeHeaderBackgroundChange}
					width={150}
					helperText={'Used on the landing page. Suggested minimum dimensions: 1200px x 800px.'}
				/>
				<InputField
					label={'Accent Color'}
					type={'text'}
					value={this.state.accentColor}
					helperText={'e.g. #FF9944'}
					onChange={this.handleAccentColorChange}
				/>
				<InputField label={'Navigation'}>
					<NavDrag
						initialNav={initialNav}
						collections={collections}
						onChange={this.handleNavigationChange}
					/>
				</InputField>
				<InputField error={this.props.error}>
					<Button
						name={'create'}
						type={'submit'}
						className={'pt-button pt-intent-primary save-community-button'}
						onClick={this.handleSaveClick}
						text={'Save Site Details'}
						disabled={!this.state.title || !this.state.subdomain}
						loading={this.props.isLoading}
					/>
				</InputField>
			</div>
		);
	}
}

DashboardSite.propTypes = propTypes;
DashboardSite.defaultProps = defaultProps;
export default DashboardSite;
