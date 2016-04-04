import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {PreviewJournal} from 'components';

let styles = {};

const JournalGallery = React.createClass({
	propTypes: {
		journals: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			journals: [],
		};
	},

	render: function() {
		return (
			<div style={styles.container}>
				{
					this.props.journals.map((journal, index)=>{
						return (
							<div style={styles.previewWrapper} key={'journalPreview-' + index}>
								<PreviewJournal journalData={journal} />
							</div>
						);
					})
				}
				<div style={globalStyles.clearFix}></div>
			</div>
		);
	}
});

export default Radium(JournalGallery);

styles = {
	previewWrapper: {
		margin: 10,
		width: 'calc(50% - 20px)',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 20px)',
		}
	},
};
