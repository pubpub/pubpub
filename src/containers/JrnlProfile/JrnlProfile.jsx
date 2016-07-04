import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {getJrnl, updateJrnl} from './actions';
// import {NotFound} from 'components';
import JrnlProfileDetails from './JrnlProfileDetails';
import JrnlProfileLayout from './JrnlProfileLayout';
import JrnlProfileRecent from './JrnlProfileRecent';
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

	handleUpdateJrnl: function(newJrnlData) {
		this.props.dispatch(updateJrnl(this.props.slug, newJrnlData));
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		const metaData = {};
		metaData.title = jrnlData.jrnlName + ' · PubPub';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'About', link: '/' + this.props.slug + '/about' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const adminNav = [
			{ type: 'title', text: 'Admin'},
			{ type: 'link', text: 'Details', link: '/' + this.props.slug + '/details', active: this.props.mode === 'details' },
			{ type: 'link', text: 'Curate', link: '/' + this.props.slug + '/curate', active: this.props.mode === 'curate' },
			{ type: 'link', text: 'Layout', link: '/' + this.props.slug + '/layout', active: this.props.mode === 'layout' },
			{ type: 'link', text: 'Collections', link: '/' + this.props.slug + '/collections', active: this.props.mode === 'collections' },
			{ type: 'spacer' },
			{ type: 'title', text: 'Public'},
		];

		const navItems = [
			...adminNav,
			{ type: 'link', text: 'About', link: '/' + this.props.slug + '/about', active: this.props.mode === 'about' },
			{ type: 'link', text: 'Recent Activity', link: '/' + this.props.slug, active: !this.props.mode},
			{ type: 'spacer' },
			{ type: 'link', text: 'Category 1', link: '/' + this.props.slug + '/category1', active: this.props.mode === 'category1' },
			{ type: 'link', text: 'Category 2', link: '/' + this.props.slug + '/category2', active: this.props.mode === 'category2' },
		];

		const customBackgroundStyle = {
			backgroundColor: jrnlData.headerColor || '#13A6EF',
			backgroundImage: 'url("' + jrnlData.headerImage + '")',
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

					{(() => {
						switch (this.props.mode) {
						case 'details':
							return (
								<JrnlProfileDetails jrnlData={this.props.jrnlData} handleUpdateJrnl={this.handleUpdateJrnl}/>
							);
						case 'layout':
							return (
								<JrnlProfileLayout jrnlData={this.props.jrnlData} handleUpdateJrnl={this.handleUpdateJrnl}/>
							);
						default:
							return (
								<JrnlProfileRecent jrnlData={this.props.jrnlData} />
							);
						}
					})()}

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


