import React, { Component } from 'react';
import PropTypes from 'prop-types';

// require('./layoutEditorPubs.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
};

class LayoutEditorPubs extends Component {
	constructor(props) {
		super(props);
		this.setSmall = this.setSmall.bind(this);
		this.setLarge = this.setLarge.bind(this);
	}
	setSmall() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			size: 'small'
		});
	}
	setLarge() {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			size: 'large'
		});
	}
	render() {
		const size = this.props.content.size;
		return (
			<div className={'layout-editor-pubs'}>
				<div className={'header'}>
					<div className={'pt-button-group'}>
						<div className={`pt-button ${size === 'small' ? 'pt-active' : ''}`} onClick={this.setSmall}>Small</div>
						<div className={`pt-button ${size === 'large' ? 'pt-active' : ''}`} onClick={this.setLarge}>Large</div>
					</div>
					<div className={'pt-button-group'}>
						<div className={`pt-button ${size === 'small' ? 'pt-active' : ''}`} onClick={this.setSmall}>Small</div>
						<div className={`pt-button ${size === 'large' ? 'pt-active' : ''}`} onClick={this.setLarge}>Large</div>
					</div>
				</div>
			</div>
		);	
	}
}

LayoutEditorPubs.propTypes = propTypes;
export default LayoutEditorPubs;
