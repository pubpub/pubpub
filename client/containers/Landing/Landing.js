import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header/Header';
import { hydrateWrapper } from 'utilities';

if (typeof require.ensure === 'function') {
	require('./landing.scss');
}

const propTypes = {
	community: PropTypes.object.isRequired,
};

class Landing extends Component {
	render() {
		return (
			<div id="landing-container">
				<Header />

				<div className="page-content">
					<h2>Landing!!</h2>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/about">About</a></li>
					</ul>
					{JSON.stringify(this.props.community, null, 2)}
				</div>
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default Landing;

hydrateWrapper(Landing);
