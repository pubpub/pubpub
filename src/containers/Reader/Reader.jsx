import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {getPub} from '../../actions/reader';

// let styles = {};

const Reader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		slug: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			return dispatch(getPub(routeParams.slug));
		}
	},

	render: function() {

		const metaData = {
			title: 'PubPub - ' + this.props.slug
		};

		const pubData = this.props.readerData.get('pubData');

		return (
			<div>

				<DocumentMeta {...metaData} />

				<h2>Reader</h2>
				{JSON.stringify(pubData)}
			</div>
		);
	}

});

export default connect( state => {
	return {readerData: state.reader, slug: state.router.params.slug};
})( Radium(Reader) );

// styles = {
	
// };
