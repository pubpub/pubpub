import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderDeterminate} from '../../components';
import {getPubEdit} from '../../actions/editor';

import {styles} from './EditorStyle';

const Editor = React.createClass({
	propTypes: {
		editorData: PropTypes.object,
		slug: PropTypes.string,
		dispatch: PropTypes.func
	},

	mixins: [PureRenderMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			return dispatch(getPubEdit(routeParams.slug));
		}
	},

	render: function() {
		const editorData = this.props.editorData;

		const metaData = {
			title: 'PubPub - Editor'
		};

		return (
			<div style={[styles.editorContainer]}>

				<DocumentMeta {...metaData} />

				{/* 
					Mobile Splash - hidden on non-mobile, full screen and ifs everyting else
					Nav Bar / always full
					Loader
					TOC/Formatting Bar / animates on preview
					edit container / absolute, 
				 */}
				<div style={styles.isMobile}>
					<h1 style={styles.mobileHeader}>Cannot Edit in Mobile</h1>
					<h2 style={styles.mobileText}>Please open this url on a desktop, laptop, or larger screen.</h2>
				</div>

				<div style={styles.notMobile}>
					<div style={[styles.editTopNav, styles.hiddenUntilLoad, styles[editorData.get('status')]]}>
						<ul style={styles.editorNav}>

							<li key="editorNav0"style={[styles.editorNavItem]}>Media</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav1"style={[styles.editorNavItem]}>References</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav2"style={[styles.editorNavItem]}>Collaborators</li>

							<li key="editorNav3"style={[styles.editorNavItem, styles.editorNavRight]}>Publish</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav4"style={[styles.editorNavItem, styles.editorNavRight]}>Live Preview</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav5"style={[styles.editorNavItem, styles.editorNavRight]}>Style</li>
							
						</ul>
					</div>

					<LoaderDeterminate value={editorData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[styles.editBottomNav, styles.hiddenUntilLoad, styles[editorData.get('status')]]}>

					</div>
					<div style={[styles.editorMarkdown, styles.hiddenUntilLoad, styles[editorData.get('status')]]}></div>
					<div style={[styles.editorPreview, styles.hiddenUntilLoad, styles[editorData.get('status')]]}></div>
				</div>
				
	
			</div>
		);
	}

});

export default connect( state => {
	return {editorData: state.editor, slug: state.router.params.slug};
})( Radium(Editor) );
