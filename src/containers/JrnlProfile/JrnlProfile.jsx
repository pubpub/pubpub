import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getJrnl} from './actions';
// import {NotFound} from 'components';
import {NavContentWrapper} from 'components';
import {safeGetInToJS} from 'utils/safeParse';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles;

const JrnlProfile = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		slug: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			return dispatch(getJrnl(routerParams.slug, routerParams.mode));
		}
	},


	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		const metaData = {};
		metaData.title = jrnlData.jrnlName + ' · PubPub';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'About', link: '/' + this.props.slug + '/about' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const navItems = [
			{ type: 'link', text: 'About', link: '/' + this.props.slug + '/about' },
			{ type: 'link', text: 'Featured Pubs', link: '/' + this.props.slug + '/featured' },
			{ type: 'link', text: 'Submitted Pubs', link: '/' + this.props.slug + '/submitted' },
			{ type: 'spacer' },
			{ type: 'link', text: 'Category 1', link: '/' + this.props.slug + '/category1' },
			{ type: 'link', text: 'Category 2', link: '/' + this.props.slug + '/category2' },
		];

		const customBackgroundStyle = {
			backgroundColor: jrnlData.headerColor || '#13A6EF',
			backgroundImage: jrnlData.headerImage,
		};

		return (
			<div>

				<Helmet {...metaData} />

				<div style={[styles.headerBackground, customBackgroundStyle]}>
					<div style={styles.backgroundGrey}></div>
					<div className={'section'}>
						<div style={styles.headerTextWrapper}>
							{/* <img src={journalLogo} /> */}
							<h1>{jrnlData.jrnlName}</h1>
							<p>{jrnlData.description}</p>
						</div>
					</div>
				</div>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>

					<div>Content Goes Here</div>

				</NavContentWrapper>

			</div>
		);
	}

});

export default connect( state => {
	return {
		jrnlData: state.jrnl,
		slug: state.router.params.slug,
		mode: state.router.params.mode,
	};
})( Radium(JrnlProfile) );

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


