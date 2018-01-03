import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';
import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';
import { generateHash } from 'utilities';

require('./pubCollabSubmit.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	pubId: PropTypes.string.isRequired,
	pubData: PropTypes.object.isRequired,
	onSubmit: PropTypes.func,
	onPutPub: PropTypes.func,
	isLoading: PropTypes.bool,
};

const defaultProps = {
	onSubmit: ()=>{},
	onPutPub: ()=>{},
	isLoading: false,
};

class PubCollabSubmit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPublic: true,
		};
		this.onBodyChange = this.onBodyChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	onBodyChange(val) {
		this.setState({
			body: val,
			submitDisabled: !this.editorRef.view.state.doc.textContent,
		});
	}
	handleSubmit(evt) {
		evt.preventDefault();
		const defaultMessage = `${this.props.loginData.fullName} has submitted this pub for publication.`;
		const message = this.editorRef.view.state.doc.textContent;
		this.props.onSubmit({
			userId: this.props.loginData.id,
			pubId: this.props.pubId,
			title: 'Submission for Publication',
			content: message
				? this.state.body
				: { type: 'doc', attrs: { meta: {} }, content: [{ type: 'paragraph', content: [{ type: 'text', text: defaultMessage }] }] },
			text: message || defaultMessage,
			submitHash: generateHash(8),
			isPublic: this.state.isPublic,
		});
		if (this.props.pubData.adminPermissions === 'none') {
			this.props.onPutPub({
				adminPermissions: 'view',
			});
		}
	}
	render() {
		return (
			<div className="pub-collab-submit-component">
				<h5>Submit for Publication</h5>
				<div>Only members of the {this.props.communityData.title} Team can publish snapshots. Submitting for publication will create a new discussion thread and notify community admins of your intent to publish.</div>
				<div style={{ paddingTop: '1em' }}>To submit for publication, community admins must have permission to view, edit, or manage your document.</div>

				<div className="wrapper">
					<h5>Community Admin Permissions</h5>
					<PubAdminPermissions
						communityData={this.props.communityData}
						onSave={this.props.onPutPub}
						pubData={this.props.pubData}
						hideNone={true}
					/>
				</div>

				<div className="message-wrapper">
					<div className="title-wrapper">
						<h5>Submission Message</h5>
						<Popover
							content={
								<div className="pt-menu">
									<DropdownRichItem
										title="Public"
										description="Visible to the public."
										icon="pt-icon-globe"
										onClick={()=>{ this.setState({ isPublic: true }); }}
										hideBottomBorder={false}
									/>
									<DropdownRichItem
										title="Private"
										description="Visible to those with view, edit, or manage permissions."
										icon="pt-icon-lock2"
										onClick={()=>{ this.setState({ isPublic: false }); }}
										hideBottomBorder={true}
									/>
								</div>
							}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.TOP_RIGHT}
							popoverClassName="pt-minimal"
							transitionDuration={-1}
							inheritDarkTheme={false}
						>
							<button type="button" className={`pt-button pt-minimal pt-small ${this.state.isPublic ? 'pt-icon-globe' : 'pt-icon-lock2'}`}>
								Submission Thread will be {this.state.isPublic ? 'Public' : 'Private'}
							</button>
						</Popover>
					</div>
					<div className="input-text" tabIndex={-1} role="textbox">
						<Editor
							key={this.state.key}
							ref={(ref)=> { this.editorRef = ref; }}
							placeholder="Message for community admins..."
							onChange={this.onBodyChange}
						>
							<FormattingMenu include={['link']} />
						</Editor>
					</div>
				</div>

				<div className="button-wrapper">
					<Button
						onClick={this.handleSubmit}
						className="pt-intent-primary"
						text="Submit for Publication"
						loading={this.props.isLoading}
					/>
				</div>

			</div>
		);
	}
}

PubCollabSubmit.propTypes = propTypes;
PubCollabSubmit.defaultProps = defaultProps;
export default PubCollabSubmit;
