/* eslint-disable react/no-danger */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PubNoteContent, SimpleEditor } from 'components';
// import { formatCitationString } from 'utils';

const propTypes = {
	attrs: PropTypes.object.isRequired,
	updateAttrs: PropTypes.func.isRequired,
	isSmall: PropTypes.bool.isRequired,
	citations: PropTypes.array.isRequired,
};

class ControlsCitation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: props.attrs.value,
			// html: props.attrs.html,
		};

		this.handleValueChange = this.handleValueChange.bind(this);
		// this.handleHTMLChange = this.handleHTMLChange.bind(this);
	}

	handleValueChange(evt) {
		// this.setState({ value: evt.target.value });
		// formatCitationString(evt.target.value, this.handleHTMLChange);
		const newAttrs = { value: evt.target.value };
		this.props.updateAttrs(newAttrs);
		this.setState(newAttrs);
	}

	// handleHTMLChange(html) {
	// 	const newAttrs = { value: this.state.value, html: html };
	// 	this.props.updateAttrs(newAttrs);
	// 	this.setState(newAttrs);
	// }

	render() {
		const hasRenderedContent = this.props.citations.length >= this.props.attrs.count;
		return (
			<div
				className={`formatting-bar_controls-component ${this.props.isSmall ? 'small' : ''}`}
			>
				{/*  Content Adjustment */}
				<div className="block">
					<div className="label">Structured Data</div>
					<div className="input wide">
						<textarea
							placeholder="Enter bibtex, DOI, wikidata url, or bibjson..."
							className="bp3-input bp3-fill"
							value={this.state.value}
							onChange={this.handleValueChange}
						/>
					</div>
				</div>

				{/*  Content Adjustment */}
				<div className="block">
					<div className="label">Text</div>
					<div className="input wide">
						<div className="simple-editor-wrapper">
							<SimpleEditor
								initialHtmlString={this.props.attrs.unstructuredValue}
								onChange={(htmlString) => {
									this.props.updateAttrs({ unstructuredValue: htmlString });
								}}
							/>
						</div>
					</div>
				</div>

				{/*  Output */}
				<div className="block">
					<div className="label">Structured Data Output</div>
					<div className="input wide">
						{hasRenderedContent && (
							<PubNoteContent
								structured={this.props.citations[this.props.attrs.count - 1].html}
								unstructured={
									this.props.citations[this.props.attrs.count - 1]
										.unstructuredValue
								}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}

ControlsCitation.propTypes = propTypes;
export default ControlsCitation;
