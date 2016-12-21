import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
let styles = {};

export const ActivityGroup = React.createClass({
	propTypes: {
		activities: PropTypes.array,
	},

	// getInitialState() {
	// 	return {
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},

	render: function() {
		const activity = this.props.activities || [];
		// Activities either all have the same actor, or all have the same target
		const actor = activity.actor || {};
		const verb = activity.verb || '';
		const target = activity.target || {};
		const object = activity.object || {};

		return (
			<div style={styles.container}>
				<div style={styles.imageWrapper}>
					<img src={actor.image} style={styles.image} />
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

export default Radium(ActivityGroup);

styles = {
	container: {
		display: 'table',
		borderTop: '1px solid #EEE',
		marginTop: '0.5em',
		paddingTop: '0.5em', 
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
