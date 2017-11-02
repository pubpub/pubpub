import React, { Component } from 'react';
import PropTypes from 'prop-types';

// require('./layoutEditorPubs.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
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
		this.changeTitle = this.changeTitle.bind(this);
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
	changeTitle(evt) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			title: evt.target.value,
		});
	}
	render() {
		const size = this.props.content.size;
		return (
			<div className={'layout-editor-pubs'}>
				<div className={'header'}>
					<input type={'text'} className={`pt-input`} value={this.props.content.title} onChange={this.changeTitle} />
					<div className={'pt-button-group'}>
						<button className={`pt-button ${size === 'small' ? 'pt-active' : ''}`} onClick={this.setSmall}>Small</button>
						<button className={`pt-button ${size === 'medium' ? 'pt-active' : ''}`} onClick={this.setMeidum}>Medium</button>
						<button className={`pt-button ${size === 'large' ? 'pt-active' : ''}`} onClick={this.setLarge}>Large</button>
					</div>
					<button className={`pt-button pt-icon-trash`} onClick={this.handleRemove} />
				</div>
				<div>Preview of things go here. Need interface to enable setting content.pubIds</div>
			</div>
		);	
	}
}

LayoutEditorPubs.propTypes = propTypes;
export default LayoutEditorPubs;
