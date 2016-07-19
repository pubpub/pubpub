import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

let styles;

export const AtomReaderVersions = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	renderVersionsData() {
		const versionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];
		return versionsData.map((versionData, index) => {
			const createDate = versionData.createDate ? versionData.createDate : 'Unknown creation date';
			const message = versionData.message ? versionData.message : 'No message';

			return (
				<p key={index}>
					{dateFormat(createDate, 'mmm dd, yyyy h:MMTT')}
					{message}
					<Link to={'/pub/' + versionData.slug + '?version=idk'}>Read pub at this point</Link>
				</p>

				
			);
		});
	},

	render: function() {
		// const content = this.renderVersionsData();
		const slug = safeGetInToJS(this.props.atomData, ['atomData', 'slug']);
		const versionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];

		return (
			<div>
				<h2 className={'normalWeight'}>Versions</h2>

				<div>
					{versionsData.sort((foo, bar)=>{
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
									<Link style={globalStyles.link} to={'/a/' + slug + '?version=' + item._id} className={'button'} style={styles.button}>View this Version</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
});

export default Radium(AtomReaderVersions);

styles = {
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
};
