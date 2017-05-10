import React, { PropTypes } from 'react';

import LayoutEditor from '../app/components/LayoutEditor/LayoutEditor';
import { connect } from 'react-redux';
// import { getUserData } from './actions';

require('../static/blueprint.scss');
require('../static/style.scss');
require('../static/pubBody.scss');
require('../static/markdown.scss');

const Layout = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		userData: PropTypes.object,
		params: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		// this.props.dispatch(getUserData(params.username));
	},

	getInitialState() {
		return { };
	},

	render() {
		return (
      <LayoutEditor/>
    );

	}
});

function mapStateToProps(state) {
	return {
	};
}

export default connect(mapStateToProps)(Layout);
