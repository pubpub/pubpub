import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { apiFetch } from 'utilities';
import { Spinner } from '@blueprintjs/core';

import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';

import AttributionRow from '../AttributionEditor/AttributionRow';
import DragDropListing from '../DragDropListing/DragDropListing';

require('./pubOptionsAttribution.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsAttribution extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/* We store pubData in state of this component so we can do immediate */
			/* updates and save in the background without jumpy effects */
			pubData: this.props.pubData,
			isLoading: false,
		};
		this.onDragEnd = this.onDragEnd.bind(this);
		this.handleAttributionAdd = this.handleAttributionAdd.bind(this);
		this.handleAttributionUpdate = this.handleAttributionUpdate.bind(this);
		this.handleAttributionDelete = this.handleAttributionDelete.bind(this);
	}

	onDragEnd(result) {
		const pubData = this.state.pubData;

		if (!result.destination) {
			return null;
		}
		const sourceIndex = result.source.index;
		const sourceId = pubData.attributions[sourceIndex].id;
		const destIndex = result.destination.index;
		const destinationOrder = pubData.attributions[destIndex].order;
		const direction = sourceIndex > destIndex ? -1 : 1;
		let newOrder = 0.5;
		if (sourceIndex === destIndex) {
			newOrder = pubData.attributions[sourceIndex].order;
		} else if (result.destination.index === 0) {
			newOrder = destinationOrder / 2;
		} else if (result.destination.index === pubData.attributions.length - 1) {
			newOrder = (1 + destinationOrder) / 2;
		} else {
			const destinationNeighborOrder = pubData.attributions[destIndex + direction].order;
			newOrder = (destinationOrder + destinationNeighborOrder) / 2;
		}

		// const newCollaborators = pubData.attributions;
		// newCollaborators[sourceIndex].order = newOrder;

		this.handleAttributionUpdate({
			pubAttributionId: sourceId,
			order: newOrder,
			pubId: pubData.id,
			communityId: this.props.communityData.id,
		});

		const newPubData = {
			...pubData,
			attributions: pubData.attributions.map((attribution) => {
				if (attribution.id !== sourceId) {
					return attribution;
				}
				return {
					...attribution,
					order: newOrder,
				};
			}),
		};

		this.setState({ pubData: newPubData });
		return this.props.setPubData(newPubData);
	}

	handleAttributionAdd(user) {
		const calculatedOrder = !this.state.pubData.attributions.length
			? 0.5
			: this.state.pubData.attributions.sort((foo, bar) => {
					if (foo.order < bar.order) {
						return -1;
					}
					if (foo.order > bar.order) {
						return 1;
					}
					if (foo.createdAt < bar.createdAt) {
						return 1;
					}
					if (foo.createdAt > bar.createdAt) {
						return -1;
					}
					return 0;
			  })[0].order / 2;

		return apiFetch('/api/pubAttributions', {
			method: 'POST',
			body: JSON.stringify({
				userId: user.id,
				name: user.name,
				order: calculatedOrder,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			}),
		}).then((result) => {
			this.setState((prevState) => {
				const newPubData = {
					...prevState.pubData,
					attributions: [...prevState.pubData.attributions, result],
				};
				this.props.setPubData(newPubData);
				return { pubData: newPubData };
			});
		});
	}

	handleAttributionUpdate(updatedAttribution) {
		this.setState(
			(prevState) => {
				const newPubData = {
					...prevState.pubData,
					attributions: prevState.pubData.attributions.map((attribution) => {
						if (attribution.id !== updatedAttribution.pubAttributionId) {
							return attribution;
						}
						return {
							...attribution,
							...updatedAttribution,
						};
					}),
				};
				return { pubData: newPubData, isLoading: true };
			},
			() => {
				apiFetch('/api/pubAttributions', {
					method: 'PUT',
					body: JSON.stringify({
						...updatedAttribution,
						pubId: this.state.pubData.id,
						communityId: this.props.communityData.id,
					}),
				}).then(() => {
					this.props.setPubData(this.state.pubData);
					this.setState({ isLoading: false });
				});
			},
		);
	}

	handleAttributionDelete(pubAttributionId) {
		this.setState(
			(prevState) => {
				const newPubData = {
					...prevState.pubData,
					attributions: prevState.pubData.attributions.filter((attribution) => {
						return attribution.id !== pubAttributionId;
					}),
				};
				return { pubData: newPubData, isLoading: true };
			},
			() => {
				apiFetch('/api/pubAttributions', {
					method: 'DELETE',
					body: JSON.stringify({
						pubAttributionId: pubAttributionId,
						pubId: this.state.pubData.id,
						communityId: this.props.communityData.id,
					}),
				}).then(() => {
					this.props.setPubData(this.state.pubData);
					this.setState({ isLoading: false });
				});
			},
		);
	}

	render() {
		const {
			pubData: { isManager, attributions },
		} = this.state;
		const sortedAttributions = attributions.sort((foo, bar) => {
			if (foo.order < bar.order) {
				return -1;
			}
			if (foo.order > bar.order) {
				return 1;
			}
			return 0;
		});
		return (
			<div className="pub-options-attribution-component">
				{this.state.isLoading && (
					<div className="save-wrapper">
						<Spinner small={true} /> Saving...
					</div>
				)}
				<h1>Attribution</h1>
				{isManager && (
					<UserAutocomplete
						onSelect={this.handleAttributionAdd}
						allowCustomUser={true}
						placeholder="Add new person..."
						usedUserIds={attributions.map((item) => {
							return item.user.id;
						})}
					/>
				)}
				<DragDropContext onDragEnd={this.onDragEnd}>
					<DragDropListing
						droppableType="ATTRIBUTION"
						droppableId="pubOptionsAttribution"
						items={sortedAttributions}
						itemId={(attribution) => attribution.id}
						withDragHandles={true}
						renderItem={(attribution, dragHandleProps) => (
							<AttributionRow
								canManage={isManager}
								dragHandleProps={dragHandleProps}
								attribution={attribution}
								onAttributionDelete={this.handleAttributionDelete}
								onAttributionUpdate={this.handleAttributionUpdate}
							/>
						)}
					/>
				</DragDropContext>
			</div>
		);
	}
}

PubOptionsAttribution.propTypes = propTypes;
export default PubOptionsAttribution;
