import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';
import ImageUpload from 'components/ImageUpload/ImageUpload';
import NavDrag from 'components/NavDrag/NavDrag';
import { populateNavigationIds } from 'utilities';

require('./dashboardTeam.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	onAddAdmin: PropTypes.func,
	onRemoveAdmin: PropTypes.func,
};
const defaultProps = {
	onAddAdmin: ()=>{},
	onRemoveAdmin: ()=>{},
};

class DashboardTeam extends Component {
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
				<h1 className={'content-title'}>Team</h1>
				
			</div>
		);
	}
}

DashboardTeam.propTypes = propTypes;
DashboardTeam.defaultProps = defaultProps;
export default DashboardTeam;
