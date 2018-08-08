import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./layoutEditorCreatePub.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* text, align, size, defaultTags */
};

class LayoutEditorCreatePub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			key: new Date().getTime(),
		};
		this.handleRemove = this.handleRemove.bind(this);
		this.setText = this.setText.bind(this);
		this.setAlign = this.setAlign.bind(this);
		this.setSize = this.setSize.bind(this);
	}

	setAlign(alignValue) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			align: alignValue, /* left or center or right */
		});
	}

	setSize(sizeValue) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			size: sizeValue /* large or standard */
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
		const wrapperStyle = {
			float: this.props.content.align !== 'center'
				? this.props.content.align
				: 'none',
			textAlign: 'center',
		};

		const button = (
			<button
				type="button"
				className={`pt-button ${this.props.content.size === 'large' ? 'pt-large' : ''}`}
				onClick={()=> {}}
			>
				{this.props.content.text || 'Create Pub'}
			</button>
		);

		return (
			<div className="layout-editor-create-pub-component">
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
						<label htmlFor={`section-default-tags-${this.props.layoutIndex}`}>
							Default Tags
						</label>
						<input
							id={`section-default-tags-${this.props.layoutIndex}`}
							type="text"
							className="pt-input"
						/>
					</div>
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
							<button
								type="button"
								className={`pt-button ${this.props.content.align === 'right' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setAlign('right');
								}}
							>
								Right
							</button>
						</div>
					</div>
					<div className="pt-form-group">
						<label htmlFor={`section-limit-${this.props.layoutIndex}`}>
							Size
						</label>
						<div className="pt-button-group">
							<button
								type="button"
								className={`pt-button ${this.props.content.size === 'large' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setSize('large');
								}}
							>
								Large
							</button>
							<button
								type="button"
								className={`pt-button ${this.props.content.size === 'standard' ? 'pt-active' : ''}`}
								onClick={()=> {
									this.setSize('standard');
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

				<div className="block-content" style={wrapperStyle}>
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
}

LayoutEditorCreatePub.propTypes = propTypes;
export default LayoutEditorCreatePub;
