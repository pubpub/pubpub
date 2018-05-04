import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import Latex from '@pubpub/editor/addons/Latex';
import Footnote from '@pubpub/editor/addons/Footnote';
import Citation from '@pubpub/editor/addons/Citation';
import HighlightMenu from '@pubpub/editor/addons/HighlightMenu';
import Discussion from 'components/DiscussionAddon/DiscussionAddon';
import { getResizedUrl } from 'utilities';

require('./pubBody.scss');

const propTypes = {
	onRef: PropTypes.func,
	versionId: PropTypes.string.isRequired,
	chapterNumber: PropTypes.string,
	content: PropTypes.object.isRequired,
	threads: PropTypes.array,
	slug: PropTypes.string,
	highlights: PropTypes.array,
	hoverBackgroundColor: PropTypes.string.isRequired,
	setActiveThread: PropTypes.func,
	onNewHighlightDiscussion: PropTypes.func,
};
const defaultProps = {
	onRef: ()=>{},
	chapterNumber: undefined,
	highlights: [],
	threads: [],
	slug: '',
	setActiveThread: ()=>{},
	onNewHighlightDiscussion: ()=>{},
};

const PubBody = function(props) {
	const findThreadNumberFromHighlightId = (highlightId)=> {
		const threadNumber = props.highlights.reduce((prev, curr)=> {
			if (curr.id === highlightId) { return curr.threadNumber; }
			return prev;
		}, undefined);
		props.setActiveThread(threadNumber);
	};

	return (
		<div className="pub-body-component">
			<Editor
				key={`render-${props.versionId}`}
				editorId={props.slug}
				initialContent={props.content}
				isReadOnly={true}
				showHeaderLinks={true}
				ref={props.onRef}
			>
				<Image handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }} />
				<Video />
				<File />
				<Iframe />
				<Latex />
				<Footnote />
				<HighlightMenu
					versionId={props.versionId}
					chapterNumber={props.chapterNumber}
					highlights={props.highlights}
					primaryEditorClassName="pub-body-component"
					onNewDiscussion={props.onNewHighlightDiscussion}
					onDotClick={findThreadNumberFromHighlightId}
					hoverBackgroundColor={props.hoverBackgroundColor}
				/>
				<Citation />
				<Discussion
					threads={props.threads}
					slug={props.slug}
					setActiveThread={props.setActiveThread}
				/>
			</Editor>
		</div>
	);
};

PubBody.propTypes = propTypes;
PubBody.defaultProps = defaultProps;
export default PubBody;
