import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
// import {globalStyles} from 'utils/styleConstants';
import {PreviewCard} from 'components';
import {About} from 'components';
// import { Link } from 'react-router';

let styles = {};

const Landing = React.createClass({
	propTypes: {
		landingData: PropTypes.object,
		loginData: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			
		};
	},


	render: function() {
		const metaData = {
			title: 'PubPub',
		};
		const loggedIn = this.props.loginData && this.props.loginData.get('loggedIn');

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				{/* If not loggedIn, display the About PubPub content*/}
				{!loggedIn &&
					<About />
				}
				
				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>Recent Activity</h2>

						{/* If no activity, display - follow these suggested accounts*/}

						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
						<PreviewCard 
							image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
							title={'Thariq Shihipar'}
							description={'Intent on eating every bagel on earth until I burst.'} />
					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login,
		landingData: state.landing,
	};
})( Radium(Landing) );

styles = {

};
