import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Menu, MenuDivider } from '@blueprintjs/core';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import PubLabelList from './PubLabelList';
import fuzzysearch from 'fuzzysearch';
import { FormattedRelative } from 'react-intl';

let styles;

export const PubDiscussionsList = React.createClass({
	propTypes: {
		discussionsData: PropTypes.array,
		pub: PropTypes.object,
		showAllDiscussions: PropTypes.bool,
		toggleShowAllDiscussions: PropTypes.func,
		// showClosedDiscussions: PropTypes.bool,
		// toggleShowClosedDiscussions: PropTypes.func,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			filter: '',
		};
	},

	componentWillMount() {
		const query = this.props.query;
		this.setState({ filter: query.filter || '' });
	},

	componentWillReceiveProps(nextProps) {
		const query = nextProps.query;
		this.setState({ filter: query.filter || '' });
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	filterSubmit: function(evt) {
		evt.preventDefault();
		const newFilter = this.state.filter.length ? this.state.filter : undefined;
		browserHistory.push({ pathname: this.props.pathname, query: { ...this.props.query, filter: newFilter } });
	},

	

	render: function() {
		const discussionsData = this.props.discussionsData || [];
		const query = this.props.query || {};
		const pathname = this.props.pathname;
		const allAuthors = [
			...discussionsData.map((discussion)=> {
				return discussion.contributors[0].user;
			}),
			...discussionsData.reduce((previous, current)=> {
				return [
					...previous, 
					...current.children.map((discussion)=> {
						return discussion.contributors[0].user;
					})
				];
			}, [])
		];
		const uniqueAuthorIds = {};
		const uniqueAuthors = allAuthors.filter((author)=> {
			if (author.id in uniqueAuthorIds === false) {
				uniqueAuthorIds[author.id] = true;
				return true;
			}
			return false;
		});
		const filteredDiscussions = discussionsData.filter((discussion)=> {
			let keepResult = true;
			const children = discussion.children || [];
			if (query.label) {
				const discussionLabels = discussion.labels.map((label)=> {
					return label.title;
				});
				keepResult = discussionLabels.includes(query.label) && keepResult;
			}
			if (query.author) {
				const discussionAuthors = [
					discussion.contributors[0].user.username,
					...children.map((child)=> {
						return child.contributors[0].user.username;
					})
				];
				keepResult = discussionAuthors.includes(query.author) && keepResult;
			}

			if (query.filter) {
				const threadText = children.reduce((previous, current)=> {
					return previous + ' ' + current.description + ' ';
				}, discussion.title + ' ' + discussion.description + ' ');

				keepResult = fuzzysearch(query.filter, threadText);
			}
			return keepResult;
		});

		const pub = this.props.pub || {};
		const invitedReviewers = pub.invitedReviewers || [];
		const labelList = pub.pubLabels || [];
		const sortList = ['Newest', 'Oldest', 'Most Replies', 'Least Replies'];

		const authorsMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Filter by author:</h6></li>
				{query.author && <li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, author: undefined }}} className="pt-menu-item pt-popover-dismiss pt-icon-cross">Clear Author Filter</Link></li>}
				<MenuDivider />
				{uniqueAuthors.map((author, index)=> {
					return (
						<li key={'authorFilter-' + index}><Link to={{pathname: this.props.pathname, query: { ...this.props.query, author: author.username }}} className="pt-menu-item pt-popover-dismiss">
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + author.avatar} style={styles.authorImages}/> {author.firstName + ' ' + author.lastName}
							{query.author === author.username && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
							
						</Link></li>
					);
				})}
			</Menu>
		);

		const labelMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Filter by label:</h6></li>
				{query.label && <li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, label: undefined }}} className="pt-menu-item pt-popover-dismiss pt-icon-cross">Clear Label Filter</Link></li>}
				<MenuDivider />
				{labelList.map((label, index)=> {
					return (
						<li key={'labelFilter-' + index}><Link to={{pathname: this.props.pathname, query: { ...this.props.query, label: label.title }}} className="pt-menu-item pt-popover-dismiss">
							<span style={[styles.labelColor, { backgroundColor: label.color }]} /> {label.title}
							{query.label === label.title && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
						</Link></li>
					);
				})}
			</Menu>
		);

		const sortMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Sort by:</h6></li>
				<MenuDivider />
				{sortList.map((sort, index)=> {
					const sortMode = query.sort || 'Newest';
					return (
						<li key={'sortFilter-' + index}><Link to={{ pathname: this.props.pathname, query: { ...this.props.query, sort: sort } }} className="pt-menu-item pt-popover-dismiss">
							{sort}
							{sortMode === sort && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
						</Link></li>
					);
				})}
			</Menu>
		);

		const initDiscussionCount = 5;
		return (

			<div style={styles.container}>
				<div style={styles.header}>
					<div style={{ textAlign: 'right' }}>
						<div className="pt-button-group small-button" style={styles.topButton}>
							<Link to={{ pathname: `/pub/${pub.slug}/reviewers`, query: { ...query } }} className="pt-button">Invite Reviewer</Link>
							<Link to={{ pathname: `/pub/${pub.slug}/reviewers`, query: { ...query } }} className="pt-button">{invitedReviewers.length}</Link>
						</div>

						<Link to={{ pathname: pathname, query: { ...query, panel: 'new' } }} className="pt-button small-button pt-icon-add" style={styles.topButton}>New Discussion</Link>

						<div style={{ textAlign: 'right', opacity: 0, pointerEvents: 'none' }}>
							<button role={'button'} className={'pt-button pt-minimal pt-icon-filter-list'}>Filter</button>	
						</div>
						
					</div>
				</div>

				<div style={styles.contentBorder(this.props.showAllDiscussions, true)} />
				<div style={styles.content(this.props.showAllDiscussions)}>

					{filteredDiscussions.sort((foo, bar)=> {
						const fooChildren = foo.children || [];
						const barChildren = bar.children || [];

						const newest = !query.sort || query.sort === 'Newest';
						const oldest = query.sort === 'Oldest';

						const mostReplies = query.sort === 'Most Replies';
						const leastReplies = query.sort === 'Least Replies';

						if (newest && foo.createdAt > bar.createdAt) { return -1; }
						if (newest && foo.createdAt < bar.createdAt) { return 1; }

						if (oldest && foo.createdAt > bar.createdAt) { return 1; }
						if (oldest && foo.createdAt < bar.createdAt) { return -1; }

						if (mostReplies && fooChildren.length > barChildren.length) { return -1; }
						if (mostReplies && fooChildren.length < barChildren.length) { return 1; }

						if (leastReplies && fooChildren.length > barChildren.length) { return 1; }
						if (leastReplies && fooChildren.length < barChildren.length) { return -1; }

						return 0;
					}).filter((item, index)=> {
						if (!this.props.showAllDiscussions && index >= initDiscussionCount) { return false; }
						if (!this.props.showClosedDiscussions && item.isClosed) { return false; }
						return true;
					}).map((discussion, index)=> {
						const author = discussion.contributors[0].user;
						const labels = discussion.labels || [];
						const children = discussion.children || [];
						const discussionAuthors = [...new Set([
							discussion.contributors[0].user.avatar,
							...children.map((child)=> {
								return child.contributors[0].user.avatar;
							})
						])];
						return (
							<div style={[styles.discussionItem, index === 0 && { margin: '0em' }]} key={'discussionItem-' + discussion.id} className={'ptt-card ptt-elevation-1'}>
								<div style={styles.discussionSeparator} />
								<PubLabelList 
									allLabels={labelList} 
									selectedLabels={labels} 
									canEdit={false} 
									pathname={this.props.pathname} 
									query={this.props.query} 
									labelStyle={{ opacity: 0.75, fontSize: '10px', lineHeight: '12px' }} />

								<Link to={{pathname: this.props.pathname, query: { ...this.props.query, discussion: discussion.threadNumber }}} style={styles.discussionTitle}>
									<span style={styles.threadNumber}>#{discussion.threadNumber}</span>
									{discussion.title}
								</Link>

								<div>
									{!discussion.isPublished && 
										<span className={'pt-icon-standard pt-icon-lock'} />
									}
									{discussion.isClosed && 
										<span className={'pt-icon-standard pt-icon-compressed'} />
									}
									<span style={{ fontSize: '0.85em' }}>
										<FormattedRelative value={discussion.createdAt} />	
									</span>
									
									{discussionAuthors.map((image, imageIndex)=> {
										return <img src={'https://jake.pubpub.org/unsafe/50x50/' + image} style={[styles.authorImages, {zIndex: discussionAuthors.length - imageIndex}, imageIndex === 0 && {marginLeft: '1em'}]} key={'discussionImage-' + discussion.id + '-' + imageIndex}/>;
									})}
								</div>
								
							</div>
						);
					})}

					{filteredDiscussions.length - initDiscussionCount > 0 &&
						<div style={styles.toggleButtonWrapper}>
							<button role={'button'} onClick={this.props.toggleShowAllDiscussions} className={'pt-button small-button'}>Show {this.props.showAllDiscussions ? 'Fewer' : `${filteredDiscussions.length - initDiscussionCount} More`}</button>	
						</div>
					}

					{/*(filteredDiscussions.length - initDiscussionCount <= 0 || this.props.showAllDiscussions) &&
						<div style={styles.toggleButtonWrapper}>
							<button role={'button'} onClick={this.props.toggleShowClosedDiscussions} className={'pt-button small-button'}>{`${this.props.showClosedDiscussions ? 'Hide' : 'Show'} Closed Discussions`}</button>	
						</div>
					*/}

				</div>

				<div style={styles.contentBorder(this.props.showAllDiscussions, false)} />




			{/* <form onSubmit={this.filterSubmit}>
				<input type="text" placeholder={'Filter discussions'} style={styles.input} value={this.state.filter} onChange={this.inputUpdate.bind(this, 'filter')} />
			</form>
			
			<div className="pt-button-group" style={styles.buttonGroup}>
				<DropdownButton content={authorsMenu} title={'Authors'} position={0} />
				<DropdownButton content={labelMenu} title={'Label'} position={1} />
				<DropdownButton content={sortMenu} title={'Sort'} position={2} />
			</div> */}
				

			</div>
		);
	}
});

export default Radium(PubDiscussionsList);

styles = {
	container: {
		height: '100%',
		width: '100%',
		position: 'relative',
	},
	header: {
		padding: '10px 0px', 
		height: '70px', 
		width: '100%',
	},
	content: (showAllDiscussions)=> {
		return {
			maxHeight: 'calc(100vh - 80px)', 
			width: '100%', 
			overflow: showAllDiscussions ? 'hidden' : 'visible', 
			overflowY: showAllDiscussions ? 'scroll' : 'visible', 
			position: 'relative',
		};
		
	},

	toggleButtonWrapper: {
		padding: '2em 0em',
		textAlign: 'right',
	},

	contentBorder: (isVisible, isTop)=> {
		return {
			opacity: isVisible ? 1 : 0,
			transition: '0.1s linear opacity',
			height: '1px',
			width: '100%',
			position: 'absolute',
			zIndex: 2,
			boxShadow: isTop ? '0px -1px 1px rgba(0,0,0,0.5)' : '0px 1px 1px rgba(0,0,0,0.5)',
		};
	},

	topButton: {
		marginLeft: '0.5em',
		verticalAlign: 'top',
	},
	labelColor: {
		display: 'inline-block',
		width: '1.25em',
		height: '1.25em',
		borderRadius: '2px',
		verticalAlign: 'middle',
	},
	discussionItem: {
		margin: '1em 0em 0em',
		padding: '1em 0em 0em',
		// padding: '.5em',
		// margin: '.5em 0em',
		// backgroundColor: '#f3f3f4',
		// borderRadius: '1px',
		textAlign: 'right',
		position: 'relative',
	},
	discussionSeparator: {
		width: '50%',
		maxWidth: '150px',
		height: '1px',
		backgroundColor: '#EBF1F5',
		position: 'absolute',
		top: 0,
		right: 0,
	},
	discussionTitle: {
		// fontWeight: 'bold',
		fontSize: '1.1em',
		color: '#202b33',
		display: 'block',

	},
	threadNumber: {
		opacity: '0.25', 
		fontSize: '0.9em', 
		textDecoration: 'none', 
		display: 'inline-block', 
		paddingRight: '.25em',
	},
	authorImages: {
		width: '20px',
		verticalAlign: 'middle',
		marginLeft: '-8px',
		borderRadius: '20px',
		// boxShadow: '0px 0px 1px 0px #000',
		boxShadow: '0px 0px 0px px #fff',
		position: 'relative',
	},
	input: {
		width: '100%',
		marginBottom: '0em',
	},
};
