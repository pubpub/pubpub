import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { renderLatexString } from 'utilities';

const propTypes = {
	attrs: PropTypes.object.isRequired,
	updateAttrs: PropTypes.func.isRequired,
};

class PubSideControlsEquation extends Component {
	constructor(props) {
		super(props);

		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleHTMLChange = this.handleHTMLChange.bind(this);
		// this.changeToInline = this.changeToInline.bind(this);
		// this.changeToBlock = this.changeToBlock.bind(this);
	}

	handleValueChange(evt) {
		this.props.updateAttrs({ value: evt.target.value });
		renderLatexString(evt.target.value, false, this.handleHTMLChange);
	}

	handleHTMLChange(html) {
		this.props.updateAttrs({ html: html });
	}

	// changeToInline() {
	// 	if (this.props.isBlock) {
	// 		this.props.changeNode(this.props.view.state.schema.nodes.equation, {
	// 			value: this.props.value,
	// 			html: this.props.html,
	// 		}, null);
	// 	}
	// }

	// changeToBlock() {
	// 	if (!this.props.isBlock) {
	// 		this.props.changeNode(this.props.view.state.schema.nodes.block_equation, {
	// 			value: this.props.value,
	// 			html: this.props.html,
	// 		}, null);
	// 	}
	// }

	render() {
		return (
			<div className="pub-side-controls-citation-component">
				<div className="options-title">Equation Details</div>
				{/*  LaTex Adjustment */}
				<div className="form-label first">
					LaTeX
				</div>
				<textarea
					placeholder="Enter LaTeX math"
					className="pt-input pt-fill"
					value={this.props.attrs.value}
					onChange={this.handleValueChange}
				/>

				{/*  Display Adjustment */}
				<div className="form-label">
					Display
				</div>
				<div>TODO: This section needs to be fixed. Solution for toggling inline vs block.</div>
				<div>TODO: Not all of these are equations. Rename it to 'math'</div>
				{/*
				<div className="pt-button-group pt-fill">
					<button
						className={`pt-button pt-icon-align-left ${!this.props.isBlock ? 'pt-active' : ''}`}
						onClick={this.changeToInline}
					>
						Inline
					</button>
					<button
						className={`pt-button pt-icon-align-justify ${this.props.isBlock ? 'pt-active' : ''}`}
						onClick={this.changeToBlock}
					>
						Block
					</button>
				</div>
				*/}
			</div>
		);
	}
}


PubSideControlsEquation.propTypes = propTypes;
export default PubSideControlsEquation;
