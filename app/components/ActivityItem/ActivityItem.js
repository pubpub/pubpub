import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
let styles = {};

export const ActivityItem = React.createClass({
	propTypes: {
		activity: PropTypes.object,
	},

	// getInitialState() {
	// 	return {
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},

	render: function() {
		const activity = this.props.activity || {
			createdAt: '2016-12-02 16:42:29.488+00',
		};
		const actor = activity.actor || {
			image: 'https://assets.pubpub.org/_testing/1481721551672.jpg',
			firstName: 'Maria',
			lastName: 'Osuega',
			username: 'test4',
		};
		const verb = activity.verb || 'created';
		const target = activity.target || {
			slug: 'jokes',
			title: 'Elephants and Panda Jokes',
		};
		const object = activity.object || {};

		return (
			<div style={styles.container}>
				<div style={styles.imageWrapper}>
					<img src={actor.image} style={styles.image}/>
				</div>
				
				<div style={styles.detailsWrapper}>
					<div style={styles.date}>yesterday</div>
					<Link to={'/user/' + actor.username} style={styles.link}>{actor.firstName + ' ' + actor.lastName} </Link>
					<span>created </span>
					<Link to={'/pub/' + target.slug} style={styles.link}>{target.title}</Link>
					
				</div>
			</div>
		);
	}
});

export default Radium(ActivityItem);

styles = {
	container: {
		display: 'table',
		borderTop: '1px solid #EEE',
		marginTop: '0.5em',
		paddingTop: '0.5em', 
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		paddingRight: '1em',
		width: '1%',
	},
	detailsWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	image: {
		width: '35px',
	},
	link: {
		fontWeight: 'bold',
	},
	date: {
		fontSize: '0.9em',
		color: '#777',
	},
};
