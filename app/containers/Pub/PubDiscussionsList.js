import React, { PropTypes } from 'react';
import { Link } from 'react-router';
let styles;

export const PubDiscussionsList = React.createClass({
	propTypes: {
		discussionsData: PropTypes.array,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	render: function() {
		const discussionsData = this.props.discussionsData || [];

		return (
			<div style={styles.container}>
				<h3>Discussions</h3>
				
				{discussionsData.map((discussion)=> {
					return (
						<div>
							<Link to={{pathname: this.props.pathname, query: { ...this.props.query, discussion: discussion.discussionIndex }}}>
							<h3>{discussion.discussionIndex} | {discussion.title}</h3>
							<p>{discussion.createdAt}</p>
							</Link>
						</div>
					);
				})}

			</div>
		);
	}
});

export default PubDiscussionsList;

styles = {
	container: {
		
	},
};
