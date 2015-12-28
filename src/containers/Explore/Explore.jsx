import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {CollectionGallery, PubGallery, JournalGallery} from '../../components';
import {NotFound} from '../../containers';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Explore = React.createClass({
	propTypes: {
		exploreData: PropTypes.object,
		journalData: PropTypes.object,
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

		return (

			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				{() => {
					switch (mode) {
					case 'collections':
						return (
							<div>
								<div style={styles.header}>Collections</div>
								<CollectionGallery collections={this.props.journalData.getIn(['journalData', 'collections']).toJS()} />
							</div>
						);

					case 'pubs':
						/* Handle the situation at pubpub.org for this */
						return (
							<div>
								<div style={styles.header}>Pubs</div>
								
								<PubGallery pubs={this.props.journalData.getIn(['journalData', 'pubsFeatured']).toJS()} />
							</div>
							
						);

					case 'journals':
						/* This should only be available on pubpub */
						return (
							<div>
								
								<div style={styles.header}>Journals</div>
								<JournalGallery journals={this.props.journalData.getIn(['journalData', 'allJournals']).toJS()} />
							</div>
							
						);

					default:
						return <NotFound />;
					}
				}()}

			</div>
		);
	}

});

export default connect( state => {
	return {
		exploreData: state.explore,
		journalData: state.journal,
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
			width: '100%',
			maxWidth: '100%',
		},
	},	
	header: {
		color: globalStyles.sideText,
		padding: '20px 0px',
		fontSize: '50px',
		fontWeight: 'bold',
	},
};
