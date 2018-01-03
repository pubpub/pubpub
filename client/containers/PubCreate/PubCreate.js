import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, apiFetch } from 'utilities';

require('./pubCreate.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class PubCreate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			postPubIsLoading: false,
		};
		this.handleCreatePub = this.handleCreatePub.bind(this);
	}

	handleCreatePub(collectionId) {
		this.setState({ postPubIsLoading: collectionId });
		return apiFetch('/api/pubs', {
			method: 'POST',
			body: JSON.stringify({
				collectionId: collectionId,
				communityId: this.props.communityData.id,
				createPubHash: undefined,
			})
		})
		.then((result)=> {
			window.location.href = result;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ postPubIsLoading: false });
		});
	}
	render() {
		const collections = this.props.communityData.collections.filter((item)=> {
			const isOpen = item.isOpenSubmissions && item.isPublic;
			const isAdmin = this.props.loginData.isAdmin;
			return !item.isPage && (isOpen || isAdmin);
		});
		return (
			<div id="pub-create-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					hideNav={true}
				>
					{!this.props.loginData.id &&
						<div className="non-ideal-wrapper">
							<NonIdealState
								title="Not Logged In"
								visual="pt-icon-issue"
								description="You must be logged in to create a Pub."
								action={<a href="/login?redirect=/pub/create" className="pt-button">Login</a>}
							/>
						</div>
					}
					{!collections.length &&
						<div className="non-ideal-wrapper">
							<NonIdealState
								title="No Open Collections"
								visual="pt-icon-issue"
								description="This community does not have any Collections with open submissions at the moment."
							/>
						</div>
					}

					{this.props.loginData.id && collections.length &&
						<div className="container small">
							<div className="row">
								<div className="col-12">
									<h1>Create Pub</h1>
									<p>Select a Collection to create your Pub in.</p>
								</div>
								{collections.map((item)=> {
									return (
										<div key={item.id} className="col-12">
											<Button
												className="pt-fill pt-large"
												text={item.title}
												iconName={!item.isPublic ? 'lock2' : ''}
												loading={this.state.postPubIsLoading === item.id}
												onClick={()=> { this.handleCreatePub(item.id); }}
											/>
										</div>
									);
								})}
							</div>
						</div>
					}
				</PageWrapper>
			</div>
		);
	}
}

PubCreate.propTypes = propTypes;
export default PubCreate;

hydrateWrapper(PubCreate);
