import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';

let styles = {};

export const AtomEditorPublishing = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		isLoading: PropTypes.bool,
		publishVersionHandler: PropTypes.func,
	},

	setPublished: function(versionID) {
		this.props.publishVersionHandler(versionID);
	},

	render: function() {
		const versionData = safeGetInToJS(this.props.atomEditData, ['atomData', 'versions']) || [];
		return (
			<div>
				<h2>Publishing</h2>
				<p>You can selectively publish any version of your pub.</p>
				<p>Publishing will make your pub immediately availble to the public.</p>
				<p>Publishing is permanent and cannot be undone (think of it like publishing a newspaper - once it's out, it's out).</p>
				
				<div>
					{versionData.map((item, index)=> {
						return (
							<div key={'version-' + index} style={styles.versionRow} onClick={this.setPublished.bind(this, item._id)}>
								{item.createDate} | {item.isPublished ? 'Published' : 'Unpublished'} | {dateFormat(item.publishedDate, 'mmm dd, yyyy h:MM TT')}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
});

export default Radium(AtomEditorPublishing);

styles = {
	versionRow: {
		margin: '1em 0em',
		backgroundColor: '#F3F3F4',
		cursor: 'pointer',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
};
