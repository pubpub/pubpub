import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';

let styles = {};

export const AtomEditorPublishing = React.createClass({
	propTypes: {
		publishingData: PropTypes.array,
		isLoading: PropTypes.bool,
		publishVersionHandler: PropTypes.func,
	},

	setPublished: function(versionID) {
		this.props.publishVersionHandler(versionID);
	},

	render: function() {
		const versionData = this.props.publishingData || [];
		return (
			<div>
				<h2>Publishing</h2>
				<p style={styles.explainer}>You can selectively publish any version of your pub.</p>
				<p style={styles.explainer}>Publishing will make your pub immediately availble to the public.</p>
				<p style={styles.explainer}>Publishing is <strong>permanent</strong> and cannot be undone (think of it like publishing a newspaper - once it's out, it's out).</p>
				<p style={styles.explainer}>You may assign a DOI to any specific version. Doing so is permanent, and the DOI cannot be switched to a newer version.</p>
				
				<div>
					{versionData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=> {
						return (
							<div key={'version-' + index} style={styles.versionRow}>
								
								<div style={styles.detailWrapper}>
									<h3 style={styles.versionDate}>{dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</h3>
									<div style={styles.versionMessage}>{item.message}</div>
								</div>
								<div style={styles.buttonWrapper}>
									{item.isPublished && <span style={styles.publishedLabel}>Published</span>}
									{!item.isPublished &&
										<div className={'button'} onClick={this.setPublished.bind(this, item._id)} style={styles.button}>Publish</div>
									}
								</div>
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
	explainer: {
		margin: 0,
		fontSize: '0.9em',
	},
	versionRow: {
		margin: '1em 0em',
		backgroundColor: '#F3F3F4',
		display: 'table',
		width: '100%',
		padding: '.5em',
	},
	detailWrapper: {
		display: 'table-cell',

	},
	buttonWrapper: {
		display: 'table-cell',
		width: '1%',
		verticalAlign: 'middle',
	},
	versionDate: {
		margin: '0em 0em .25em 0em',
	},
	button: {
		display: 'block',
		textAlign: 'center',
		padding: '.1em 2em',
		fontSize: '.8em',
		minWidth: '5em', // Need min width so Follow -> Following doesn't cause resize
		whiteSpace: 'nowrap',
	},
	publishedLabel: {
		fontWeight: 'bold',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
};
