import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {LoaderDeterminate} from '../../components';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

let styles = {};

const JournalAdmin = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		dispatch: PropTypes.func
	},

	render: function() {
		const metaData = {};
		metaData.title = 'Journal Admin';


		return (
			<div style={profileStyles.profilePage}>

				<DocumentMeta {...metaData} />

				
				<div style={profileStyles.profileWrapper}>
					
					<div style={[globalStyles.hiddenUntilLoad, globalStyles.loaded]}>
						<ul style={navStyles.navList}>
							<li key="journalNav0" style={[navStyles.navItem, true && navStyles.navItemShow]}>Settings</li>
							<li style={[navStyles.navSeparator, true && navStyles.navItemShow]}></li>

							<li key="journalNav1" style={[navStyles.navItem, true && navStyles.navItemShow]}>Design</li>
							<li style={[navStyles.navSeparator, true && navStyles.navItemShow]}></li>

							<li key="journalNav2" style={[navStyles.navItem, true && navStyles.navItemShow]}>Pubs</li>
							<li style={[navStyles.navSeparator, true && navStyles.navItemShow, navStyles.navSeparatorNoMobile]}></li>
						</ul>
					</div>
					
					{/* <LoaderDeterminate value={'loaded' === 'loading' ? 0 : 100}/> */}
					<LoaderDeterminate value={100}/> 

					<div style={[globalStyles.hiddenUntilLoad, globalStyles.loaded, styles.contentWrapper]}>
						<h1>Journal Admin</h1>
						{JSON.stringify(this.props.journalData.get('journalData').toJS())}
					</div>

				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login, 
		journalData: state.journal, 
	};
})( Radium(JournalAdmin) );

styles = {
	contentWrapper: {
		margin: globalStyles.headerHeight,
	}
};
