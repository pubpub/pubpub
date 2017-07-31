import { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class ManageScroll extends Component {
	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			window.scrollTo(0, 0);
		}
	}

	render() {
		return this.props.children;
	}
}

ManageScroll.propTypes = {
	location: PropTypes.object.isRequired,
	children: PropTypes.object.isRequired,
};

export default withRouter(ManageScroll);
