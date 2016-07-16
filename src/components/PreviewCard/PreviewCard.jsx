import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Link as UnwrappedLink} from 'react-router';
const Link = Radium(UnwrappedLink);

import {globalStyles} from 'utils/styleConstants';
let styles = {};

export const PreviewCard = React.createClass({
	propTypes: {
		type: PropTypes.string,
		image: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		slug: PropTypes.string,
		// onFollowHandler: PropTypes.func,
		// showEdit: PropTypes.bool,
		buttons: PropTypes.array,
		header: PropTypes.object,
		footer: PropTypes.object,
	},


	render: function() {
		const defaultImages = {
			atom: 'https://assets.pubpub.org/_site/pub.png',
			journal: 'https://assets.pubpub.org/_site/journal.png',
			user: 'https://assets.pubpub.org/_site/happyPub.png',
		};
		const image = this.props.image || defaultImages[this.props.type];
		let href;
		switch (this.props.type) {
		case 'atom':
			href = '/a/' + this.props.slug; break;
		case 'journal':
			href = '/' + this.props.slug; break;
		case 'user':
			href = '/user/' + this.props.slug; break;
		default:
			href = '/'; break;

		}
		const buttons = this.props.buttons || [];

		return (
			<div style={styles.container}>
				{/* Custom Header content, for notifcations, details etc */}
				<div style={[styles.header, !this.props.header && {display: 'none'}]}>
					{this.props.header}
				</div>

				<div style={styles.table}>

					{/* Preview card image */}
					<div style={[styles.tableCell, styles.edges]}>
						<Link to={href} style={globalStyles.link}>
							<img style={styles.image} src={'https://jake.pubpub.org/unsafe/100x100/' + image} alt={this.props.title}/>
						</Link>
					</div>

					{/* Render text here on non-mobile (hacky - but it works for now) */}
					<div style={[styles.tableCell, styles.noMobile]}>
						<Link to={href} style={globalStyles.link} className={'underlineOnHover'}>
							<h3 style={styles.title}>{this.props.title}</h3>
						</Link>
						<p style={styles.description}>{this.props.description}</p>
					</div>

					{/* Option Buttons */}
					<div style={[styles.tableCell, styles.edges]}>
						{/* <div className={'button'} style={[styles.button, this.props.showEdit && {display: 'none'}]}>Follow</div>
						<Link to={href + '/edit'} className={'button'} style={[styles.button, !this.props.showEdit && {display: 'none'}]}>Edit</Link> */}
						{buttons.map((item, index)=>{
							if (React.isValidElement(item)) {
								return item;
							} else if (item.link) {
								return <Link className={'button'} to={item.link} style={styles.button} key={'previewCard-button-' + index} >{item.text}</Link>;
							} else if (item.action) {
								return <div className={'button'} onClick={item.action} style={styles.button} key={'previewCard-button-' + index}>{item.text}</div>;
							}
						})}
					</div>

					{/* Render text here on mobile (hacky - but it works for now) */}
					<div style={[styles.tableCell, styles.yesMobile]}>
						<Link to={href} style={globalStyles.link}>
							<h3 style={styles.title}>{this.props.title}</h3>
						</Link>
						<p style={styles.description}>{this.props.description}</p>
					</div>
				</div>

				{/* Custom Footer content, for notifcations, details etc */}
				<div style={[styles.footer, !this.props.footer && {display: 'none'}]}>
					{this.props.footer}
				</div>


			</div>
		);
	}
});

export default Radium(PreviewCard);

styles = {
	container: {
		width: '100%',
		border: '1px solid #BBBDC0',
		borderRadius: '1px',
		margin: '1em 0em',
		backgroundColor: 'white',
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
		minWidth: '5em', // Need min width so Follow -> Following doesn't cause resize
		whiteSpace: 'nowrap',
	},
	table: {
		display: 'table',
		width: '100%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
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
	header: {
		fontSize: '0.9em',
		margin: '0em .5em .25em .5em',
		padding: '.5em 0em',
		borderBottom: '1px solid #F3F3F4',
	},
	footer: {
		fontSize: '0.9em',
		margin: '0.25em .5em 0em .5em',
		padding: '.5em 0em',
		borderTop: '1px solid #F3F3F4',
	},
};
