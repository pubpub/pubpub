import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {Nav} from '../../components';
import {NARROW} from '../../actions/editor';

let styles = {};

const Editor = React.createClass({
	propTypes: {
		editorData: PropTypes.object,
		dispatch: PropTypes.func
	},

	render: function() {
		const editorData = this.props.editorData;
		const dispatch = this.props.dispatch;

		const left = ['cat', 'dog'];
		const right = ['fish', 'armadillo'];

		const metaData = {
			title: 'PubPub - Editor'
		};

		const toggleNarrow = function() {
			dispatch({type: NARROW});
		};

		return (
			<div style={[styles.editorContainer]}>

				<DocumentMeta {...metaData} />

				<Nav left={left} right={right} />
				
				<div style={styles.debug}>
					<span onClick={()=>toggleNarrow()}>Toggle | </span>
					<span>{editorData.narrowMode}</span>
				</div>
				
			</div>
		);
	}

});

export default connect( state => {
	return {editorData: state.editor};
})( Radium(Editor) );

styles = {
	editorContainer: {
		position: 'relative',
		height: 'calc(100vh - 30px)',
	},

	debug: {
		color: 'red',
		padding: 20,
	}
};
