import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import {globalStyles} from 'utils/styleConstants';

import { StickyContainer as UnwrappedStickyContainer, Sticky } from 'react-sticky';
const StickyContainer = Radium(UnwrappedStickyContainer);

import {Media} from 'containers';
import {markdownParser, markdownSerializer, schema} from 'components/AtomTypes/Document/proseEditor';
import {License} from 'components';
import {StoppableSubscription} from 'subscription';
// import {createAtom} from 'containers/Media/actions';
import {createReplyDocument} from './actions';
import DiscussionItem from './DiscussionItem';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};
let pm;

export const Discussions = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		loginData: PropTypes.object,
		slug: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,

		dispatch: PropTypes.func,

	},

	getInitialState() {
		return {
			replyToID: undefined,
			rootReply: undefined,
		};
	},

	componentWillMount() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || [];
		const discussionsData = safeGetInToJS(this.props.atomData, ['discussionsData']) || [];
		const rootReply = discussionsData.length ? discussionsData[0].linkData.metadata.rootReply : atomData._id;

		this.setState({
			replyToID: atomData._id,
			rootReply: rootReply,
		});
	},

	componentWillReceiveProps(nextProps) {
		const atomData = safeGetInToJS(nextProps.atomData, ['atomData']) || [];
		const discussionsData = safeGetInToJS(nextProps.atomData, ['discussionsData']) || [];
		const rootReply = discussionsData.length ? discussionsData[0].linkData.metadata.rootReply : atomData._id;

		this.setState({
			replyToID: atomData._id,
			rootReply: rootReply,
		});
	},

	componentDidMount() {
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('components/AtomTypes/Document/proseEditor/pubpubSetup');
		
		pm = new prosemirror.ProseMirror({
			place: document.getElementById('reply-input'),
			schema: schema,
			plugins: [pubpubSetup.config({menuBar: false, tooltipMenu: true})],
			doc: null,
			on: {
				doubleClickOn: new StoppableSubscription,
			}
		});

		pm.on.doubleClickOn.add((pos, node, nodePos)=>{
			if (node.type.name === 'embed') {
				const done = (attrs)=> { 
					pm.tr.setNodeType(nodePos, node.type, attrs).apply(); 
				};
				window.toggleMedia(pm, done, node);
				return true;
			}
		});
	},

	addDiscussion: function(discussionObject, activeSaveID) {
		// if (!this.props.loginData.get('loggedIn')) {
		// 	return this.props.dispatch(toggleVisibility());
		// }

		// if (!discussionObject.markdown) { return null; }

		// this.props.dispatch(addDiscussion(discussionObject, activeSaveID));
	},

	// discussionVoteSubmit: function(type, discussionID, userYay, userNay) {
	// 	if (!this.props.loginData.get('loggedIn')) {
	// 		return this.props.dispatch(toggleVisibility());
	// 	}
	// 	this.props.dispatch(discussionVoteSubmit(type, discussionID, userYay, userNay));
	// },


	// archiveDiscussion: function(objectID) {
	// 	this.props.dispatch(archiveDiscussion(objectID));
	// },

	setReplyTo: function(replyToID) {
		// rootReplyID is set in componentDidMount
		this.setState({replyToID: replyToID});
		setTimeout(()=> {
			this.setState({});
		}, 1);
	},

	clearReplyTo: function(replyToID) {
		// rootReplyID is set in componentDidMount
		this.setState({replyToID: undefined});
		setTimeout(()=> {
			this.setState({});
		}, 1);
	},

	publishReply: function() {

		const atomType = 'document';
		const versionContent = {
			docJSON: pm.doc.toJSON(),	
			markdown: markdownSerializer.serialize(pm.doc),
		};
		
		this.props.dispatch(createReplyDocument(atomType, versionContent, 'Reply', this.state.replyToID, this.state.rootReply));
		pm.setDoc(markdownParser.parse(''));
	},


	render: function() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || [];
		const discussionsData = safeGetInToJS(this.props.atomData, ['discussionsData']) || [];
		
		let replyToData;
		const tempArray = discussionsData.map((item)=> {
			if (item.atomData._id === this.state.replyToID) {
				replyToData = {...item};
			}
			return item;
		});
		tempArray.forEach(function(index) {
			index.children = tempArray.filter((child)=> {
				return (child.linkData.destination === index.atomData._id);
			});
			return index;
		});
		const topChildren = tempArray.filter((index)=> {
			return index.linkData.destination === atomData._id;	
		});

		return (
			<div style={styles.container}>

				<Style rules={{
					'.pub-discussions-wrapper .p-block': {
						padding: '0.5em 0em',
					}
				}} />				

				<div>
				
					<Media/>

					<Sticky style={styles.replyWrapper} isActive={!!replyToData}>	
						<div style={[styles.replyHeader, !replyToData && {display: 'none'}]}>
								<div className={'showChildOnHover'} style={styles.replyToWrapper}>
									Reply to: {replyToData && replyToData.authorsData[0].source.name}
									<div className={'hoverChild'} style={styles.replyToPreview}>
										<DiscussionItem discussionData={replyToData} index={'current-reply'} isPreview={true}/>
									</div>
								</div>
							<div className={'button'} style={styles.replyButton} onClick={this.clearReplyTo}>Clear</div>
						</div>

						<div style={styles.replyBody}>
							<div id={'reply-input'} className={'atom-reader atom-reply ProseMirror-quick-style'} style={styles.wsywigBlock}></div>
						</div>

						<div style={styles.replyFooter}>
							<div style={styles.replyUserImageWrapper}>
								<img style={styles.replyUserImage} src={'https://jake.pubpub.org/unsafe/50x50/' + this.props.loginData.getIn(['userData', 'image'])} />
							</div>
							<div style={styles.replyLicense} key={'discussionLicense'}>
								<License text={'All discussions are licensed under a'} hover={true} />
							</div>
							<div className={'button'} style={styles.replyButton} onClick={this.publishReply}>Publish Reply</div>
						</div>
					</Sticky>

					
				</div>

				<div>
					{topChildren.map((discussion, index)=> {
						return <DiscussionItem discussionData={discussion} setReplyTo={this.setReplyTo} index={discussion.linkData._id} key={'discussion-' + index}/>;
					})}
				</div>

			</div>
		);
	}
});

export default connect( state => {
	return {
		atomData: state.atom,
		discussionsData: state.discussions,
		loginData: state.login,
		slug: state.router.params.slug,
		pathname: state.router.location.pathname,
		query: state.router.location.query,
	};
})( Radium(Discussions) );

styles = {
	replyWrapper: {
		// backgroundColor: 'blue',
		margin: '0em 0em 2em',
		boxShadow: '0px 1px 3px 1px #BBBDC0',
		backgroundColor: 'white',
		zIndex: 2,
	},
	replyHeader: {
		// backgroundColor: 'red',
		display: 'table',
		fontSize: '0.85em',
		borderBottom: '1px solid #BBBDC0',
		color: '#808284',
	},
	replyToWrapper: {
		display: 'table-cell',
		position: 'relative',
		verticalAlign: 'middle',
		padding: '.5em',
	},
	replyButton: {
		display: 'table-cell',
		width: '1%',
		whiteSpace: 'nowrap',
		verticalAlign: 'middle',
		padding: '0em 1em',
		borderWidth: '0px 0px 0px 1px',
		borderColor: '#BBBDC0',
	},
	replyBody: {
		// backgroundColor: 'green',
		maxHeight: '70vh',
		overflow: 'hidden',
		overflowY: 'scroll',
	},
	replyFooter: {
		display: 'table',
		borderTop: '1px solid #BBBDC0',
		fontSize: '0.85em',
	},
	replyUserImageWrapper: {
		display: 'table-cell',
		width: '1%',
		padding: '0.25em .5em',
		// backgroundColor: 'magenta',
		verticalAlign: 'middle',
	},
	replyUserImage: {
		width: '25px',
		display: 'block',
	},
	replyLicense: {
		display: 'table-cell',
		// backgroundColor: 'grey',
		verticalAlign: 'middle',
	},

	container: {
		paddingTop: '1em',
	},
	// license: {
	// 	float: 'right',
	// 	lineHeight: '26px',
	// 	opacity: '0.4',
	// 	paddingRight: '4px',
	// },
	wsywigBlock: {
		width: '100%',
		minHeight: '4em',
		// backgroundColor: 'white',
		// margin: '2em auto',
		// boxShadow: '0px 1px 3px 1px #BBBDC0',
	},
	// discussionHeader: {
	// 	display: 'table',
	// 	position: 'relative',
	// 	left: '-.4em',
	// 	width: 'calc(100% + .4em)'
	// },
	// headerVotes: {
	// 	display: 'table-cell',
	// 	width: '1%',
	// 	textAlign: 'center',
	// 	verticalAlign: 'top',
	// },
	// headerVote: {
	// 	padding: '0em .2em',
	// 	height: '.6em',
	// 	fontFamily: 'Courier',
	// 	fontSize: '2em',
	// 	lineHeight: '1.1em',
	// 	cursor: 'pointer',
	// 	color: '#808284',
	// 	overflow: 'hidden',
	// },
	// headerDownVote: {
	// 	transform: 'rotate(180deg)',
	// },
	// headerDetails: {
	// 	display: 'table-cell',
	// 	verticalAlign: 'top',
	// 	fontSize: '0.85em',
	// 	color: '#58585B',
	// },
	// headerAuthor: {
	// 	display: 'table',

	// },
	// authorImage: {
	// 	display: 'table-cell',
	// 	width: '1%',
	// 	padding: '0em .5em 0em 0em',
	// 	verticalAlign: 'top',
	// },
	// authorDetails: {
	// 	display: 'table-cell',
	// 	verticalAlign: 'top',
	// },
	// discussionContent: {
	// 	// padding: '1em 0em',
	// },
	// discussionFooter: {
	// 	borderBottom: '1px solid #BBBDC0',
	// 	marginBottom: '1em',
	// 	paddingBottom: '1em',
	// },
	// discussionFooterItem: {
	// 	padding: '0em 1em 0em 0em',
	// 	fontSize: '0.75em',
	// 	cursor: 'pointer',
	// 	color: '#58585B',
	// },
	// replyToWrapper: {
	// 	position: 'relative',
	// 	// margin: '1em 0em -1em 0em',
	// },
	replyToPreview: {
		position: 'absolute',
		backgroundColor: 'white',
		padding: '1em',
		boxShadow: '0px 1px 3px #58585B',
		zIndex: '5',
	},

};
