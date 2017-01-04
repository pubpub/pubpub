import React, { PropTypes } from 'react';
import Radium from 'radium';
import { globalStyles } from 'utils/globalStyles';
import { Link } from 'react-router';

let styles = {};

export const JournalProfileHeader = React.createClass({
	propTypes: {
		journalName: PropTypes.string,
		journalSlug: PropTypes.string,
		journalID: PropTypes.number,
		isFollowing: PropTypes.bool,
		description: PropTypes.string,
		logo: PropTypes.string,
		collections: PropTypes.array,
		headerColor: PropTypes.string,
		headerImage: PropTypes.string,
		headerMode: PropTypes.string,
		headerAlign: PropTypes.string,
		followContent: PropTypes.node,
	},

	render: function() {
		const customBackgroundStyle = {
			backgroundColor: this.props.headerColor || '#13A6EF',
			backgroundImage: this.props.headerImage ? 'url("' + this.props.headerImage + '")' : '',
			textAlign: this.props.headerAlign || 'left',
		};

		const collections = this.props.collections || [];
		return (
			<div style={[styles.headerBackground, customBackgroundStyle]}>
				<div style={styles.backgroundGrey} />
				<div style={styles.headerContent}>
					{this.props.followContent}

					<div style={styles.headerTextWrapper}>
						{(this.props.headerMode === 'logo' || this.props.headerMode === 'both') &&
							<Link to={'/' + this.props.journalSlug} style={globalStyles.link}><img style={styles.logoImage} src={this.props.logo} /></Link>
						}

						{(this.props.headerMode !== 'logo') &&
							<Link to={'/' + this.props.journalSlug} style={globalStyles.link}><h1 style={styles.headerTitle}>{this.props.journalName}</h1></Link>
						}

						{(this.props.headerMode !== 'logo') &&
							<p>{this.props.description}</p>
						}

					</div>
				</div>

				<div style={styles.bottom}>
					<Link style={styles.collectionLink} to={'/' + this.props.journalSlug}>Home</Link>
					<Link style={styles.aboutLink} to={'/' + this.props.journalSlug + '/about'}>About</Link>
					{collections.map((collection)=> {
						return <Link key={'collection-' + collection.id} style={styles.collectionLink} to={'/' + this.props.journalSlug + '/collection/' + collection.title}>{collection.title}</Link>;
					})}
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
