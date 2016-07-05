import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

export const JrnlProfileHeader = React.createClass({
	propTypes: {
		jrnlName: PropTypes.string,
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
				<div className={'section'}>
					<div style={styles.headerTextWrapper}>
						{(this.props.headerMode === 'logo' || this.props.headerMode === 'both') &&
							<img src={this.props.logo} />
						}
						
						{(this.props.headerMode !== 'logo') &&
							<h1>{this.props.jrnlName}</h1>
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

export default Radium(JrnlProfileHeader);

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
	headerTextWrapper: {
		position: 'relative',
		zIndex: 2,
	},
};
