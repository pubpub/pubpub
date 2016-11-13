import React, { PropTypes } from 'react';
import { Link } from 'react-router';

let styles;

export const PubVersions = React.createClass({
	propTypes: {
		versionsData: PropTypes.array,
		location: PropTypes.object,
	},

	render: function() {
		return (
			<div style={styles.container}>
				<h2>Versions</h2>

				{this.props.versionsData.map((item)=> {
					return (
						<Link to={{pathname: '/pub', query: {...this.props.location.query, version: item.id}}}>
							<div>{item.versionMessage} | Public: {item.public ? 'true' : 'false'}</div>
						</Link>
					);
				})}

			</div>
		);
	}
});

export default PubVersions;

styles = {
	container: {
		padding: '1.5em',
	},
};
