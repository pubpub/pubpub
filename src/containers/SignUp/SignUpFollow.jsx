import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {login} from './actions';
import {Link} from 'react-router';
import {Loader, PreviewCard} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const SignUpFollow = React.createClass({
	propTypes: {
		submitHandler: PropTypes.func,
		errorMessage: PropTypes.string,
		isLoading: PropTypes.bool,
	},

	followSubmit: function(evt) {
		evt.preventDefault();
	},

	render: function() {
		const metaData = {
			title: 'PubPub | Follow',
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.errorMessage;

		return (
			<div className={'signup-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1>Jump in!</h1>
				<p style={styles.subHeader}>Follow journals, people, and pubs to stay up to date with the communities you care about.</p>
				<h3>Follow 5 or more to continue</h3>

				<div style={styles.followPane}>
					<PreviewCard 
						image={'https://scontent.xx.fbcdn.net/v/t1.0-1/p160x160/12079118_1034419299959014_875602203342211101_n.jpg?oh=d4d9966b8ff3626f660fddde5026a824&oe=580DFA67'}
						title={'Journal of Design and Science'}
						description={'The journal explores all sorts of stuff.'} />
					<PreviewCard 
						image={'https://s3.amazonaws.com/pubpub-upload/users/1451933144166.jpg'}
						title={'PubPub Team'}
						description={'The team behind the development of PubPub. Based out of MIT Media Lab'} />
				</div>
				
				<button className={'button'} onClick={this.followSubmit}>
					<FormattedMessage id="follow.FinishSignUp" defaultMessage="Finish Sign Up"/>
				</button>

				<div style={styles.loaderContainer}><Loader loading={isLoading} showCompletion={!errorMessage}/></div>

				<Link to={'/signup?stage=follow'} style={styles.skipLink}><FormattedMessage {...globalMessages.Skipthisstep}/></Link>
				<div style={styles.errorMessage}>{errorMessage}</div>
				
				
			</div>
		);
	}

});

export default Radium(SignUpFollow);

styles = {
	subHeader: {  
		margin: '-20px 0px 20px 0px',
		fontSize: '0.9em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	followPane: {
		height: 'calc(100vh - 300px)',
		maxHeight: '500px',
		overflow: 'hidden',
		overflowY: 'scroll',
		backgroundColor: '#F3F3F4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(100vh - 350px)',
		},
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		...globalStyles.link,
		display: 'block',
		margin: '3em 0em'
	}
};
