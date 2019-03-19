import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { apiFetch } from 'utilities';
import { Spinner } from '@blueprintjs/core';

import attributionType from 'types/attribution';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';

import AttributionRow from './AttributionRow';
import DragDropListing from '../DragDropListing/DragDropListing';

require('./attributionEditor.scss');

const propTypes = {
	apiRoute: PropTypes.string.isRequired,
	canEdit: PropTypes.bool.isRequired,
	attributions: PropTypes.arrayOf(attributionType).isRequired,
	identifyingProps: PropTypes.shape({}).isRequired,
	onUpdateAttributions: PropTypes.func.isRequired,
};

const addFallbackUser = (attribution) => {
	if (attribution.user) {
		return attribution;
	}
	return {
		...attribution,
		user: {
			id: attribution.id,
			initials: attribution.name[0],
			fullName: attribution.name,
			firstName: attribution.name.split(' ')[0],
			lastName: attribution.name
				.split(' ')
				.slice(1, attribution.name.split(' ').length)
				.join(' '),
			avatar: attribution.avatar,
			title: attribution.title,
		},
	};
};

class AttributionEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		};
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.handleAttributionAdd = this.handleAttributionAdd.bind(this);
		this.handleAttributionUpdate = this.handleAttributionUpdate.bind(this);
		this.handleAttributionDelete = this.handleAttributionDelete.bind(this);
	}

	persistAttribution(data, method) {
		const { apiRoute, identifyingProps } = this.props;
		return apiFetch(apiRoute, {
			method: method,
			body: JSON.stringify({
				...data,
				...identifyingProps,
			}),
		});
	}

	handleAttributionAdd(user) {
		const { attributions, onUpdateAttributions } = this.props;
		const calculatedOrder =
			attributions.length === 0
				? 0.5
				: attributions.sort((a, b) => {
						const sortOnOrder = a.order - b.order;
						if (sortOnOrder !== 0) {
							return sortOnOrder;
						}
						return b.createdAt - a.createdAt;
				  })[0].order / 2;
		this.persistAttribution(
			{
				userId: user.id,
				name: user.name,
				order: calculatedOrder,
			},
			'POST',
		).then((result) => {
			const { attributions: attributionsNow } = this.props;
			onUpdateAttributions([...attributionsNow, result]);
		});
	}

	handleAttributionUpdate(updatedAttribution) {
		const { attributions, onUpdateAttributions } = this.props;
		const newAttributions = attributions.map((attribution) => {
			if (attribution.id !== updatedAttribution.id) {
				return attribution;
			}
			return {
				...attribution,
				...updatedAttribution,
			};
		});
		onUpdateAttributions(newAttributions);
		this.setState({ isLoading: true }, () =>
			this.persistAttribution(updatedAttribution, 'PUT').then(() =>
				this.setState({ isLoading: false }),
			),
		);
	}

	handleAttributionDelete(attributionId) {
		const { attributions, onUpdateAttributions } = this.props;
		onUpdateAttributions(
			attributions.filter((attribution) => attribution.id !== attributionId),
		);
		this.setState({ isLoading: true }, () =>
			this.persistAttribution({ attributionId: attributionId }, 'DELETE').then(() =>
				this.setState({ isLoading: false }),
			),
		);
	}

	handleDragEnd(result) {
		const { attributions, identifyingProps, onUpdateAttributions } = this.props;

		if (!result.destination) {
			return;
		}

		const sourceIndex = result.source.index;
		const sourceId = attributions[sourceIndex].id;
		const destIndex = result.destination.index;
		const destinationOrder = attributions[destIndex].order;
		const direction = sourceIndex > destIndex ? -1 : 1;
		let newOrder = 0.5;

		if (sourceIndex === destIndex) {
			newOrder = attributions[sourceIndex].order;
		} else if (result.destination.index === 0) {
			newOrder = destinationOrder / 2;
		} else if (result.destination.index === attributions.length - 1) {
			newOrder = (1 + destinationOrder) / 2;
		} else {
			const destinationNeighborOrder = attributions[destIndex + direction].order;
			newOrder = (destinationOrder + destinationNeighborOrder) / 2;
		}

		this.handleAttributionUpdate({
			...identifyingProps,
			id: sourceId,
			order: newOrder,
		});

		const newAttributions = attributions.map((attribution) => {
			if (attribution.id !== sourceId) {
				return attribution;
			}
			return {
				...attribution,
				order: newOrder,
			};
		});

		onUpdateAttributions(newAttributions);
	}

	render() {
		const { attributions, canEdit } = this.props;
		const { isLoading } = this.state;
		const sortedAttributions = attributions.sort((a, b) => a.order - b.order);
		return (
			<div className="attribution-editor-component">
				{isLoading && (
					<div className="save-wrapper">
						<Spinner small={true} /> Saving...
					</div>
				)}
				{canEdit && (
					<UserAutocomplete
						onSelect={this.handleAttributionAdd}
						allowCustomUser={true}
						placeholder="Add new person..."
						usedUserIds={attributions
							.map((item) => {
								return item.user && item.user.id;
							})
							.filter((x) => x)}
					/>
				)}
				<DragDropContext onDragEnd={this.handleDragEnd}>
					<DragDropListing
						droppableType="ATTRIBUTION"
						droppableId="attributionEditor"
						items={sortedAttributions}
						itemId={(attribution) => attribution.id}
						withDragHandles={true}
						renderItem={(attribution, dragHandleProps, isDragging) => (
							<AttributionRow
								attribution={addFallbackUser(attribution)}
								canEdit={canEdit}
								isDragging={isDragging}
								dragHandleProps={dragHandleProps}
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

AttributionEditor.propTypes = propTypes;
export default AttributionEditor;
