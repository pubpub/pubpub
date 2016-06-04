import React, {PropTypes} from 'react';
import Radium from 'radium';
let styles = {};

export const PreviewCard = React.createClass({
	propTypes: {
		targetBlank: PropTypes.bool,
		type: PropTypes.string,
		image: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		onFollowHandler: PropTypes.func,
	},


	render: function() {

		return (
			<div style={styles.container}>
				
				<div style={styles.left}>
					<img style={styles.image} src={this.props.image} alt={this.props.title}/>
					<div className={'button'} style={styles.follow}>Follow</div>
				</div>
				<div style={styles.right}>
					<h2 style={styles.title}>{this.props.title}</h2>
					<p style={styles.description}>{this.props.description}</p>
				</div>

			</div>
		);
	}
});

export default Radium(PreviewCard);

styles = {
	container: {
		width: 'calc(100% - 2em)',
		border: '1px solid #363736',
		display: 'table',
		margin: '1em',
		backgroundColor: 'white',
	},
	image: {
		width: '5em',
	},
	follow: {
		display: 'block',
		width: 'calc(5em - 4px)',
		textAlign: 'center',
		padding: '.1em 0em',
	},
	left: {
		display: 'table-cell',
		width: '1%',
		padding: '.5em',
	},
	right: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '.5em',
	},
	title: {
		marginTop: 0,
	}
};
