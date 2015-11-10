import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Nav} from '../../components';
import {NARROW, getProjects} from '../../actions/editor';
import markLib from '../../modules/markdown/markdown';

import {MathPlugin} from '../../components/EditorPlugins';

let styles = {};

markLib.configure({
	math: MathPlugin
});

const MarkdownEditor = React.createClass({
	propTypes: {
		editorData: PropTypes.object,
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin],
	statics: {
		fetchDataDeferred: function(getState, dispatch) {
			return dispatch(getProjects());
		}
	},

	handleChange: function(event) {
		console.log('Got change event!');
		this.setState({
			tree: markLib(event.target.value).tree
		});
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
					<span>{editorData.get('narrowMode')}</span>
				</div>

				<div>
					<textarea
						onChange={this.handleChange}
					></textarea>
					<div>
						{this.state.tree}
					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {editorData: state.editor};
})( Radium(MarkdownEditor) );

styles = {
	editorContainer: {
		position: 'relative',
		height: 'calc(100vh - 30px)',
		overflow: 'hidden',
		overflowY: 'scroll',
	},

	debug: {
		color: 'red',
		padding: 20,
	}
};
