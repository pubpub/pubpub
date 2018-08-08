import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { apiFetch } from 'utilities';

require('./layoutCreatePub.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* text, align, size, defaultTags */
};

class LayoutCreatePub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		};
		this.createPub = this.createPub.bind(this);
	}

	createPub() {
		this.setState({ isLoading: true });
		return apiFetch('/api/pubs', {
			method: 'POST',
			body: JSON.stringify({
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			window.location.href = result;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ isLoading: false });
		});
	}

	render() {
		const wrapperStyle = {
			float: this.props.content.align !== 'center'
				? this.props.content.align
				: 'none',
			textAlign: 'center',
		};

		const button = this.props.loginData.id
			? <Button
				className={this.props.content.size === 'large' ? 'pt-large' : ''}
				loading={this.state.isLoading}
				onClick={this.createPub}
				text={this.props.content.text || 'Create Pub'}
			/>
			: <a
				href={`/login?redirect=${this.props.locationData.path}`}
				className="pt-button pt-intent-primary"
			>
				Login to Create Pub
			</a>;
		// const button = (
		// 	<button
		// 		type="button"
		// 		className={`pt-button ${this.props.content.size === 'large' ? 'pt-large' : ''}`}
		// 		onClick={this.createPub}
		// 	>
		// 		{this.props.content.text || 'Create Pub'}
		// 	</button>
		// );
		return (
			<div className="layout-create-pub-component" style={wrapperStyle}>
				<div className="block-content">
					{this.props.content.align !== 'center' && button}

					{this.props.content.align === 'center' &&
						<div className="container">
							<div className="row">
								<div className="col-12">
									{button}
								</div>
							</div>
						</div>
					}
				</div>
			</div>
		);
	}
};

LayoutCreatePub.propTypes = propTypes;
export default LayoutCreatePub;
