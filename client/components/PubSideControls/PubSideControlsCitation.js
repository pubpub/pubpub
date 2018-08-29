import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatCitationString } from 'utilities';

const propTypes = {
	attrs: PropTypes.object.isRequired,
	updateAttrs: PropTypes.func.isRequired,
};

class PubSideControlsCitation extends Component {
	constructor(props) {
		super(props);

		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleHTMLChange = this.handleHTMLChange.bind(this);
	}

	handleValueChange(evt) {
		this.props.updateAttrs({ value: evt.target.value });
		formatCitationString(evt.target.value, this.handleHTMLChange);
	}

	handleHTMLChange(html) {
		this.props.updateAttrs({ html: html });
	}

	render() {
		return (
			<div className="pub-side-controls-citation-component">
				<div className="options-title">Citation Details</div>

				{/*  Content Adjustment */}
				<div className="form-label first">
					Structured Data
				</div>
				<textarea
					placeholder="Enter bibtex, DOI, wikidata url, or bibjson..."
					className="pt-input pt-fill"
					value={this.props.attrs.value}
					onChange={this.handleValueChange}
				/>

				{/*  Output */}
				<div className="form-label">
					Data Output
				</div>
				<div
					className="rendered-citation"
					dangerouslySetInnerHTML={{ __html: this.props.attrs.html }}
				/>

			</div>
		);
	}
}


PubSideControlsCitation.propTypes = propTypes;
export default PubSideControlsCitation;
