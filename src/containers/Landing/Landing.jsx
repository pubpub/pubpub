import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {globalStyles} from 'utils/styleConstants';
import {PreviewCard} from 'components';
import AboutHeader from 'containers/About/AboutHeader';
import { Link } from 'react-router';

let styles = {};

const Landing = React.createClass({
	propTypes: {
		landingData: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			activeFeature: 'editing',
		};
	},

	setFeature: function(newFeature) {
		return ()=> {
			this.setState({activeFeature: newFeature});
		};
	},

	render: function() {
		const metaData = {
			title: 'PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<AboutHeader />

				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Explore PubPub</h2>
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
	container: {

	},
	sectionWrapper: {
		padding: '3em 2em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '3em 1em',
		}
	},
	section: {
		maxWidth: '1024px',
		margin: '0 auto',
	},
	sectionHeader: {
		fontSize: '2.5em',
		marginTop: '0em',
	},
};
