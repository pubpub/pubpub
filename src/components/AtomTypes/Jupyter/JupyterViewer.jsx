import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Loader} from 'components';

let styles;

export const JupyterViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},
	getInitialState() {
		return {
			isLoading: true,
			jupyterHtml: ''
		};
	},


	render: function() {
		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const JupyterSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const JupyterSourceHtmlUrl = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'htmlUrl']);

		return (
				<iframe style={styles.iframe} src={JupyterSourceHtmlUrl}></iframe>
		);
	}


});

export default Radium(JupyterViewer);

styles = {
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
	iframe: {
		display: 'block',
		border: 'none',
		height: '100vh',
		width: '93%',
	}
};
