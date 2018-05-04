import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import Collaborative from '@pubpub/editor/addons/Collaborative';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import Latex from '@pubpub/editor/addons/Latex';
import Footnote from '@pubpub/editor/addons/Footnote';
import HighlightMenu from '@pubpub/editor/addons/HighlightMenu';
import Citation from '@pubpub/editor/addons/Citation';
import InsertMenu from '@pubpub/editor/addons/InsertMenu';
import Discussion from 'components/DiscussionAddon/DiscussionAddon';
import { s3Upload, getFirebaseConfig, getResizedUrl, formatCitationString, renderLatexString } from 'utilities';

const propTypes = {
	onRef: PropTypes.func.isRequired,
	clientData: PropTypes.object.isRequired,
	editorKey: PropTypes.string.isRequired,
	onClientChange: PropTypes.func.isRequired,
	onNewHighlightDiscussion: PropTypes.func.isRequired,
	onHighlightClick: PropTypes.func.isRequired,
	hoverBackgroundColor: PropTypes.string.isRequired,
	isReadOnly: PropTypes.bool,
	threads: PropTypes.array,
	highlights: PropTypes.array,
	slug: PropTypes.string,
	onStatusChange: PropTypes.func,
};

const defaultProps = {
	isReadOnly: false,
	threads: [],
	slug: '',
	highlights: undefined,
	onStatusChange: ()=>{},
};

class PubCollabEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: undefined,
		};
		this.findThreadNumberFromHighlightId = this.findThreadNumberFromHighlightId.bind(this);
	}
	componentDidCatch(error) {
		this.setState({ error: true });
	}
	findThreadNumberFromHighlightId(highlightId) {
		const threadNumber = this.props.highlights.reduce((prev, curr)=> {
			if (curr.id === highlightId) { return curr.threadNumber; }
			return prev;
		}, undefined);
		this.props.onHighlightClick(threadNumber);
	}
	render() {
		if (this.state.error) {
			return (
				<NonIdealState
					title="Uh Oh"
					visual="error"
					description="An error has occured. We've logged the bug and have notified our development team. Please reload the page to continue."
					action={
						<button
							className="pt-button"
							onClick={()=>{ window.location.reload(); }}
						>
							Reload Page
						</button>
					}
				/>
			);
		}
		return (
			<div className="pub-collab-editor-component">
				{this.props.isReadOnly &&
					<div className="pt-callout" style={{ marginBottom: '2em' }}>
						<h5>Read Only</h5>
						You have view permissions. You can see the working draft but cannot edit it.
					</div>
				}

				<Editor
					placeholder="Begin writing here..."
					ref={this.props.onRef}
					isReadOnly={this.props.isReadOnly}
					key={this.props.editorKey}
				>
					{!this.props.isReadOnly &&
						<FormattingMenu />
					}
					{!this.props.isReadOnly &&
						<InsertMenu />
					}
					<Collaborative
						firebaseConfig={getFirebaseConfig()}
						clientData={this.props.clientData}
						editorKey={this.props.editorKey}
						onClientChange={this.props.onClientChange}
						onStatusChange={this.props.onStatusChange}
					/>
					<Image
						handleFileUpload={s3Upload}
						handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }}
					/>
					<Video handleFileUpload={s3Upload} />
					<File handleFileUpload={s3Upload} />
					<Iframe />
					<Latex renderFunction={renderLatexString} />
					<Footnote />
					<HighlightMenu
						versionId={undefined}
						chapterNumber={undefined}
						highlights={this.props.highlights}
						primaryEditorClassName="pub-collab-editor-component"
						onNewDiscussion={this.props.onNewHighlightDiscussion}
						onDotClick={this.findThreadNumberFromHighlightId}
						hoverBackgroundColor={this.props.hoverBackgroundColor}
					/>
					<Citation formatFunction={formatCitationString} />
					<Discussion
						threads={this.props.threads}
						slug={this.props.slug}
					/>
				</Editor>
			</div>
		);
	}
}

PubCollabEditor.propTypes = propTypes;
PubCollabEditor.defaultProps = defaultProps;
export default PubCollabEditor;
