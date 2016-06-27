import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';
import { Link } from 'react-router';

export const AtomReaderVersions = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	renderVersionsData() {
		const versionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];
		console.log(versionsData);
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
		const content = this.renderVersionsData();
		return (
			<div>
				<h2>Versions</h2>
				{content}
			</div>
		);
	}
});

export default Radium(AtomReaderVersions);
