import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./layoutEditorHeader.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* text, align, background, backgroundSize */
};

class LayoutEditorHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: new Date().getTime(),
		};
		this.handleRemove = this.handleRemove.bind(this);
		this.setAlign = this.setAlign.bind(this);
		this.setBackgroundSize = this.setBackgroundSize.bind(this);
		this.setText = this.setText.bind(this);
	}

	setAlign(alignValue) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			align: alignValue, /* left or center */
		});
	}

	setBackgroundSize(backgroundSizeValue) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			backgroundSize: backgroundSizeValue /* full or standard */
		});
	}

	setText(evt) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			text: evt.target.value,
		});
	}

	handleRemove() {
		this.props.onRemove(this.props.layoutIndex);
	}

	render() {
		const textStyle = {
			textAlign: this.props.content.align || 'left',
			color: 'white',
			fontSize: '40px',
			lineHeight: '1em',
		};
		const backgroundStyle = {
			background: '#03a9f4',
			minHeight: '200px',
			display: 'flex',
			alignItems: 'center',
		};
		return (
			<div className="layout-editor-header-component">
				<div className="block-header">
					<div className="pt-form-group">
						<label htmlFor={`section-title-${this.props.layoutIndex}`}>
							Text
						</label>
						<input
							id={`section-title-${this.props.layoutIndex}`}
							type="text"
							className="pt-input"
							value={this.props.content.text}
							onChange={this.setText}
						/>
					</div>
					<div className="spacer" />
					<div className="pt-form-group">
						<label htmlFor={`section-size-${this.props.layoutIndex}`}>
							Align
						</label>
						<div className="pt-button-group">
							<button
								type="button"
								className={`pt-button ${this.props.content.align === 'left' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setAlign('left');
								}}
							>
								Left
							</button>
							<button
								type="button"
								className={`pt-button ${this.props.content.align === 'center' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setAlign('center');
								}}
							>
								Center
							</button>
						</div>
					</div>
					<div className="pt-form-group">
						<label htmlFor={`section-limit-${this.props.layoutIndex}`}>
							Background Size
						</label>
						<div className="pt-button-group">
							<button
								type="button"
								className={`pt-button ${this.props.content.backgroundSize === 'full' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setBackgroundSize('full');
								}}
							>
								Full
							</button>
							<button
								type="button"
								className={`pt-button ${this.props.content.backgroundSize === 'standard' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setBackgroundSize('standard');
								}}
							>
								Standard
							</button>
						</div>
					</div>
					<div className="pt-form-group">
						<div className="pt-button-group">
							<button
								type="button"
								className="pt-button pt-icon-trash"
								onClick={this.handleRemove}
							/>
						</div>
					</div>
				</div>

				<div className="block-content" style={this.props.content.backgroundSize === 'full' ? backgroundStyle : undefined}>
					<div className="container">
						<div className="row" style={this.props.content.backgroundSize === 'standard' ? backgroundStyle : undefined}>
							<div className="col-12">
								<h2 style={textStyle}>
									{this.props.content.text}
								</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

LayoutEditorHeader.propTypes = propTypes;
export default LayoutEditorHeader;
