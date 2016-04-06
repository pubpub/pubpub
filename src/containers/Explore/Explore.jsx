import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {GalleryCollection, GalleryPub, GalleryJournal, NotFound} from 'components';
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

		let mode = '';
		if (this.props.path.indexOf('collections') > -1) {
			mode = 'collections';
			metaData.title = 'Collections';

		} else if (this.props.path.indexOf('pubs') > -1) {
			mode = 'pubs';
			metaData.title = 'Pubs';

		} else if (this.props.path.indexOf('journals') > -1) {
			mode = 'journals';
			metaData.title = 'Journals';

		}

		// TODO: We may want to have some fetchData functions in the statics section. We would fetch collections and pubs when on pubpub.org to display in their respective galleries.
		// Pubs and collections are already populated in journalData when we're in a journal - so this is the only place that it's an issue.
		return (

			<div style={styles.container}>

				<Helmet {...metaData} />

				{(() => {
					switch (mode) {
					case 'collections':
						/* This should only be available on journals */
						return (!this.props.appData.get('baseSubdomain')
							? <NotFound />
							: <div>
								<div style={styles.header}>
									<FormattedMessage {...globalMessages.collections} />
								</div>
								<GalleryCollection collections={this.props.appData.getIn(['journalData', 'collections']).toJS()} />
							</div>
						);

					case 'pubs':
						const pubData = this.props.appData.get('baseSubdomain') ? this.props.appData.getIn(['journalData', 'pubsFeatured']).toJS() : this.props.appData.getIn(['journalData', 'allPubs']).toJS();
						return (
							<div>
								<div style={styles.header}>
									<FormattedMessage {...globalMessages.pubs} />
								</div>
								<GalleryPub pubs={pubData} reverseOrder={true}/>
							</div>

						);

					case 'journals':
						/* This should only be available on pubpub */
						return (this.props.appData.get('baseSubdomain')
							? <NotFound />
							: <div>
								<div style={styles.header}>
									<FormattedMessage {...globalMessages.Journals} />
								</div>
								<GalleryJournal journals={this.props.appData.getIn(['journalData', 'allJournals']).toJS()} />
							</div>
						);

					default:
						return <NotFound />;
					}
				})()}

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
