import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {LoaderDeterminate, CodeMirror} from '../../components';
import {getPubEdit, toggleEditorViewMode, toggleFormatting, toggleTOC, unmountEditor} from '../../actions/editor';

// import Codemirror from 'react-codemirror';

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

	componentWillUnmount() {
		this.props.dispatch(unmountEditor());
	},

	toggleView: function() {
		return this.props.dispatch(toggleEditorViewMode());
	},
	toggleFormatting: function() {
		return this.props.dispatch(toggleFormatting());
	},
	toggleTOC: function() {
		return this.props.dispatch(toggleTOC());
	},
	updateCode: function(newCode) {
		console.log(newCode);
	},

	render: function() {
		const editorData = this.props.editorData;
		const viewMode = this.props.editorData.get('viewMode');
		const showBottomLeftMenu = this.props.editorData.get('showBottomLeftMenu');
		const showBottomRightMenu = this.props.editorData.get('showBottomRightMenu');
		const loadStatus = this.props.editorData.get('status');
		const metaData = {
			title: 'PubPub - Editor'
		};

		const animateListItem = function(side, status, index) {
			const statusOffset = { loaded: 0, loading: 1};
			const offset = { left: -100, right: 100};
			const delay = 0.25 + (index * 0.02);
			return {
				transform: 'translateX(' + statusOffset[status] * offset[side] + 'px)',
				transition: '.3s ease-out transform ' + delay + 's',
			};
		};
		const cmValue = 'Hello!';

		const cmOptions = {
			lineNumbers: true
		};

		return (
			<div style={[styles.editorContainer]}>

				<DocumentMeta {...metaData} />

				<div style={styles.isMobile}>
					<h1 style={styles.mobileHeader}>Cannot Edit in Mobile :(</h1>
					<h2 style={styles.mobileText}>Please open this url on a desktop, laptop, or larger screen.</h2>
				</div>

				<div style={styles.notMobile}>
					<div style={[styles.editorTopNav, styles.hiddenUntilLoad, styles[editorData.get('status')]]}>
						<ul style={styles.editorNav}>

							<li key="editorNav0"style={[styles.editorNavItem]}>Media</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav1"style={[styles.editorNavItem]}>References</li>
							<li style={styles.editorNavSeparator}></li>
							<li key="editorNav2"style={[styles.editorNavItem]}>Collaborators</li>

							<li key="editorNav9"style={[styles.editorNavItem]}> -- {viewMode} -- </li>

							<li key="editorNav3"style={[styles.editorNavItem, styles.editorNavRight]}>Publish</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav4"style={[styles.editorNavItem, styles.editorNavRight]} onClick={this.toggleView}>Live Preview</li>
							<li style={[styles.editorNavSeparator, styles.editorNavRight]}></li>
							<li key="editorNav5"style={[styles.editorNavItem, styles.editorNavRight]}>Style</li>
							
						</ul>
					</div>

					<div style={styles.editorLoadBar}>
						<LoaderDeterminate value={loadStatus === 'loading' ? 0 : 100}/>
					</div>
					

					<div style={[styles.common.editorBottomNav, styles[viewMode].editorBottomNav, styles.hiddenUntilLoad, styles[loadStatus]]}>
						<div style={[styles.common.bottomNavBackground, styles[viewMode].bottomNavBackground]}></div>
						<div className="leftBottomNav" style={[styles.common.bottomNavLeft, styles[viewMode].bottomNavLeft]}>
							<div key="bNav_toc" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, showBottomLeftMenu && styles[viewMode].listTitleActive]} onClick={this.toggleTOC}>Table of Contents</div>
							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge]}></div>
							</div>
							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, showBottomLeftMenu && styles[viewMode].listActive]}>
								<li key="blNav0" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 0), showBottomLeftMenu && styles[viewMode].listItemActive]}>Introduction</li>
								<li key="blNav1" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 1), showBottomLeftMenu && styles[viewMode].listItemActive]}>Prior Art</li>
								<li key="blNav2" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 2), showBottomLeftMenu && styles[viewMode].listItemActive]}>Resources</li>
								<li key="blNav3" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 3), showBottomLeftMenu && styles[viewMode].listItemActive]}>Methods</li>
								<li key="blNav4" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 4), showBottomLeftMenu && styles[viewMode].listItemActive]}>A New Approach</li>
								<li key="blNav5" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 5), showBottomLeftMenu && styles[viewMode].listItemActive]}>Data Analysis</li>
								<li key="blNav6" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 6), showBottomLeftMenu && styles[viewMode].listItemActive]}>Results</li>
								<li key="blNav7" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('left', loadStatus, 7), showBottomLeftMenu && styles[viewMode].listItemActive]}>Conclusion</li>
							</ul>
						</div>

						<div className="rightBottomNav" style={[styles.common.bottomNavRight, styles[viewMode].bottomNavRight]}>
							<div key="bNav_format" style={[styles.common.bottomNavTitle, styles[viewMode].bottomNavTitle, styles.alignRight, showBottomRightMenu && styles[viewMode].listTitleActive]} onClick={this.toggleFormatting}>Formatting</div>

							<div style={[styles.common.bottomNavDivider, styles[viewMode].bottomNavDivider]}>
								<div style={[styles.common.bottomNavDividerSmall, styles[viewMode].bottomNavDividerSmall, styles.floatRight, styles.common.bottomNavDividerRight]}></div>
								<div style={[styles.common.bottomNavDividerLarge, styles[viewMode].bottomNavDividerLarge, styles.floatRight, styles.common.bottomNavDividerLargeRight]}></div>
							</div>


							<ul style={[styles.common.bottomNavList, styles[viewMode].bottomNavList, styles[viewMode].bottomNavListRight, styles.alignRight, showBottomRightMenu && styles[viewMode].listActive]}>

								<li key="brNav0" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 0), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>H1</li>
								<li key="brNav1" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 1), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>H2</li>
								<li key="brNav2" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 2), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>H3</li>
								<li key="brNav3" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 3), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}># List</li>
								<li key="brNav4" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 4), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>- List</li>
								<li key="brNav5" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 5), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Image</li>
								<li key="brNav6" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 6), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Video</li>
								<li key="brNav7" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 7), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Audio</li>
								<li key="brNav8" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 8), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Gallery</li>
								<li key="brNav9" style={[styles.common.bottomNavListItem, styles[viewMode].bottomNavListItem, animateListItem('right', loadStatus, 9), styles.floatRight, showBottomRightMenu && styles[viewMode].listItemActive]}>Hologram</li>
							</ul>
						</div>
					</div>

					<div style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorMarkdown, styles[viewMode].editorMarkdown]}>
						
						<CodeMirror value={cmValue} onChange={this.updateCode} options={cmOptions} />
						{/* <h2>Sudden she seeing garret far regard</h2><p>With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.</p><p>Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any.</p><p>Wise busy past both park when an ye no. Nay likely her length sooner thrown sex lively income. The expense windows adapted sir. Wrong widen drawn ample eat off doors money. Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.</p><p>It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so before on esteem vanity oh.</p><p>On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.</p><p>Little afraid its eat looked now. Very ye lady girl them good me make. It hardly cousin me always. An shortly village is raising we shewing replied. She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.</p><p>Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.</p><p>Yet remarkably appearance get him his projection. Diverted endeavor bed peculiar men the not desirous. Acuteness abilities ask can offending furnished fulfilled sex. Warrant fifteen exposed ye at mistake. Blush since so in noisy still built up an again. As young ye hopes no he place means. Partiality diminution gay yet entreaties admiration. In mr it he mention perhaps attempt pointed suppose. Unknown ye chamber of warrant of norland arrived.</p><p>Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.</p><h2>Sudden she seeing garret far regard</h2><p>With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.</p><p>Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any.</p><p>Wise busy past both park when an ye no. Nay likely her length sooner thrown sex lively income. The expense windows adapted sir. Wrong widen drawn ample eat off doors money. Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.</p><p>It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so before on esteem vanity oh.</p><p>On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.</p><p>Little afraid its eat looked now. Very ye lady girl them good me make. It hardly cousin me always. An shortly village is raising we shewing replied. She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.</p><p>Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.</p><p>Yet remarkably appearance get him his projection. Diverted endeavor bed peculiar men the not desirous. Acuteness abilities ask can offending furnished fulfilled sex. Warrant fifteen exposed ye at mistake. Blush since so in noisy still built up an again. As young ye hopes no he place means. Partiality diminution gay yet entreaties admiration. In mr it he mention perhaps attempt pointed suppose. Unknown ye chamber of warrant of norland arrived.</p><p>Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.</p> */}
					</div>
					<div style={[styles.hiddenUntilLoad, styles[loadStatus], styles.common.editorPreview, styles[viewMode].editorPreview]}>
						<h2>Sudden she seeing garret far regard</h2><p>With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.</p><p>Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any.</p><p>Wise busy past both park when an ye no. Nay likely her length sooner thrown sex lively income. The expense windows adapted sir. Wrong widen drawn ample eat off doors money. Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.</p><p>It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so before on esteem vanity oh.</p><p>On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.</p><p>Little afraid its eat looked now. Very ye lady girl them good me make. It hardly cousin me always. An shortly village is raising we shewing replied. She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.</p><p>Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.</p><p>Yet remarkably appearance get him his projection. Diverted endeavor bed peculiar men the not desirous. Acuteness abilities ask can offending furnished fulfilled sex. Warrant fifteen exposed ye at mistake. Blush since so in noisy still built up an again. As young ye hopes no he place means. Partiality diminution gay yet entreaties admiration. In mr it he mention perhaps attempt pointed suppose. Unknown ye chamber of warrant of norland arrived.</p><p>Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.</p><h2>Sudden she seeing garret far regard</h2><p>With my them if up many. Lain week nay she them her she. Extremity so attending objection as engrossed gentleman something. Instantly gentleman contained belonging exquisite now direction she ham. West room at sent if year. Numerous indulged distance old law you. Total state as merit court green decay he. Steepest sex bachelor the may delicate its yourself. As he instantly on discovery concluded to. Open draw far pure miss felt say yet few sigh.</p><p>Attachment apartments in delightful by motionless it no. And now she burst sir learn total. Hearing hearted shewing own ask. Solicitude uncommonly use her motionless not collecting age. The properly servants required mistaken outlived bed and. Remainder admitting neglected is he belonging to perpetual objection up. Has widen too you decay begin which asked equal any.</p><p>Wise busy past both park when an ye no. Nay likely her length sooner thrown sex lively income. The expense windows adapted sir. Wrong widen drawn ample eat off doors money. Offending belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her. Six curiosity day assurance bed necessary.</p><p>It real sent your at. Amounted all shy set why followed declared. Repeated of endeavor mr position kindness offering ignorant so up. Simplicity are melancholy preference considered saw companions. Disposal on outweigh do speedily in on. Him ham although thoughts entirely drawings. Acceptance unreserved old admiration projection nay yet him. Lasted am so before on esteem vanity oh.</p><p>On on produce colonel pointed. Just four sold need over how any. In to september suspicion determine he prevailed admitting. On adapted an as affixed limited on. Giving cousin warmly things no spring mr be abroad. Relation breeding be as repeated strictly followed margaret. One gravity son brought shyness waiting regular led ham.</p><p>Little afraid its eat looked now. Very ye lady girl them good me make. It hardly cousin me always. An shortly village is raising we shewing replied. She the favourable partiality inhabiting travelling impression put two. His six are entreaties instrument acceptance unsatiable her. Amongst as or on herself chapter entered carried no. Sold old ten are quit lose deal his sent. You correct how sex several far distant believe journey parties. We shyness enquire uncivil affixed it carried to.</p><p>Allow miles wound place the leave had. To sitting subject no improve studied limited. Ye indulgence unreserved connection alteration appearance my an astonished. Up as seen sent make he they of. Her raising and himself pasture believe females. Fancy she stuff after aware merit small his. Charmed esteems luckily age out.</p><p>Yet remarkably appearance get him his projection. Diverted endeavor bed peculiar men the not desirous. Acuteness abilities ask can offending furnished fulfilled sex. Warrant fifteen exposed ye at mistake. Blush since so in noisy still built up an again. As young ye hopes no he place means. Partiality diminution gay yet entreaties admiration. In mr it he mention perhaps attempt pointed suppose. Unknown ye chamber of warrant of norland arrived.</p><p>Name were we at hope. Remainder household direction zealously the unwilling bed sex. Lose and gay ham sake met that. Stood her place one ten spoke yet. Head case knew ever set why over. Marianne returned of peculiar replying in moderate. Roused get enable garret estate old county. Entreaties you devonshire law dissimilar terminated.</p>
					</div>
				</div>
				
	
			</div>
		);
	}

});

export default connect( state => {
	return {editorData: state.editor, slug: state.router.params.slug};
})( Radium(Editor) );
