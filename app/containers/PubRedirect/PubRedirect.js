import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getPubRedirect } from 'actions/redirect';

const propTypes = {
	redirectData: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
};

class PubRedirect extends Component {
	componentWillMount() {
		const slug = this.props.match.params.slug;
		this.props.dispatch(getPubRedirect(slug));
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.redirectData.data) {
			window.location.href = nextProps.redirectData.data;
		}
	}
	render() {
		return <div />;
	}
}

PubRedirect.propTypes = propTypes;
export default withRouter(connect(state => ({
	redirectData: state.redirect,
}))(PubRedirect));
