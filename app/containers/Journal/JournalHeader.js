import React, { PropTypes } from 'react';
import Radium from 'radium';
import { globalStyles } from 'utils/globalStyles';
import { Link } from 'react-router';

let styles = {};

export const JournalProfileHeader = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		headerColor: PropTypes.string,
		headerImage: PropTypes.string,
		headerMode: PropTypes.string,
		headerAlign: PropTypes.string,
		followContent: PropTypes.node,
	},

	render: function() {
		const journal = this.props.journal || {};
		const customBackgroundStyle = {
			backgroundColor: this.props.headerColor || '#13A6EF',
			backgroundImage: this.props.headerImage ? 'url("' + this.props.headerImage + '")' : '',
			textAlign: this.props.headerAlign || 'left',
		};

		// const collections = this.props.collections || [];
		return (
			<div style={[styles.headerBackground, customBackgroundStyle]}>
				<div style={styles.backgroundGrey} />
				<div style={styles.headerContent}>
					{this.props.followContent}

					<div style={styles.headerTextWrapper}>
						{(this.props.headerMode === 'logo' || this.props.headerMode === 'both') &&
							<Link to={'/' + journal.slug} style={globalStyles.link}><img style={styles.logoImage} src={journal.logo} /></Link>
						}

						{(this.props.headerMode !== 'logo') &&
							<Link to={'/' + journal.slug} style={globalStyles.link}><h1 style={[styles.headerTitle]}>{journal.name}</h1></Link>
						}

						{(this.props.headerMode !== 'logo') &&
							<p>{journal.description}</p>
						}

					</div>
				</div>

				<div style={styles.bottom}>
					<Link style={styles.collectionLink} to={'/' + journal.slug}>Home</Link>
					<Link style={styles.aboutLink} to={'/' + journal.slug + '/about'}>About</Link>
					{journal.website &&
						<Link to={journal.website} style={styles.collectionLink}>{journal.website}</Link>
					}
					{journal.twitter &&
						<Link to={'https://twitter.com/' + journal.twitter} style={styles.collectionLink}>@{journal.twitter}</Link>
					}
					{journal.facebook &&
						<Link to={'https://facebook.com/' + journal.facebook} style={styles.collectionLink}>facebook.com/{journal.facebook}</Link>
					}
				</div>

			</div>
		);
	}

});

export default Radium(JournalProfileHeader);

styles = {
	headerBackground: {
		padding: '2em 0em 1em 0em',
		marginBottom: '2em',
		position: 'relative',
		color: 'white',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginBottom: '0em',
		}
	},
	backgroundGrey: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.15)',
		top: 0,
		left: 0,
		zIndex: 1,
	},
	headerContent: {
		position: 'relative',
		padding: '3em 2em',
		margin: '0 auto',
		maxWidth: '1024px',
	},
	headerTextWrapper: {
		position: 'relative',
		zIndex: 2,
	},
	headerTitle: {
		color: 'white',
	},
	bottom: {
		maxWidth: '1024px',
		padding: '0em 2em',
		margin: '0 auto',
		color: 'white',
		zIndex: 3,
		position: 'relative',
	},
	aboutLink: {
		color: 'inherit',
		paddingRight: '4em',
	},
	collectionLink: {
		color: 'inherit',
		paddingRight: '1em',
	},
	logoImage: {
		maxWidth: '100%',
		maxHeight: '150px',
	},
	followButtonStyle: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 1,
		backgroundColor: 'transparent',
		color: 'white',
		borderColor: 'white',
		':hover': {
			backgroundColor: '#2C2A2B',
			borderColor: '#2C2A2B',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			top: 'auto',
			bottom: 0,
			display: 'block',
			left: '10%',
			right: '10%',
		}
	},
};
