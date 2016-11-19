import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { StickyContainer, Sticky } from 'react-sticky';
import ReactMarkdown from 'react-markdown';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

// import { pub } from 'utils/sampleData';
import { getPubData } from './actions';

// import { PubContent } from './PubContent';
// import { PubEdit } from './PubEdit';
// import { PubVersions } from './PubVersions';
// import { PubFiles } from './PubFiles';
// import { PubContributors } from './PubContributors';
// import { PubJournals } from './PubJournals';
// import { PubSettings } from './PubSettings';

let styles;

export const Pub = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	statics: {
		readyOnActions: function(dispatch, params) {
			return Promise.all([
				dispatch(getPubData(params.slug))
			]);
		}
	},

	// getInitialState() {
	// 	return {
	// 		filterHover: undefined,
	// 		pub: pub,
	// 		editValue: '',
	// 		newDiscussionOpen: false,
	// 		newDiscussionTitle: '',
	// 		newDiscussionContent: '',
	// 		discussionContent: '',
	// 	};
	// },

	filterHoverOpen: function(value) {
		if (this.state.filterHover === value) {
			this.setState({filterHover: undefined});
		} else {
			this.setState({filterHover: value});	
		}
	},
	// filterHoverClose: function() {
	// 	this.setState({filterHover: undefined});
	// },

	// setClone: function() {
	// 	this.props.dispatch(setClone('Environmental Analysis and Ecological Retraction', 1));
	// },

	// setFork: function() {
	// 	this.props.dispatch(setClone('Environmental Analysis and Ecological Retraction', 1));
	// 	browserHistory.push('/pub/' + this.props.params.slug + '/edit');
	// },

	// submitPR: function() {
	// 	const pubData = this.state.pub;
	// 	const query = this.props.location.query;
	// 	const currentVersion = pubData.versions.reduce((previous, current)=> {
	// 		if (query.version === String(current.id)) { return current; }
	// 		return previous;
	// 	}, pubData.versions[pubData.versions.length - 1]);

	// 	const newPR = {
	// 		id: 10,
	// 		title: 'A new Review with changes',
	// 		users: [
	// 			{
	// 				name: 'Travis Rich',
	// 				id: 100,
	// 			},
	// 		],
	// 		content: 'Some updates to the file.',
	// 		parent: null,
	// 		newVersion: {
	// 			id: Math.floor(Math.random() * 100),
	// 			versionMessage: 'A new Review with changes',
	// 			parentPub: 1,
	// 			public: true,
	// 			files: [
	// 				currentVersion.files[0],
	// 				{
	// 					id: 2,
	// 					type: 'text',
	// 					name: 'main.md',
	// 					url: null,
	// 					value: this.state.editValue,
	// 				}
	// 			]
	// 		}
	// 	};

	// 	this.props.dispatch(submitPR(newPR));
		
	// 	browserHistory.push('/pub/' + this.props.params.slug);
	// },

	acceptPR: function(newVersion) {
		// const pubData = this.state.pub;
		// this.setState({pub: {
		// 	...pubData,
		// 	discussions: pub.discussions,
		// 	versions: [...pubData.versions, newVersion]
		// }});
		this.props.dispatch(acceptPR(newVersion));
		browserHistory.push('/pub/' + this.props.params.slug);
	},

	// postReply: function() {
	// 	const title = 'reply';
	// 	const content = this.state.discussionContent;
	// 	const pubId = this.props.appData.pub.id;
	// 	const userId = 1;
	// 	const parentId = this.props.location.query.discussion;
	// 	this.props.dispatch(postDiscussion(title, content, pubId, userId, parentId));
	// 	this.setState({discussionContent: ''});
	// },

	// setEditValue: function(evt) {
	// 	console.log(evt.target.value);
	// 	this.setState({editValue: evt.target.value});
	// },

	// toggleNewDiscussionOpen: function() {
	// 	this.setState({newDiscussionOpen: !this.state.newDiscussionOpen});
	// },
	// updateNewDiscussionTitle: function(evt) {
	// 	this.setState({newDiscussionTitle: evt.target.value});
	// },
	// updateNewDiscussionContent: function(evt) {
	// 	this.setState({newDiscussionContent: evt.target.value});
	// },
	// submitNewDiscussion: function() {
	// 	// const newID = Math.floor(Math.random() * 100);
	// 	this.setState({
	// 		// pub: {
	// 		// 	...this.state.pub,
	// 		// 	discussions: [
	// 		// 		...this.state.pub.discussions,
	// 		// 		{
	// 		// 			id: newID,
	// 		// 			title: this.state.newDiscussionTitle,
	// 		// 			author: 'Chaz McPendleton',
	// 		// 			content: this.state.newDiscussionContent,
	// 		// 			parent: null,
	// 		// 		},
	// 		// 	],
	// 		// },
	// 		newDiscussionTitle: '',
	// 		newDiscussionContent: '',
	// 		newDiscussionOpen: false,
	// 	});

	// 	const title = this.state.newDiscussionTitle;
	// 	const content = this.state.newDiscussionContent;
	// 	const pubId = this.props.appData.pub.id;
	// 	const userId = 1;
	// 	const parentId = null;
	// 	this.props.dispatch(postDiscussion(title, content, pubId, userId, parentId));

	// 	// browserHistory.push({pathname: this.props.location.pathname, query: {...this.props.location.query, discussion: newID}});
	// 	browserHistory.push({pathname: this.props.location.pathname, query: {...this.props.location.query, discussion: undefined}});

	// },



	render() {
		const meta = this.props.params.meta;
		const query = this.props.location.query;
		const pubData = this.props.pubData.pub || {};
		// const pubData = this.props.appData.pub || {};
		const currentVersion = pubData.versions.reduce((previous, current)=> {
			if (query.version === String(current.id)) { return current; }
			return previous;
		}, pubData.versions[pubData.versions.length - 1]);
		const metaData = {
			title: pubData.title + ' · PubPub',
			meta: [
				{ property: 'og:title', content: pubData.title },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:description', content: pubData.description },
				{ property: 'og:url', content: 'https://www.pubpub.org/pub/' + pubData.slug },
				{ property: 'og:image', content: pubData.previewImage },
				{ property: 'og:image:url', content: pubData.previewImage },
				{ property: 'og:image:width', content: '500' },
				{ property: 'article:published_time', content: pubData.lastUpdated || pubData.createDate },
				{ property: 'article:modified_time', content: pubData.lastUpdated },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:site', content: '@pubpub' },
				{ name: 'twitter:title', content: pubData.title },
				{ name: 'twitter:description', content: pubData.description || pubData.title },
				{ name: 'twitter:image', content: pubData.previewImage },
				{ name: 'twitter:image:alt', content: 'Preview image for ' + pubData.title }
			]
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />
				<div style={styles.left}>
					{/*!!pubData.parent && 
						<div style={styles.forkHeader}>
							<div style={styles.buttonsPR}>
								<div style={styles.buttonBig} onClick={this.submitPR}>Submit Revisions</div>
							</div>
							Fork of <span style={styles.forkTitle}>{pubData.parent.title}</span>
						</div>
					*/}

					<div style={styles.buttons}>
						<div style={styles.buttonBig} onClick={this.setFork}>{!!pubData.parent ? 'Edit' : 'Suggest Edits'}</div>
						<div style={styles.button} onClick={this.setClone}>Clone</div>
						<div style={styles.button}>Follow</div>
						<div style={styles.button}>Export</div>
						<div style={styles.button}>Cite</div>
					</div>

					<div style={styles.pubTitle}>{pubData.title}</div>
					<div style={styles.pubAuthors}>
						{pubData.contributors.filter((item)=>{
							return item.displayAsAuthor !== false;
						}).map((item, index, array)=> {
							return <span>{item.name}{index !== array.length -1 ? ', ' : ''}</span>
						})}
					</div>

					

					<div style={styles.nav}>
						<Link to={'/pub/' + this.props.params.slug}><div style={styles.navItem} className={'underlineOnHover'}>Content</div></Link>
						<Link to={'/pub/' + this.props.params.slug + '/versions'}><div style={styles.navItem} className={'underlineOnHover'}>Versions ({pubData.versions.length})</div></Link>
						<Link to={'/pub/' + this.props.params.slug + '/contributors'}><div style={styles.navItem} className={'underlineOnHover'}>Contributors ({pubData.contributors.filter((item)=>{return item.displayAsContributor !== false;}).length})</div></Link>
						<Link to={'/pub/' + this.props.params.slug + '/journals'}><div style={styles.navItem} className={'underlineOnHover'}>Journals</div></Link>
						<Link to={{ pathname: '/pub/' + this.props.params.slug + '/files', query: query }}><div style={styles.navItem} className={'underlineOnHover'}>Files</div></Link>
						<Link to={'/pub/' + this.props.params.slug + '/settings'}><div style={styles.navItem} className={'underlineOnHover'}>Settings</div></Link>
					</div>

					{/*
					{!meta && <PubContent versionData={currentVersion}/>}
					{meta === 'edit' && <PubEdit versionData={currentVersion} updateEditValue={this.setEditValue}/>}
					{meta === 'versions' && <PubVersions versionsData={pubData.versions} location={this.props.location}/>}
					{meta === 'contributors' && <PubContributors contributors={pubData.contributors}/>}
					{meta === 'journals' && <PubJournals />}
					{meta === 'files' && <PubFiles versionData={currentVersion}/>}
					{meta === 'settings' && <PubSettings />}
					*/}

				</div>

				<StickyContainer style={styles.right}>
					<Sticky style={styles.rightSticky}>

						{!query.discussion && !this.state.newDiscussionOpen &&
							<div>
								<div style={styles.discussionButtonWrapper}>
									<div style={styles.discussionButton}>Invite Reviewer</div>
									<div style={styles.discussionButtonBig} onClick={this.toggleNewDiscussionOpen}>New Discussion</div>
								</div>

								<input type={'text'} style={styles.filterInput} />
								<div style={styles.filters}>
									<div style={styles.filter} onClick={this.filterHoverOpen.bind(this, 'author')}>Author <span className={'down-arrow'}></span></div>
									<div style={styles.filter} onClick={this.filterHoverOpen.bind(this, 'label')}>Label <span className={'down-arrow'}></span></div>
									<div style={styles.filter} onClick={this.filterHoverOpen.bind(this, 'status')}>Status <span className={'down-arrow'}></span></div>
									<div style={styles.filter} onClick={this.filterHoverOpen.bind(this, 'sort')}>Sort <span className={'down-arrow'}></span></div>
								</div>

								{this.state.filterHover === 'author' && 
									<div style={styles.filterHoverBox}>
										Filter by Author <span style={styles.filterHoverClose}onClick={this.filterHoverClose}>X</span><hr/>
										<p>Darren McLoper</p>
										<p>Arnold Brendt</p>
										<p>Chassy McCaulik</p>
									</div>
								}
								{this.state.filterHover === 'label' && 
									<div style={styles.filterHoverBox}>
										Filter by Label <span style={styles.filterHoverClose}onClick={this.filterHoverClose}>X</span><hr/>
										<p>Review</p>
										<p>Question</p>
										<p>Opinion</p>
									</div>
								}
								{this.state.filterHover === 'status' && 
									<div style={styles.filterHoverBox}>
										Filter by Status <span style={styles.filterHoverClose}onClick={this.filterHoverClose}>X</span><hr/>
										<p>Open</p>
										<p>Closed</p>
										<p>Flagged</p>
									</div>
								}
								{this.state.filterHover === 'sort' && 
									<div style={styles.filterHoverBox}>
										Sort by: <span style={styles.filterHoverClose}onClick={this.filterHoverClose}>X</span><hr/>
										<p>Newest</p>
										<p>Oldest</p>
										<p>Most Upvotes</p>
										<p>Most replies</p>
									</div>
								}
								
								<div style={styles.discussionStart}></div>

								{pubData.discussions.filter((item)=> {
									return item && !item.parentId;
								}).map((item, index)=> {
									return (
										<Link key={'discussion-' + index} to={{pathname: this.props.location.pathname, query: {...query, discussion:item.id}}} style={styles.discussionLink}>
											<div style={styles.discussionContainer}>
												<div style={styles.discussionTitle}>{item.title}</div>
												<div style={styles.discussionMeta}>#{item.id} by {item.users[0].name} - {pubData.discussions.filter((child)=>{return child.parentId === item.id}).length} replies</div>
											</div>
										</Link>
									);
								})}
							</div>
						}
						
						{query.discussion && !this.state.newDiscussionOpen &&
							<div style={styles.conversationWrapper}>
								<Link to={this.props.location.pathname} style={styles.discussionLink}>Back</Link>
								
								{pubData.discussions.filter((item)=> {
									return String(item.parentId) === query.discussion || String(item.id) === query.discussion;
								}).map((item, index)=> {
									return (
										<div style={styles.conversationItem}>
											{String(item.id) === query.discussion && <h3 style={styles.discussionTitle}>{item.title}</h3>}
											<div style={styles.discussionMeta}>#{item.id} by {item.users[0].name}</div>
											<div style={styles.discussionContent}><ReactMarkdown source={item.content} /></div>
											{!!item.newVersion && 
												<div>
													<h4>Connected New Version</h4>
													<button onClick={this.acceptPR.bind(this, item.newVersion)}>Accept PR</button>
												</div>
											}
										</div>
									);
								})}

								<textarea placeholder="Reply" style={styles.fullWidth} value={this.state.discussionContent} onChange={(evt)=>{this.setState({discussionContent: evt.target.value})}}></textarea>
								<button onClick={this.postReply}>Submit Reply</button>

							</div>
						}

						{this.state.newDiscussionOpen &&
							<div style={styles.newDiscussionWrapper}>
								<span onClick={this.toggleNewDiscussionOpen}>Cancel</span>
								<input type="text" placeholder="Title" value={this.state.newDiscussionTitle} onChange={this.updateNewDiscussionTitle} style={styles.fullWidth}/>
								<textarea placeholder="Comment" value={this.state.newDiscussionContent} onChange={this.updateNewDiscussionContent} style={styles.fullWidth}></textarea>
								<button onClick={this.submitNewDiscussion}>Submit New Discussion</button>
							</div>
						}

					</Sticky>
				</StickyContainer>
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		pubData: state.pub.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Pub));

styles = {
	container: {
		position: 'relative',
		minHeight: '100vh',
	},
	left: {
		marginRight: '35vw',
	},
	right: {
		height: '100%',
		// maxHeight: '100vh',
		backgroundColor: '#f3f3f4',
		width: '35vw',
		position: 'absolute',
		right: 0,
		top: 0,
		boxShadow: 'inset 0px 0px 1px #777',
	},
	rightSticky: {
		height: '100vh',
		overflow: 'hidden',
		overflowY: 'scroll',
	},
	forkHeader: {
		padding: '1em 0em',
		margin: '0em 1.5em',
		borderBottom: '1px solid #CCC',
	},
	forkTitle: {
		fontWeight: 'bold',
	},
	pubTitle: {
		padding: '1em 1em 0em',
		fontSize: '1.5em',
		fontWeight: 'bold',
	},
	pubAuthors: {
		padding: '.5em 1.5em 1em',
	},
	buttonsPR: {
		float: 'right',
		width: '200px',
		margin: '0em 0em 0em .5em',
	},
	buttons: {
		float: 'right',
		width: '200px',
		margin: '1.5em 1.5em 1.5em .5em',
	},
	buttonBig: {
		margin: '2px',
		border: '1px solid #777',
		textAlign: 'center',
		fontSize: '.85em',
		backgroundColor: '#232425',
		color: 'white',
		cursor: 'pointer',

		// display: 'inline-block',
		// width: 'calc(100% - 6)',
	},
	button: {
		margin: '2px',
		border: '1px solid #777',
		display: 'inline-block',
		width: 'calc(50% - 6px)',
		textAlign: 'center',
		fontSize: '.85em',
		cursor: 'pointer',
	},
	nav: {
		borderBottom: '1px solid #ccc',
		boxShadow: '0px 1px 1px 0px #DDD',
		padding: '3em .65em 0em',
	},
	navItem: {
		display: 'inline-block',
		padding: '0em 1em',
		fontSize: '0.85em',
		cursor: 'pointer',
		color: '#333',
	},
	discussionButtonWrapper: {
		textAlign: 'right',
		padding: '1em',
	},
	discussionButton: {
		display: 'inline-block',
		padding: '.25em .5em',
		margin: '0em .5em',
		textAlign: 'center',
		border: '1px solid #777',
		fontSize: '.85em',
	},
	discussionButtonBig: {
		display: 'inline-block',
		padding: '.25em .5em',
		margin: '0em 0em 0em 0.5em',
		textAlign: 'center',
		border: '1px solid #CCC',
		color: 'white',
		backgroundColor: '#232425',
		fontSize: '.85em',
	},
	filter: {
		display: 'inline-block',
		padding: '0em 1em',
		fontSize: '0.85em',
		userSelect: 'none',
	},
	filterInput: {
		margin: '1em 1em 0em',
		padding: '.5em',
		width: 'calc(100% - 2em - 1em)'
	},
	filterHoverBox: {
		backgroundColor: 'white',
		position: 'absolute',
		margin: '0.5em',
		border: '1px solid #777',
		boxShadow: '0px 1px 2px black',
		padding: '.5em',
		width: 'calc(100% - 2px - 1em - 1em)',
		zIndex: 2,
	},
	filterHoverClose: {
		float: 'right',
		cursor: 'pointer',
	},
	discussionStart: {
		margin: '2em',
	},
	discussionContainer: {
		padding: '1em 0em',
		margin: '0em 1em',
		borderTop: '1px solid #BBB',
	},
	discussionTitle: {
		fontWeight: 'bold',
	},
	discussionMeta: {
		color: '#555',
		fontSize: '0.85em',
	},
	discussionLink: {
		color: 'inherit',
		textDecoration: 'none',
	},
	conversationWrapper: {
		padding: '1em',
	},
	conversationItem: {
		marginBottom: '1em',
	},
	newDiscussionWrapper: {
		padding: '1em',
	},
	fullWidth: {
		width: '100%',
	},
	
};
