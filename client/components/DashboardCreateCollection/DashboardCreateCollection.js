import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import InputField from 'components/InputField/InputField';

if (typeof require.ensure === 'function') {
	require('./dashboardCreateCollection.scss');
}

const propTypes = {
	isPage: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool,
	error: PropTypes.string,
	onCreate: PropTypes.func,
	updatePath: PropTypes.func,
	localUrl: PropTypes.string.required,
};
const defaultProps = {
	isLoading: false,
	error: undefined,
	onCreate: ()=>{},
	updatePath: ()=>{},
};

class DashboardCreateCollection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			slug: '',
			description: '',
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleSlugChange = this.handleSlugChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			nextProps.updatePath(`/dashboard/${this.state.slug}`);
		}
	}
	handleTitleChange(evt) {
		this.setState({ title: evt.target.value });
	}
	handleSlugChange(evt) {
		this.setState({
			slug: evt.target.value.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase()
		});
	}
	handleDescriptionChange(evt) {
		this.setState({
			description: evt.target.value.substring(0, 280).replace(/\n/g, ' ')
		});
	}
	handleCreateSubmit(evt) {
		evt.preventDefault();
		this.props.onCreate({
			title: this.state.title,
			slug: this.state.slug,
			description: this.state.description,
			isPage: this.props.isPage,
		});
	}

	render() {
		const itemString = this.props.isPage ? 'Page' : 'Collection';
		return (
			<div className="dashboard-create-collection-component">
				<h1 className="content-title">Create New {itemString}</h1>

				<form onSubmit={this.handleCreateSubmit}>
					<InputField
						label={`${itemString} Title`}
						placeholder={`Brand New ${itemString}`}
						isRequired={true}
						value={this.state.title}
						onChange={this.handleTitleChange}
					/>
					<InputField
						label={`${itemString} URL`}
						placeholder={`my-${itemString.toLowerCase()}`}
						isRequired={true}
						helperText={`${this.props.localUrl}/${this.state.slug}`}
						value={this.state.slug}
						onChange={this.handleSlugChange}
					/>
					<InputField
						label="Description"
						isTextarea={true}
						value={this.state.description}
						onChange={this.handleDescriptionChange}
					/>
					<InputField error={this.props.error && `Error Creating ${itemString}`}>
						<Button
							name="login"
							type="submit"
							className="pt-button pt-intent-primary"
							onClick={this.handleCreateSubmit}
							text={`Create ${itemString}`}
							disabled={!this.state.title || !this.state.slug}
							loading={this.props.isLoading}
						/>
					</InputField>
				</form>
			</div>
		);
	}
}

DashboardCreateCollection.propTypes = propTypes;
DashboardCreateCollection.defaultProps = defaultProps;
export default DashboardCreateCollection;
