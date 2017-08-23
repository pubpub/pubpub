import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import InputField from 'components/InputField/InputField';

require('./dashboardCollectionEdit.scss');

const propTypes = {
	collectionData: PropTypes.object.isRequired,
};

class DashboardCollectionEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: props.collectionData.title,
			description: props.collectionData.description,
			slug: props.collectionData.slug,
			isPrivate: props.collectionData.isPrivate,
			isOpenSubmissions: props.collectionData.isOpenSubmissions,
		};
		this.changeTitle = this.changeTitle.bind(this);
		this.changeDescription = this.changeDescription.bind(this);
		this.changeSlug = this.changeSlug.bind(this);
		this.setPublic = this.setPublic.bind(this);
		this.setPrivate = this.setPrivate.bind(this);
		this.setOpen = this.setOpen.bind(this);
		this.setClosed = this.setClosed.bind(this);
	}

	changeTitle(evt) {
		this.setState({ title: evt.target.value });
	}

	changeDescription(evt) {
		this.setState({ description: evt.target.value });
	}

	changeSlug(evt) {
		this.setState({ slug: evt.target.value });
	}
	setPublic() {
		this.setState({ isPrivate: false });
	}
	setPrivate() {
		this.setState({ isPrivate: true });
	}
	setOpen() {
		this.setState({ isOpenSubmissions: true });
	}
	setClosed() {
		this.setState({ isOpenSubmissions: false });
	}

	render() {
		const data = this.props.collectionData;
		const pubs = data.pubs || [];

		return (
			<div className={'dashboard-collection-edit'}>
				<div className={'content-buttons'}>
					<Link to={`/dashboard/${data.slug}`} className={'pt-button'}>Cancel</Link>
					<button type={'button'} className={'pt-button pt-intent-primary'}>Save Changes</button>
				</div>

				<InputField
					label={'Title'}
					placeholder={'Enter title'}
					isRequired={true}
					value={this.state.title}
					onChange={this.changeTitle}
					error={undefined}
				/>
				<InputField
					label={'Description'}
					placeholder={'Enter description'}
					helperText={'Used for search engines. Max 180 characters'}
					value={this.state.description}
					onChange={this.changeDescription}
					error={undefined}
				/>
				<InputField
					label={'Link'}
					placeholder={'Enter link'}
					value={this.state.slug}
					onChange={this.changeSlug}
					error={undefined}
				/>

				<InputField label={'Privacy'}>
					<div className="pt-button-group">
						<button type="button" className={`pt-button pt-icon-globe ${!this.state.isPrivate ? 'pt-active' : ''}`} onClick={this.setPublic}>Public</button>
						<button type="button" className={`pt-button pt-icon-lock ${this.state.isPrivate ? 'pt-active' : ''}`} onClick={this.setPrivate}>Private</button>
					</div>
				</InputField>

				<InputField label={'Submissions'}>
					<div className="pt-button-group">
						<button type="button" className={`pt-button pt-icon-add-to-artifact ${this.state.isOpenSubmissions ? 'pt-active' : ''}`} onClick={this.setOpen}>Open</button>
						<button type="button" className={`pt-button pt-icon-delete ${!this.state.isOpenSubmissions ? 'pt-active' : ''}`} onClick={this.setClosed}>Closed</button>
					</div>
				</InputField>

				<InputField label={'Layout'}>
					<div></div>
				</InputField>

			</div>
		);
	}
};


DashboardCollectionEdit.propTypes = propTypes;
export default DashboardCollectionEdit;
