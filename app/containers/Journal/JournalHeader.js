import React, {PropTypes} from 'react';
import Radium from 'radium';
import {FollowButton} from 'containers';
import {globalStyles} from 'utils/globalStyles';
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
		headerColor: PropTypes.string,
		headerImage: PropTypes.string,
		headerMode: PropTypes.string,
		headerAlign: PropTypes.string,
	},

	render: function() {
		const customBackgroundStyle = {
			backgroundColor: this.props.headerColor || '#13A6EF',
			backgroundImage: 'url("' + this.props.headerImage + '")',
			textAlign: this.props.headerAlign || 'left',
		};

		return (
			<div style={[styles.headerBackground, customBackgroundStyle]}>
				<div style={styles.backgroundGrey}></div>
				<div style={styles.headerContent}>
					{/* <FollowButton id={this.props.journalID} type={'followsJournal'} isFollowing={this.props.isFollowing} buttonStyle={styles.followButtonStyle}/> */}
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
			</div>
		);
	}

});

export default Radium(JournalProfileHeader);

styles = {
	headerBackground: {
		padding: '2em 0em',
		marginBottom: '3em',
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
