import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

require('./landing.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class Landing extends Component {
	render() {
		return (
			<div className={'landing'}>

				<div className={'container narrow'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<h1>Collaborative Community Publishing</h1>
							<div className={'subtitle'}>Build empowered communities of researchers to publish, review, and organize towards discovery and progress.</div>
							<div className={'action'}>
								<button className={'pt-button pt-intent-primary pt-large'}>Join to Collaborate</button>
							</div>

							<div className={'image-wrapper pt-elevation-2'}>
								<img src={'https://i.imgur.com/h20M7Ui.jpg'} alt={'PubPub Community'} />
							</div>

							<h2>Empowered Publishing</h2>
							<div className={'subtitle'}>Take control of your research and how it's communicated. Powerful tools to let you publish with and for your community. Free to write, free to review, free to publish.</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default withRouter(connect(state => ({
	loginData: state.login,
}))(Landing));
