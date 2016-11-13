import React, { PropTypes } from 'react';

let styles;

export const PubContributors = React.createClass({
	propTypes: {
		contributors: PropTypes.array,
	},

	render: function() {
		const contributors = this.props.contributors || [];
		return (
			<div style={styles.container}>
				<h2>Contributors</h2>
				{contributors.map((item, index)=> {
					return (
						<div>
							<div style={styles.contributorName}>{item.name}</div>
							{/*<div>
								{item.roles.map((role)=> {
									return <div style={styles.role}>{role}</div>;
								})}	
							</div>*/}
							<p>Display As Author: {item.displayAsAuthor ? 'true' : 'false'}</p>
							<p>Display As Contributor: {item.displayAsContributor ? 'true' : 'false'}</p>
							
						</div>
					);
				})}
			</div>
		);
	}
});

export default PubContributors;

styles = {
	container: {
		padding: '1.5em',
	},
	contributorName: {
		paddingTop: '1em',
	},
	role: {
		display: 'inline-block',
		border: '1px solid #CCC',
		fontSize: '.85em',
		padding: '0em .5em',
		marginRight: '1em',
	},
};
