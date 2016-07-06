import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {NotFound} from 'components';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const Explore = React.createClass({
	propTypes: {
		exploreData: PropTypes.object,
		appData: PropTypes.object,
		path: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	render: function() {

		const metaData = {};

		// TODO: We may want to have some fetchData functions in the statics section. We would fetch collections and pubs when on pubpub.org to display in their respective galleries.
		// Pubs and collections are already populated in journalData when we're in a journal - so this is the only place that it's an issue.
		return (

			<div style={styles.container}>

				<Helmet {...metaData} />

				<h1>Explore</h1>

			</div>
		);
	}

});

export default connect( state => {
	return {
		exploreData: state.explore,
		appData: state.app,
		path: state.router.location.pathname
	};
})( Radium(Explore) );

styles = {
	container: {
		fontFamily: globalStyles.headerFont,
		position: 'relative',
		maxWidth: 1024,
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
			padding: '0px 20px',
			maxWidth: '100%',
		},
	},
	header: {
		color: globalStyles.sideText,
		padding: '20px 0px',
		fontSize: '50px',
	},
};
