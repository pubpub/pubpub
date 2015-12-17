import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
// import { Link } from 'react-router';
// import { pushState } from 'redux-router';
// import {logout} from '../../actions/login';
// import {getProfile} from '../../actions/profile';
import {LoaderDeterminate} from '../../components';
import {styles} from './journalAdminStyles';
// import {globalStyles} from '../../utils/styleConstants';

const JournalAdmin = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		dispatch: PropTypes.func
	},

	render: function() {
		const metaData = {};
		metaData.title = 'Journal Admin';


		return (
			<div style={styles.profilePage}>

				<DocumentMeta {...metaData} />

				
				<div style={styles.profileWrapper}>
					<div style={[styles.hiddenUntilLoad, styles.loaded]}>
						<ul style={styles.profileNav}>

							<li key="profileNav0"style={[styles.profileNavItem]} onClick={this.submitLogout}>Settings</li>
							<li style={[styles.profileNavSeparator]}></li>

							<li key="profileNav1"style={[styles.profileNavItem]}>Design</li>
							<li style={[styles.profileNavSeparator]}></li>

							<li key="profileNav2"style={[styles.profileNavItem]}>Pubs</li>
							<li style={[styles.profileNavSeparator]}></li>
							
						</ul>
					</div>
					
					{/* <LoaderDeterminate value={'loaded' === 'loading' ? 0 : 100}/> */}
					 <LoaderDeterminate value={100}/> 

					<div style={[styles.hiddenUntilLoad, styles.loaded]}>
						
						<h1>Journal Admin</h1>
						
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
