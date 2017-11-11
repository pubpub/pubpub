import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Footer from 'components/Footer/Footer';

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
							<div className={'subtitle'}>Build empowered communities of researchers to publish, review, organize, and progress towards discovery.</div>
							<div className={'action'}>
								<Link className={'pt-button pt-intent-primary pt-large'} to={'/signup'}>Join to Collaborate</Link>
							</div>

							<div className={'image-wrapper pt-elevation-3'}>
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-responsive-framed.png'} alt={'PubPub Community'} />
								{/*
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-viral-framed.png'} alt={'PubPub Community'} />
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-joi-framed.png'} alt={'PubPub Community'} />
								<img src={'https://jakejr.pubpub.org/fit-in/800x0/_site/landing-plix-framed.png'} alt={'PubPub Community'} />
								*/}
								
							</div>

							<h2>Empowered Publishing</h2>
							<div className={'subtitle'}>Take control of your research and how it's communicated. Powerful tools to let you publish with and for your community.<br />Free to write, free to review, free to publish.</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default withRouter(connect(state => ({
	loginData: state.login,
}))(Landing));
