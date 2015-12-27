import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
// import {getJournal, saveJournal} from '../../actions/journal';
// import {LoaderDeterminate} from '../../components';
import {NotFound} from '../../containers';
import {globalStyles, navStyles} from '../../utils/styleConstants';

let styles = {};

const Collection = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		slug: PropTypes.string,
		mode: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		
	},

	// journalSave: function(newObject) {
	// 	this.props.dispatch(saveJournal(this.props.subdomain, newObject));
	// },

	render: function() {
		const metaData = {};
		metaData.title = 'Collection';
		console.log(this.props.slug);
		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				{
					(this.props.slug === 'cat') || (this.props.mode && !this.props.journalData.getIn(['journalData', 'isAdmin']))
						? <NotFound />
						: <div>
							
							<div style={styles.headerImage}></div>

							<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')]]}>
								<ul style={[navStyles.navList, styles.navList]}>
									<Link to={'/collection/' + this.props.slug + '/edit'} style={globalStyles.link}><li key="collectionNav0" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow, styles.navItemBackground]}>Edit</li></Link>

									{/* <li key="journalNav3" style={[navStyles.navItem, !this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}>Follow</li>
										<li style={[navStyles.navSeparator, !this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow]}></li> */}
								</ul>
							</div>
							
							<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.journalData.get('status')], styles.contentWrapper]}>
								<div style={styles.headerContent}>
									Wowy Zowwy!
								</div>
								<p>TITLE</p>
								<p>TITLE</p>
								<p>TITLE</p>
								<p>TITLE</p>
								<p>TITLE</p>
								<p>TITLE</p>
								

							</div>

						</div>
				}
								
			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		journalData: state.journal, 
		slug: state.router.params.slug,
		mode: state.router.params.mode
	};
})( Radium(Collection) );

styles = {
	container: {
		backgroundColor: 'white',
		color: globalStyles.sideText,
		fontFamily: globalStyles.headerFont,
		width: '100%',
	},
	headerImage: {
		backgroundImage: 'url(http://7-themes.com/data_images/out/24/6851008-landscape-photos.jpg)',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		backgroundAttachment: 'fixed',
		backgroundSize: 'cover',
		position: 'absolute',
		height: 250,
		width: '100%',
	},
	headerContent: {
		height: 250,
		width: '100%',
		color: 'white',
		fontSize: 35,
	},
	contentWrapper: {
		margin: globalStyles.headerHeight + ' auto',
		width: 'calc(100% - 40px)',
		maxWidth: 1024,
		padding: 20,
		// backgroundColor: 'green',
		position: 'relative',
		zIndex: 1,
	},
	navList: {
		position: 'absolute',
		zIndex: 2,
	},
	navItemBackground: {
		backgroundColor: 'rgba(255,255,255,0.75)',
	}

};
