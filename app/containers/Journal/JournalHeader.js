import React, { PropTypes } from 'react';
import Radium from 'radium';
import { globalStyles } from 'utils/globalStyles';
import Link from 'components/Link/Link';

let styles = {};

export const JournalProfileHeader = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		logo: PropTypes.string,
		headerColor: PropTypes.string,
		headerImage: PropTypes.string,
		headerMode: PropTypes.string,
		headerAlign: PropTypes.string,
		followContent: PropTypes.node,
	},

	render: function() {
		const journal = this.props.journal || {};
		const headerAlign = this.props.headerAlign;
		const customBackgroundStyle = {
			backgroundColor: this.props.headerColor || '#13A6EF',
			backgroundImage: this.props.headerImage ? 'url("' + this.props.headerImage + '")' : '',
			textAlign: this.props.headerAlign || 'left',
		};

		let journalUrl = journal.website || '';
		journalUrl = journalUrl.slice(0, 7) === 'http://' || journalUrl.slice(0, 8) === 'https://' ? journalUrl : `http://${journalUrl}`;

		return (
			<div style={[styles.headerBackground, customBackgroundStyle]}>
				<div style={styles.backgroundGrey} />
				<div style={styles.headerContent}>
					{this.props.followContent}

					<div style={styles.headerTextWrapper}>
						{(this.props.headerMode === 'logo' || this.props.headerMode === 'both') &&
							<Link to={'/' + journal.slug} toJournal={true} customDomain={journal.customDomain} style={globalStyles.link}><img style={styles.logoImage} src={this.props.logo} /></Link>
						}

						{(this.props.headerMode !== 'logo') &&
							<Link to={'/' + journal.slug} toJournal={true} customDomain={journal.customDomain} style={globalStyles.link}><h1 style={[styles.headerTitle]}>{journal.title}</h1></Link>
						}

						{/*(this.props.headerMode !== 'logo') &&
							<p>{journal.description}</p>
						*/}
						<p>{journal.description}</p>

					</div>
				</div>

				<div style={styles.bottom}>
					{/* <Link style={headerAlign === 'left' ? styles.pageLinkLeft : styles.pageLinkCenter} to={'/' + journal.slug}>Home</Link>
					<Link style={headerAlign === 'left' ? styles.pageLinkLeft : styles.pageLinkCenter} to={'/' + journal.slug + '/about'}>About</Link> */}
					{journal.website &&
						<a href={journalUrl} style={headerAlign === 'left' ? styles.pageLinkLeft : styles.pageLinkCenter}><span className={'pt-icon-large pt-icon-globe'} /></a>
					}
					{journal.twitter &&
						<a href={'https://twitter.com/' + journal.twitter} style={headerAlign === 'left' ? styles.pageLinkLeft : styles.pageLinkCenter}><span className={'pt-icon-large pt-icon-twitter'} /></a>
					}
					{journal.facebook &&
						<a href={'https://facebook.com/' + journal.facebook} style={headerAlign === 'left' ? styles.pageLinkLeft : styles.pageLinkCenter}><span className={'pt-icon-large pt-icon-facebook'} /></a>
					}
				</div>

			</div>
		);
	}

});

export default Radium(JournalProfileHeader);

styles = {
	headerBackground: {
		padding: '5em 0em 2em 0em',
		marginBottom: '2em',
		position: 'relative',
		color: 'white',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundSize: 'cover',
		minHeight: '400px',
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
		padding: '0em 2em',
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
	headerSpacer: {
		display: 'inline-block',
		width: '4em',
	},
	pageLinkLeft: {
		color: 'inherit',
		paddingRight: '1em',
	},
	pageLinkCenter: {
		color: 'inherit',
		padding: '0em 0.5em',
	},
	logoImage: {
		maxWidth: '100%',
		maxHeight: '150px',
	},
	followButtonStyle: {
		position: 'absolute',
		// top: 0,
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
