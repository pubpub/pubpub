import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
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
		browserHistory.push({ pathname: this.props.pathname, query: { ...this.props.query, filter: newFilter } })
	},

	render: function() {
		const discussionsData = this.props.discussionsData || [];
		const query = this.props.query || {};

		const labelList = ['Review', 'Question', 'Update Request'];
		const sortList = ['Newest', 'Oldest', 'Most Replies', 'Least Replies'];

		const authorsMenu = (
			<Menu>
				<li className={'pt-menu-header'}><h6>Filter by author:</h6></li>
				{query.author && <li><Link to={{pathname: this.props.pathname, query: { ...this.props.query, author: undefined }}} className="pt-menu-item pt-popover-dismiss pt-icon-cross">Clear Author Filter</Link></li>}
				<MenuDivider />
				{discussionsData.map((discussion, index)=> {
					const author = discussion.contributors[0].user;
					return (
						<li key={'authorFilter-' + index}><Link to={{pathname: this.props.pathname, query: { ...this.props.query, author: author.username }}} className="pt-menu-item pt-popover-dismiss">
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + author.image} style={styles.authorImages}/> {author.firstName + ' ' + author.lastName}
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
						<li key={'labelFilter-' + index}><Link to={{pathname: this.props.pathname, query: { ...this.props.query, label: label }}} className="pt-menu-item pt-popover-dismiss">
							{label}
							{query.label === label && <span className={'pt-icon-standard pt-icon-tick pt-menu-item-label'} />}
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
						<li key={'sortFilter-' + index}><Link to={{pathname: this.props.pathname, query: { ...this.props.query, sort: sort }}} className="pt-menu-item pt-popover-dismiss">
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
					<PubDiscussionsListFilterButton content={authorsMenu} title={'Authors'} position={0} />
					<PubDiscussionsListFilterButton content={labelMenu} title={'Label'} position={1} />
					<PubDiscussionsListFilterButton content={sortMenu} title={'Sort'} position={2} />
				</div>
				
				{discussionsData.map((discussion, index)=> {
					const author = discussion.contributors[0].user;
					return (
						<div style={styles.discussionItem} key={'discussionItem-' + index} className={'pt-card pt-elevation-1'}>
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
	buttonGroup: {
		marginBottom: '2em',
	},
	discussionItem: {
		// borderBottom: '1px solid #CCC',
		padding: '.5em',
		// margin: '1em0em 0em',
		// border: '1px solid #ccc',
		// backgroundColor: 'white',
		borderRadius: '1px',
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
