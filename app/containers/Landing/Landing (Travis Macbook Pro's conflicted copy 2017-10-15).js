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
							<div className={'subtitle'}>Do all the things with publishing that you thought you should be doing.</div>
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
