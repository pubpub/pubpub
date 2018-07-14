import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import HeaderMenu from '@pubpub/editor/addons/HeaderMenu';
import Collaborative from '@pubpub/editor/addons/Collaborative';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import Latex from '@pubpub/editor/addons/Latex';
import Footnote from '@pubpub/editor/addons/Footnote';
import HighlightMenu from '@pubpub/editor/addons/HighlightMenu';
import Citation from '@pubpub/editor/addons/Citation';
import LinkMenu from '@pubpub/editor/addons/LinkMenu';
import Table from '@pubpub/editor/addons/Table';
import Discussion from 'components/DiscussionAddon/DiscussionAddon';
import { s3Upload, getFirebaseConfig, getResizedUrl, formatCitationString, renderLatexString } from 'utilities';

require('./pubBody.scss');

const propTypes = {
	onRef: PropTypes.func,
	isDraft: PropTypes.bool.isRequired,
	versionId: PropTypes.string.isRequired,
	sectionId: PropTypes.string,
	content: PropTypes.object.isRequired,
	threads: PropTypes.array,
	slug: PropTypes.string,
	highlights: PropTypes.array,
	hoverBackgroundColor: PropTypes.string.isRequired,
	setActiveThread: PropTypes.func,
	onNewHighlightDiscussion: PropTypes.func,


	clientData: PropTypes.object.isRequired,
	editorKey: PropTypes.string.isRequired,
	onClientChange: PropTypes.func.isRequired,
	onHighlightClick: PropTypes.func.isRequired,
	isReadOnly: PropTypes.bool.isRequired,
	onStatusChange: PropTypes.func,
	menuWrapperRefNode: PropTypes.object,
};
const defaultProps = {
	onRef: ()=>{},
	sectionId: undefined,
	highlights: [],
	threads: [],
	slug: '',
	setActiveThread: ()=>{},
	onNewHighlightDiscussion: ()=>{},
	onStatusChange: ()=>{},
	menuWrapperRefNode: undefined,
};

class PubBody extends Component {
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

	findThreadNumberFromHighlightId(highlightId, highlightNode) {
		const threadNumber = this.props.highlights.reduce((prev, curr)=> {
			if (curr.id === highlightId) { return curr.threadNumber; }
			return prev;
		}, undefined);
		this.props.setActiveThread(threadNumber, highlightNode);
	};

	render() {
		if (this.props.isDraft && !this.props.menuWrapperRefNode) { return null; }

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
			<div className="pub-body-component">
				{this.props.isDraft && this.props.isReadOnly &&
					<div className="pt-callout" style={{ marginBottom: '2em' }}>
						<h5>Read Only</h5>
						You have view permissions. You can see the working draft but cannot edit it.
					</div>
				}
				<Editor
					key={this.props.editorKey}
					editorId={this.props.slug}
					initialContent={this.props.isDraft ? undefined : this.props.content}
					isReadOnly={this.props.isReadOnly}
					showHeaderLinks={!this.props.isDraft}
					ref={this.props.onRef}
					placeholder={this.props.isDraft ? 'Begin writing here...' : undefined}
					onOptionsRender={(nodeDom, optionsDom)=>{
						const getOffsetTop = (node, runningOffset)=> {
							if (node.offsetParent.className.split(' ').indexOf('ProseMirror') > -1) {
								return node.offsetTop + runningOffset;
							}
							return getOffsetTop(node.parentNode, node.offsetTop + runningOffset);
						};

						optionsDom.style.top = `${getOffsetTop(nodeDom, 0)}px`;
						/* Left should be set to 100% plus the gap until the right margin content begins */
						/* Side is 275px, gap is 4%. As set in pub.scss */
						optionsDom.style.left = 'calc(100% + (100% + 275px) * (4/96))';
						/* Width should be set to the width of the right margin */
						optionsDom.style.width = '275px';
						optionsDom.style.fontSize = '14px';
					}}
				>
					{!this.props.isReadOnly &&
						<HeaderMenu
							wrapperDomNode={this.props.menuWrapperRefNode}
						/>
					}
					{!this.props.isReadOnly &&
						<LinkMenu />
					}
					{this.props.isDraft &&
						<Collaborative
							firebaseConfig={getFirebaseConfig()}
							clientData={this.props.clientData}
							editorKey={this.props.editorKey}
							onClientChange={this.props.onClientChange}
							onStatusChange={this.props.onStatusChange}
						/>
					}
					
					<Image
						handleFileUpload={s3Upload}
						handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }}
						linkToSrc={this.props.isReadOnly}
					/>
					<Video handleFileUpload={s3Upload} />
					<File handleFileUpload={s3Upload} />
					<Iframe />
					<Latex renderFunction={renderLatexString} />
					<Footnote />
					<Table />
					<HighlightMenu
						versionId={this.props.isDraft ? undefined : this.props.versionId}
						sectionId={this.props.sectionId}
						highlights={this.props.highlights}
						primaryEditorClassName="pub-body-component"
						onNewDiscussion={this.props.onNewHighlightDiscussion}
						onDotClick={this.findThreadNumberFromHighlightId}
						hoverBackgroundColor={this.props.hoverBackgroundColor}
					/>
					<Citation formatFunction={formatCitationString} />
					<Discussion
						threads={this.props.threads}
						slug={this.props.slug}
						setActiveThread={this.props.isDraft ? undefined : this.props.setActiveThread}
					/>
				</Editor>
			</div>
		);
	}
};

PubBody.propTypes = propTypes;
PubBody.defaultProps = defaultProps;
export default PubBody;
