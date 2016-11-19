import React, { PropTypes } from 'react';
import Radium from 'radium';

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
				{contributors.map((contributor, index)=> {
					const user = contributor.user || {};
					return (
						<div>
							<div style={styles.contributorName}>{user.firstName + ' ' + user.lastName}</div>
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + user.image} alt={user.firstName + ' ' + user.lastName} />
							{/*<div>
								{user.roles.map((role)=> {
									return <div style={styles.role}>{role}</div>;
								})}	
							</div>*/}
							<p>Display As Author: {user.displayAsAuthor ? 'true' : 'false'}</p>
							<p>Display As Contributor: {user.displayAsContributor ? 'true' : 'false'}</p>
							
						</div>
					);
				})}
			</div>
		);
	}
});

export default Radium(PubContributors);

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
