import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {saveCollection} from '../../actions/journal';
import {CollectionEdit, CollectionMain} from '../../components';
import {NotFound} from '../../containers';
import {globalStyles, navStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

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
	getCollectionData: function(slug) {
		if ( !this.props.journalData.getIn(['journalData', 'collections']) ) { return {}; }

		const data = this.props.journalData.getIn(['journalData', 'collections']).find((obj)=>{
			return obj.get('slug') === slug;
		});
		return data ? data.toJS() : {};
	},

	collectionSave: function(newCollectionData) {
		// console.log('saving', this.props.journalData.get('baseSubdomain'), this.props.slug, newCollectionData);
		this.props.dispatch(saveCollection(this.props.journalData.get('baseSubdomain'), this.props.slug, newCollectionData));
	},

	render: function() {
		const metaData = {};
		
		const collectionData = this.getCollectionData(this.props.slug);
		metaData.title = collectionData.title + ' - ' + this.props.journalData.getIn(['journalData', 'journalName']);

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				{
					(!collectionData.slug) || (this.props.journalData.get('baseSubdomain') !== this.props.journalData.getIn(['journalData', 'subdomain'])) || (this.props.mode && !this.props.journalData.getIn(['journalData', 'isAdmin']))
						? <NotFound />
						: <div>
							
							<div style={[styles.headerImage, {backgroundImage: 'url(' + collectionData.headerImage + ')'}]}>

								<div style={styles.title}>
									<Link style={globalStyles.link} to={'/collection/' + this.props.slug}><span style={styles.headerTitle}>{collectionData.title}</span></Link> 
									{this.props.mode 
										? <span style={styles.headerModeText}>{' : '}<FormattedMessage {...globalMessages[this.props.mode]} /></span> 
										: null
									}
								</div>
								
								<div style={styles.descriptionWrapper}>
									<div style={styles.description}>{collectionData.description}</div>
								</div>
								

							</div>

							<div style={ this.props.mode && {display: 'none'} }>
								<ul style={[navStyles.navList, styles.navList]}>
									<Link to={'/collection/' + this.props.slug + '/draft'} style={globalStyles.link}><li key="collectionNav0" style={[navStyles.navItem, this.props.journalData.getIn(['journalData', 'isAdmin']) && navStyles.navItemShow, styles.navItemBackground]}>
										<FormattedMessage {...globalMessages.edit} />
									</li></Link>
								</ul>
							</div>
							
							<div style={styles.contentWrapper}>
								
								
								<div style={styles.CollectionContent}>
									{(() => {
										switch (this.props.mode) {
										case 'edit':
											return (
												<CollectionEdit 
													collectionData={collectionData}
													handleCollectionSave={this.collectionSave}
													saveStatus={this.props.journalData.get('saveCollectionStatus')}
													journalID={this.props.journalData.getIn(['journalData', '_id'])}/>
											);
										
										default:
											return (
												<CollectionMain 
													collectionData={collectionData} />
											);
										}
									})()}
								</div>
								

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
		position: 'relative',
	},
	headerImage: {
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		// backgroundAttachment: 'fixed',
		backgroundSize: 'cover',
		// position: 'absolute',
		minHeight: 250,
		width: '100%',
		color: 'white',	
	},
	// headerContent: {
	// 	minHeight: 250,
	// 	width: '100%',
	// 	color: 'white',
	// 	fontSize: 50,
	// },
	title: {
		maxWidth: 1024,
		margin: '0 auto',
		padding: '20px 0px 0px 20px',
		textShadow: '0px 0px 1px black',
	},
	headerTitle: {
		fontSize: 50,
	},
	headerModeText: {
		fontSize: 35,
	},
	descriptionWrapper: {
		maxWidth: 1024,
		margin: '0px auto',
		padding: '30px 0px 50px 50px',
	},
	description: {
		fontSize: 25,
		textShadow: '0px 0px 1px black',
		width: 500,
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
		top: 0,
		zIndex: 2,
	},
	navItemBackground: {
		backgroundColor: 'rgba(255,255,255,0.75)',
	}

};
