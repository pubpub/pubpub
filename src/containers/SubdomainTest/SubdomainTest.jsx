import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {testGetEmpty, testGetParams, testPostEmpty, testPostData} from './actions';

let styles = {};

const Subdomain = React.createClass({
	propTypes: {
		subdomainData: PropTypes.object,
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch) {
			// Note, you cannot normally dispatch multiple actions here.
			// Only the one in the return value will be 'waited for'.
			// This sorta hack works only because the calls are nearly instant.
			dispatch(testGetEmpty());
			dispatch(testGetParams());
			dispatch(testPostEmpty());
			return dispatch(testPostData());
		}
	},

	render: function() {

		const metaData = {
			title: 'PubPub - Subdomain'
		};

		return (
			<div style={[styles.editorContainer]}>

				<Helmet {...metaData} />

				<div>Welcome to Subdomain Tests!</div>
				<div>
					<h3>testGetEmpty</h3>
					{JSON.stringify(this.props.subdomainData.get('testGetEmpty'))}
				</div>
				<div>
					<h3>testGetParams</h3>
					{JSON.stringify(this.props.subdomainData.get('testGetParams'))}
				</div>
				<div>
					<h3>testPostEmpty</h3>
					{JSON.stringify(this.props.subdomainData.get('testPostEmpty'))}
				</div>
				<div>
					<h3>testPostData</h3>
					{JSON.stringify(this.props.subdomainData.get('testPostData'))}
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {subdomainData: state.subdomainTest};
})( Radium(Subdomain) );

styles = {
	editorContainer: {
		position: 'relative',
		height: 'calc(100vh - 30px)',
		overflow: 'hidden',
		overflowY: 'scroll',
	}
};
