import React, { Component } from 'react';
import PropTypes from 'prop-types';

// require('./layoutEditorPubs.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	pubs: PropTypes.array.isRequired,
	pubRenderList: PropTypes.array.isRequired,
	/* Expected content */
	/* title, size, limit, pubIds */
};

class LayoutEditorPubs extends Component {
	constructor(props) {
		super(props);
		this.handleRemove = this.handleRemove.bind(this);
		this.setSmall = this.setSmall.bind(this);
		this.setMedium = this.setMedium.bind(this);
		this.setLarge = this.setLarge.bind(this);
		this.setLimit = this.setLimit.bind(this);
		// this.decreaseLimit = this.decreaseLimit.bind(this);
		// this.increaseLimit = this.increaseLimit.bind(this);
		this.changeTitle = this.changeTitle.bind(this);
		this.changePubId = this.changePubId.bind(this);
	}
	handleRemove() {
		this.props.onRemove(this.props.layoutIndex);
	}
	setSmall() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			size: 'small'
		});
	}
	setMedium() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			size: 'medium'
		});
	}
	setLarge() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			size: 'large'
		});
	}
	setLimit(evt) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			limit: Number(evt.target.value)
		});
	}
	// decreaseLimit() {
	// 	this.props.onChange(this.props.layoutIndex, {
	// 		...this.props.content,
	// 		limit: Math.max(this.props.content.limit - 1, 0)
	// 	});
	// }
	// increaseLimit() {
	// 	this.props.onChange(this.props.layoutIndex, {
	// 		...this.props.content,
	// 		limit: this.props.content.limit + 1
	// 	});
	// }
	changeTitle(evt) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			title: evt.target.value,
		});
	}
	changePubId(index, string) {
		const newPubIds = this.props.content.pubIds;
		newPubIds[index] = string;
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			pubIds: newPubIds,
		});
	}
	render() {
		const size = this.props.content.size;
		const displayLimit = this.props.content.limit || Math.max(4, this.props.pubRenderList.length);
		const emptyPreviews = [];
		for (let index = 0; index < displayLimit; index++) {
			emptyPreviews.push(null);
		}
		const previews = [...this.props.content.pubIds, ...emptyPreviews].slice(0, displayLimit);
		const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		console.log('Render List', this.props.pubRenderList);
		/* Need to make pubpreview that can take title, can take input field */
		/* Update pubpreview to have 3 sizes, and to be new design */
		return (
			<div className={'layout-editor-pubs'}>
				<div className={'block-header'}>
					<input type={'text'} className={`pt-input`} value={this.props.content.title} onChange={this.changeTitle} />
					<div className={'spacer'} />
					<div className={'pt-button-group'}>
						<button className={`pt-button ${size === 'small' ? 'pt-active' : ''}`} onClick={this.setSmall}>Small</button>
						<button className={`pt-button ${size === 'medium' ? 'pt-active' : ''}`} onClick={this.setMedium}>Medium</button>
						<button className={`pt-button ${size === 'large' ? 'pt-active' : ''}`} onClick={this.setLarge}>Large</button>
					</div>
					<div className={'pt-button-group pt-select'}>
						<select value={this.props.content.limit} onChange={this.setLimit}>
							<option value={0}>Show All pubs</option>
							{selectOptions.map((item)=> {
								return <option value={item} key={`option-${item}`}>Show {item} pub{item === 1 ? '' : 's'}</option>
							})}

							
						</select>
					</div>
					<div className={'pt-button-group'}>
						<button className={`pt-button pt-icon-trash`} onClick={this.handleRemove} />
					</div>
				</div>

				<div className={'block-content'}>
					<div>Preview of things go here. Need interface to enable setting content.pubIds</div>
					{previews.map((item, index)=> {
						return (
							<div>
								Preview
								{this.props.content.pubIds.length >= index &&
									<input className={'pt-input'} onChange={(evt)=> { this.changePubId(index, evt.target.value); }} value={this.props.content.pubIds[index] || ''} />
								}
							</div>
						);
					})}
				</div>
			</div>
		);	
	}
}

LayoutEditorPubs.propTypes = propTypes;
export default LayoutEditorPubs;
