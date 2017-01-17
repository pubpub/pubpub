import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Menu, MenuDivider } from '@blueprintjs/core';
import { DropdownButton } from 'components';
import PubLabelList from './PubLabelList';
import fuzzysearch from 'fuzzysearch';

let styles;

export const PubDiscussionsList = React.createClass({
	propTypes: {
		discussionsData: PropTypes.array,
		pub: PropTypes.object,
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

		return (
			<div style={styles.container}>
				<form onSubmit={this.filterSubmit}>
					<input type="text" placeholder={'Filter discussions'} style={styles.input} value={this.state.filter} onChange={this.inputUpdate.bind(this, 'filter')} />
				</form>
				
				<div className="pt-button-group" style={styles.buttonGroup}>
					<DropdownButton content={authorsMenu} title={'Authors'} position={0} />
					<DropdownButton content={labelMenu} title={'Label'} position={1} />
					<DropdownButton content={sortMenu} title={'Sort'} position={2} />
				</div>
				
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
						<div style={styles.discussionItem} key={'discussionItem-' + discussion.id} className={'pt-card pt-elevation-1'}>
							
							<Link to={{pathname: this.props.pathname, query: { ...this.props.query, discussion: discussion.threadNumber }}} style={styles.discussionTitle}>
								<span style={styles.threadNumber}>#{discussion.threadNumber}</span>
								{discussion.title}
							</Link>

							<PubLabelList 
								allLabels={labelList} 
								selectedLabels={labels} 
								canEdit={false} 
								pathname={this.props.pathname} 
								query={this.props.query} />

							<div>{!discussion.isPublished && <span className={'pt-icon-standard pt-icon-lock'} />}{dateFormat(discussion.createdAt, 'mmmm dd, yyyy')} | by {author.firstName + ' ' + author.lastName} | Replies: {children.length}</div>

							{discussionAuthors.map((image, imageIndex)=> {
								return <img src={'https://jake.pubpub.org/unsafe/50x50/' + image} style={styles.authorImages} key={'discussionImage-' + discussion.id + '-' + imageIndex}/>;
							})}
							
						</div>
					);
				})}

			</div>
		);
	}
});

export default Radium(PubDiscussionsList);

styles = {
	buttonGroup: {
		marginBottom: '2em',
	},
	labelColor: {
		display: 'inline-block',
		width: '1em',
		height: '1em',
		borderRadius: '2px',
		verticalAlign: 'middle',
	},
	discussionItem: {
		padding: '.5em',
		backgroundColor: '#f3f3f4',
		borderRadius: '1px',
	},
	discussionTitle: {
		fontWeight: 'bold',
		fontSize: '1.25em',
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
	},
	input: {
		width: '100%',
		marginBottom: '0em',
	},
};
