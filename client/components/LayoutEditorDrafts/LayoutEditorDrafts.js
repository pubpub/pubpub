import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubPreview from 'components/PubPreview/PubPreview';

require('./layoutEditorDrafts.scss');

const propTypes = {
	onChange: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* title */
};

class LayoutEditorDrafts extends Component {
	constructor(props) {
		super(props);
		this.handleRemove = this.handleRemove.bind(this);
		this.changeTitle = this.changeTitle.bind(this);
	}
	handleRemove() {
		this.props.onRemove(this.props.layoutIndex);
	}
	changeTitle(evt) {
		this.props.onChange(this.props.layoutIndex, {
			...this.props.content,
			title: evt.target.value,
		});
	}
	render() {
		const previews = [0, 1];
		return (
			<div className="layout-editor-drafts-component">
				<div className="block-header">
					<div className="pt-form-group">
						<label htmlFor={`section-title-${this.props.layoutIndex}`}>Drafts Section Title</label>
						<input id={`section-title-${this.props.layoutIndex}`} type="text" className="pt-input" value={this.props.content.title} onChange={this.changeTitle} />
					</div>
					<div className="spacer" />
					<div className="pt-form-group">
						<div className="pt-button-group">
							<button className="pt-button pt-icon-trash" onClick={this.handleRemove} />
						</div>
					</div>
				</div>

				<div className="block-content">
					<div className="container">
						<div className="drafts-wrapper">
							<div className="row">
								<div className="col-12 drafts-header">
									<h2>{this.props.content.title}</h2>
									<div>The following are unpublished pubs that are open to collaboration.</div>
								</div>
							</div>
							<div className="row">
								{previews.map((item)=> {
									return (
										<div className="col-12" key={`pub-${item}`}>
											<PubPreview
												isPlaceholder={true}
												size="small"
											/>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

LayoutEditorDrafts.propTypes = propTypes;
export default LayoutEditorDrafts;
