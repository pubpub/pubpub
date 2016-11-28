import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from 'components/Blueprint';
import PubDiscussionsListFilterButton from './PubDiscussionsListFilterButton';

let styles;

export const PubDiscussionsList = React.createClass({
	propTypes: {
		discussionsData: PropTypes.array,
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
		let filter = '';
		if (query.author) { filter += 'author:' + query.author + ' '; }
		if (query.label) { filter += 'label:' + query.label + ' '; }
		if (query.sort) { filter += 'sort:' + query.sort + ' '; }

		this.setState({ filter: filter });
	},

	componentWillReceiveProps(nextProps) {
		const query = nextProps.query;
		let filter = '';
		if (query.author) { filter += 'author:' + query.author + ' '; }
		if (query.label) { filter += 'label:' + query.label + ' '; }
		if (query.sort) { filter += 'sort:' + query.sort + ' '; }
		this.setState({ filter: filter });
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	filterSubmit: function(evt) {
		evt.preventDefault();
		console.log(this.state.filter);
	},

	render: function() {
		const discussionsData = this.props.discussionsData || [];
		console.log(this.props.query);
		console.log(this.props.query.label);
		const authorsMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Filter by author:</h6></li>
				<MenuDivider />
				{discussionsData.map((discussion, index)=> {
					const author = discussion.contributors[0].user;
					return (
						<li key={'authorFilter-' + index}><Link to={{pathname: this.props.pathname, query: { ...this.props.query, author: author.username }}} className="pt-menu-item pt-popover-dismiss">
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + author.image} style={styles.authorImages}/> {author.firstName + ' ' + author.lastName}
						</Link></li>
					);
				})}
			</Menu>
		);
		const labelMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Filter by label:</h6></li>
				<MenuDivider />
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, label: 'Review' }}} className="pt-menu-item pt-popover-dismiss">Review</Link></li>
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, label: 'Question' }}} className="pt-menu-item pt-popover-dismiss">Question</Link></li>
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, label: 'Update Request' }}} className="pt-menu-item pt-popover-dismiss">Update Request</Link></li>
			</Menu>
		);
		const sortMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Sort by:</h6></li>
				<MenuDivider />
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, sort: 'newest' }}} className="pt-menu-item pt-popover-dismiss">Newest</Link></li>
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, sort: 'oldest' }}} className="pt-menu-item pt-popover-dismiss">Oldest</Link></li>
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, sort: 'most-replies' }}} className="pt-menu-item pt-popover-dismiss">Most Replies</Link></li>
				<li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, sort: 'least-replies' }}} className="pt-menu-item pt-popover-dismiss">Least Replies</Link></li>
			</Menu>
		);

		return (
			<div style={styles.container}>
				<form onSubmit={this.filterSubmit}>
					<input type="text" placeholder={'Filter discussions'} style={styles.input} value={this.state.filter} onChange={this.inputUpdate.bind(this, 'filter')} />
				</form>
				
				<div className="pt-button-group">
					<PubDiscussionsListFilterButton content={authorsMenu} title={'Authors'} position={0} />
					<PubDiscussionsListFilterButton content={labelMenu} title={'Label'} position={1} />
					<PubDiscussionsListFilterButton content={sortMenu} title={'Sort'} position={2} />
				</div>
				
				{discussionsData.map((discussion, index)=> {
					const author = discussion.contributors[0].user;
					return (
						<div style={styles.discussionItem} key={'discussionItem-' + index}>
							<Link to={{pathname: this.props.pathname, query: { ...this.props.query, discussion: discussion.discussionIndex }}} style={styles.discussionTitle}>{discussion.title}</Link>
							<div>#{discussion.discussionIndex} | {dateFormat(discussion.createdAt, 'mmmm dd, yyyy')} | by {author.firstName + ' ' + author.lastName}</div>
							<div>
								<img src={'https://jake.pubpub.org/unsafe/50x50/' + author.image} style={styles.authorImages}/>
							</div>
						</div>
					);
				})}

			</div>
		);
	}
});

export default Radium(PubDiscussionsList);

styles = {
	discussionItem: {
		borderBottom: '1px solid #CCC',
		padding: '1em 0em',
		margin: '0em 0em 1em',
	},
	discussionTitle: {
		fontWeight: 'bold',
		fontSize: '1.25em',
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
