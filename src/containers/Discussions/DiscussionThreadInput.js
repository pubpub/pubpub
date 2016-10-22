import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

import {schema} from 'components/AtomTypes/Document/proseEditor';
import {StoppableSubscription} from 'subscription';

let styles = {};
let pmThread;

export const DiscussionThreadInput = React.createClass({
	propTypes: {
		publishThreadReply: PropTypes.func,
		showTitle: PropTypes.bool,
	},

	getInitialState() {
		return {
			title: '',
		};
	},

	componentDidMount() {
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('components/AtomTypes/Document/proseEditor/pubpubSetup');

		const place = document.getElementById('reply-thread-input');
		if (!place) { return undefined; }
		pmThread = new prosemirror.ProseMirror({
			place: place,
			schema: schema,
			plugins: [pubpubSetup.config({menuBar: false, tooltipMenu: false})],
			doc: null,
			on: {
				doubleClickOn: new StoppableSubscription,
			}
		});

		// pmThread.on.change.add((evt)=>{
		// 	this.proseChange();
		// });

		pmThread.on.doubleClickOn.add((pos, node, nodePos)=>{
			if (node.type.name === 'embed') {
				const done = (attrs)=> {
					pmThread.tr.setNodeType(nodePos, node.type, attrs).apply();
				};
				window.toggleMedia(pmThread, done, node);
				return true;
			}
		});
	},

	submitThreadReply: function() {
		this.props.publishThreadReply(this.state.title, pmThread);
	},

	render: function() {
		const discussion = this.props.discussionData || {};
		const atomData = discussion.atomData || {};
		const versionData = discussion.versionData || {};
		const authorsData = discussion.authorsData || [];
		const index = this.props.index;
		const children = discussion.children || [];

		const docJSON = versionData.content && versionData.content.docJSON;
		const date = versionData.createDate;

		return (
			<div style={styles.container}>
				<div style={styles.replyBox}>
					{this.props.showTitle &&
						<input type="text" placeholder={'Discussion Title'} value={this.state.title} onChange={(evt)=>{this.setState({title: evt.target.value});}} style={styles.title}/>
					}

					<div id={'reply-thread-input'} className={'atom-reader atom-reply ProseMirror-quick-style'} style={styles.wsywigBlock}></div>
				</div>
				<button className={'button'} onClick={this.submitThreadReply}>{this.props.showTitle ? 'Submit New Discussion' : 'Submit Reply'}</button>
			</div>
		);
	}
});

export default DiscussionThreadInput;

styles = {
	container: {
		marginBottom: '2em',
	},
	replyBox: {
		boxShadow: '0px 1px 3px 1px #BBBDC0',
		backgroundColor: 'white',
		zIndex: 2,
		position: 'relative',
		marginBottom: '1em',
	},
	title: {
		width: 'calc(100% - 23px)',
	},
	wsywigBlock: {
		width: '100%',
		minHeight: '4em',
	},

};
