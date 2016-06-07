import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Link} from 'react-router';
import {globalStyles} from 'utils/styleConstants';
let styles = {};

export const PreviewCard = React.createClass({
	propTypes: {
		type: PropTypes.string,
		image: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		slug: PropTypes.string,
		onFollowHandler: PropTypes.func,
		showEdit: PropTypes.bool,
	},


	render: function() {
		const href = '/';
		return (
			<div style={styles.container}>
				
				{/* Preview card image */}
				<div style={[styles.tableCell, styles.edges]}>
					<Link to={href} style={globalStyles.link}>
						<img style={styles.image} src={this.props.image} alt={this.props.title}/>
					</Link>
				</div>
				
				{/* Render text here on non-mobile (hacky - but it works for now) */}
				<div style={[styles.tableCell, styles.noMobile]}>
					<Link to={href} style={globalStyles.link}>
						<h3 style={styles.title}>{this.props.title}</h3>
					</Link>
					<p style={styles.description}>{this.props.description}</p>
				</div>

				{/* Option Buttons */}
				<div style={[styles.tableCell, styles.edges]}>
					<div className={'button'} style={[styles.button, styles.follow]}>Follow</div>
					<div className={'button'} style={[styles.button]}>Edit</div>
				</div>

				{/* Render text here on mobile (hacky - but it works for now) */}
				<div style={[styles.tableCell, styles.yesMobile]}>
					<Link to={href} style={globalStyles.link}>
						<h3 style={styles.title}>{this.props.title}</h3>
					</Link>
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
		border: '1px solid #BBBDC0',
		display: 'table',
		margin: '1em',
		backgroundColor: 'white',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	image: {
		width: '4em',
	},
	button: {
		display: 'block',
		textAlign: 'center',
		padding: '.1em 2em',
		fontSize: '.8em',
		marginBottom: '.5em',
	},
	follow: {
		minWidth: '5em', // Need min width so Follow -> Following doesn't cause resize
	},
	tableCell: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '.5em',
	},
	edges: {
		width: '1%',
	},
	title: {
		margin: 0,
	},
	description: {
		fontSize: '.9em',
		margin: '.5em 0em',
	},
	noMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	yesMobile: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
};
