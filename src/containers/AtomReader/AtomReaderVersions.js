import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

export const AtomReaderVersions = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	renderVersionsData() {
		console.log(">>" + this.props.atomData.versionsData);
		const versionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];
		console.log(versionsData);
		return versionsData.map((versionData, index) => {
			const createDate = versionData.createDate ? versionData.createDate : 'Unknown';
				return (<p key={index} >
									<p>{createDate}</p>
									<a href="idk">idk</a>.
								</p>);
			});
	},

	render: function() {
		let content = this.renderVersionsData();
		return (
			<div>
				<h2>Versions</h2>
				{content}
			</div>
		);
	}
});

export default Radium(AtomReaderVersions);
