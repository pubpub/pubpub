import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Tooltip } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import NavDrag from 'components/NavDrag/NavDrag';
import { populateNavigationIds } from 'utilities';

require('./dashboardSite.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
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
			title: props.communityData.title,
			subdomain: props.communityData.subdomain,
			description: props.communityData.description,
			avatar: props.communityData.avatar,
			favicon: props.communityData.favicon,
			smallHeaderLogo: props.communityData.smallHeaderLogo,
			largeHeaderLogo: props.communityData.largeHeaderLogo,
			largeHeaderBackground: props.communityData.largeHeaderBackground,
			accentColor: props.communityData.accentColor,
			navigation: props.communityData.navigation,
			website: props.communityData.website || '',
			twitter: props.communityData.twitter || '',
			facebook: props.communityData.facebook || '',
			email: props.communityData.email || '',
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleSubdomainChange = this.handleSubdomainChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleAvatarChange = this.handleAvatarChange.bind(this);
		this.handleFaviconChange = this.handleFaviconChange.bind(this);
		this.handleSmallHeaderLogoChange = this.handleSmallHeaderLogoChange.bind(this);
		this.handleLargeHeaderLogoChange = this.handleLargeHeaderLogoChange.bind(this);
		this.handleLargeHeaderBackgroundChange = this.handleLargeHeaderBackgroundChange.bind(this);
		this.handleAccentColorChange = this.handleAccentColorChange.bind(this);
		this.handleNavigationChange = this.handleNavigationChange.bind(this);
		this.handleWebsiteChange = this.handleWebsiteChange.bind(this);
		this.handleTwitterChange = this.handleTwitterChange.bind(this);
		this.handleFacebookChange = this.handleFacebookChange.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleSaveClick = this.handleSaveClick.bind(this);
	}
	handleTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}
	handleSubdomainChange(evt) {
		this.setState({ subdomain: evt.target.value.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase() });
	}
	handleDescriptionChange(evt) {
		this.setState({ description: evt.target.value.substring(0, 280).replace(/\n/g, ' ') });
	}
	handleAvatarChange(val) {
		this.setState({ avatar: val });
	}
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
	handleWebsiteChange(evt) {
		this.setState({ website: evt.target.value });
	}
	handleTwitterChange(evt) {
		this.setState({ twitter: evt.target.value });
	}
	handleFacebookChange(evt) {
		this.setState({ facebook: evt.target.value });
	}
	handleEmailChange(evt) {
		this.setState({ email: evt.target.value });
	}
	handleSaveClick(evt) {
		evt.preventDefault();
		this.props.onSave({
			communityId: this.props.communityData.id,
			...this.state
		});
	}
	render() {
		const collections = this.props.communityData.collections || [];
		const navigation = this.props.communityData.navigation || [];
		const initialNav = populateNavigationIds(collections, navigation);

		return (
			<div className="dashboard-site-component">
				<h1 className="content-title">Site</h1>
				<InputField
					label="Title"
					type="text"
					isRequired={true}
					value={this.state.title}
					onChange={this.handleTitleChange}
				/>
				<InputField
					label="Domain"
					type="text"
					isRequired={true}
					value={this.state.subdomain}
					onChange={this.handleSubdomainChange}
				/>
				<InputField
					label="Description"
					type="text"
					isTextarea={true}
					value={this.state.description}
					onChange={this.handleDescriptionChange}
				/>
				<div className="images-wrapper">
					<ImageUpload
						htmlFor="favicon-upload"
						label={
							<span>
								Favicon
								<Tooltip
									content={<span>Used for browser icons. Must be square.<br />Recommended: 50*50px</span>}
									tooltipClassName="pt-dark"
								>
									<span className="pt-icon-standard pt-icon-info-sign" />
								</Tooltip>
							</span>
						}
						defaultImage={this.state.favicon}
						onNewImage={this.handleFaviconChange}
					/>
					<ImageUpload
						htmlFor="avatar-upload"
						label={
							<span>
								Preview
								<Tooltip
									content={<span>Used as default preview image for social sharing cards.<br />Recommended: 500*500px</span>}
									tooltipClassName="pt-dark"
								>
									<span className="pt-icon-standard pt-icon-info-sign" />
								</Tooltip>
							</span>
						}
						defaultImage={this.state.avatar}
						onNewImage={this.handleAvatarChange}
					/>
				</div>
				<div className="images-wrapper">
					<ImageUpload
						htmlFor="small-header-logo-upload"
						label={
							<span>
								Header Logo
								<Tooltip
									content={<span>Used in the header bar.<br />Recommended: ~40*150px</span>}
									tooltipClassName="pt-dark"
								>
									<span className="pt-icon-standard pt-icon-info-sign" />
								</Tooltip>
							</span>
						}
						defaultImage={this.state.smallHeaderLogo}
						height={80}
						width={150}
						onNewImage={this.handleSmallHeaderLogoChange}
						useAccentBackground={true}
					/>
					<ImageUpload
						htmlFor="large-header-logo-upload"
						label={
							<span>
								Landing Logo
								<Tooltip
									content={<span>Used on the landing page.<br />Recommended: ~200*750px</span>}
									tooltipClassName="pt-dark"
								>
									<span className="pt-icon-standard pt-icon-info-sign" />
								</Tooltip>
							</span>
						}
						defaultImage={this.state.largeHeaderLogo}
						height={80}
						width={150}
						onNewImage={this.handleLargeHeaderLogoChange}
						useAccentBackground={true}
					/>
					<ImageUpload
						htmlFor="large-header-background-upload"
						label={
							<span>
								Landing Background
								<Tooltip
									content={<span>Used on the landing page.<br />Recommended: ~1200*800px</span>}
									tooltipClassName="pt-dark"
								>
									<span className="pt-icon-standard pt-icon-info-sign" />
								</Tooltip>
							</span>
						}
						defaultImage={this.state.largeHeaderBackground}
						onNewImage={this.handleLargeHeaderBackgroundChange}
						height={80}
						width={150}
						canClear={true}
					/>
				</div>
				<InputField
					label="Website"
					type="text"
					value={this.state.website}
					onChange={this.handleWebsiteChange}
				/>
				<InputField
					label="Twitter"
					type="text"
					value={this.state.twitter}
					helperText={`https://twitter.com/${this.state.twitter}`}
					onChange={this.handleTwitterChange}
				/>
				<InputField
					label="Facebook"
					type="text"
					value={this.state.facebook}
					helperText={`https://facebook.com/${this.state.facebook}`}
					onChange={this.handleFacebookChange}
				/>
				<InputField
					label="Contact Email"
					type="text"
					value={this.state.email}
					onChange={this.handleEmailChange}
				/>
				<InputField
					label="Accent Color"
					type="text"
					value={this.state.accentColor}
					helperText="e.g. #FF9944"
					onChange={this.handleAccentColorChange}
				/>
				<InputField label="Navigation">
					<NavDrag
						initialNav={initialNav}
						collections={collections}
						onChange={this.handleNavigationChange}
					/>
				</InputField>
				<InputField error={this.props.error}>
					<Button
						name="create"
						type="submit"
						className="pt-button pt-intent-primary save-community-button"
						onClick={this.handleSaveClick}
						text="Save Site Details"
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
