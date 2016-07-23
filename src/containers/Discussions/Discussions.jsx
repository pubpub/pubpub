import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';

import {Media} from 'containers';
import {schema} from 'components/AtomTypes/Document/proseEditor';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {StoppableSubscription} from 'subscription';

import {getDiscussionsData} from './actions';

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
		};
	},


	componentWillReceiveProps(nextProps) {

	},

	componentDidMount() {
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('components/AtomTypes/Document/proseEditor/pubpubSetup');
		
		pm = new prosemirror.ProseMirror({
			place: document.getElementById('reply-input'),
			schema: schema,
			plugins: [pubpubSetup],
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


	render: function() {

		const discussionsData = safeGetInToJS(this.props.atomData, ['discussionsData']) || [];
		
		return (
			<div style={styles.container}>

				<Style rules={{
					'.pub-discussions-wrapper .p-block': {
						padding: '0.5em 0em',
					}
				}} />

				<div>
					{discussionsData.map((discussion, index)=> {
						const docJSON = discussion.versionData.content.docJSON;
						const image = discussion.authorsData[0].source.image;
						return (
							<div>
								<img src={image} />
								{renderReactFromJSON(docJSON && docJSON.content)}
							</div>
						);
					})}
					
				</div>

				<div style={styles.proseInput}>
				
					<Media/>

					{/* <div id={'reply-input'} style={styles.wsywigBlock}></div> */}
					
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
	container: {
	},
	wsywigBlock: {
		width: '100%',
		minHeight: '4em',
		backgroundColor: 'white',
		margin: '0 auto',
		boxShadow: '0px 1px 3px 1px #BBBDC0',
	},
};
