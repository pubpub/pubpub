import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubPreview from 'components/PubPreview/PubPreview';

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
			pubIds: newPubIds.filter((item)=> { return item; }),
		});
	}
	render() {
		const size = this.props.content.size;
		const displayLimit = this.props.content.limit || Math.max(4, this.props.pubRenderList.length);
		const emptyPreviews = [];
		for (let index = 0; index < displayLimit; index += 1) {
			emptyPreviews.push(null);
		}
		const previews = [...this.props.content.pubIds, ...emptyPreviews].slice(0, displayLimit);
		const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		return (
			<div className="layout-editor-pubs-component">
				<div className="block-header">
					<div className="pt-form-group">
						<label htmlFor={`section-title-${this.props.layoutIndex}`}>Pubs Section Title</label>
						<input id={`section-title-${this.props.layoutIndex}`} type="text" className="pt-input" value={this.props.content.title} onChange={this.changeTitle} />
					</div>
					<div className="spacer" />
					<div className="pt-form-group">
						<label htmlFor={`section-size-${this.props.layoutIndex}`}>Size</label>
						<div className="pt-button-group">
							<button className={`pt-button ${size === 'large' ? 'pt-active' : ''}`} onClick={this.setLarge}>Large</button>
							<button className={`pt-button ${size === 'medium' ? 'pt-active' : ''}`} onClick={this.setMedium}>Medium</button>
							<button className={`pt-button ${size === 'small' ? 'pt-active' : ''}`} onClick={this.setSmall}>Small</button>
						</div>
					</div>
					<div className="pt-form-group">
						<label htmlFor={`section-limit-${this.props.layoutIndex}`}>Limit</label>
						<div className="pt-button-group pt-select">
							<select value={this.props.content.limit} onChange={this.setLimit}>
								<option value={0}>Show All pubs</option>
								{selectOptions.map((item)=> {
									return <option value={item} key={`option-${item}`}>Show {item} pub{item === 1 ? '' : 's'}</option>
								})}
							</select>
						</div>
					</div>
					<div className="pt-form-group">
						<div className="pt-button-group">
							<button className="pt-button pt-icon-trash" onClick={this.handleRemove} />
						</div>
					</div>
				</div>

				<div className="block-content">
					<div className="container">
						{this.props.content.title &&
							<div className="row">
								<div className="col-12">
									<h3>{this.props.content.title}</h3>
								</div>
							</div>
						}

						<div className="row">
							{previews.map((item, index)=> {
								const selectPub = (this.props.pubRenderList && this.props.pubRenderList[index]) || {};
								return (
									<div key={`preview-${this.props.layoutIndex}-${index}`} className={size === 'medium' ? 'col-6' : 'col-12'}>
										<PubPreview
											size={size}
											isPlaceholder={true}
											title={this.props.content.pubIds[index] ? selectPub.title : undefined}
											inputContent={this.props.content.pubIds.length >= index
												? <div className="pt-select">
													<select value={this.props.content.pubIds[index] || ''} onChange={(evt)=> { this.changePubId(index, evt.target.value); }}>
														<option value="">Choose specific Pub</option>
														{this.props.pubs.filter((pub)=> {
															return pub.firstPublishedAt;
														}).sort((foo, bar)=> {
															if (foo.title < bar.title) { return -1; }
															if (foo.title > bar.title) { return 1; }
															return 0;
														}).map((pub)=> {
															return <option value={pub.id} key={`option-${pub.id}`}>{pub.title}</option>;
														})}
													</select>
												</div>
												: null
											}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

LayoutEditorPubs.propTypes = propTypes;
export default LayoutEditorPubs;
