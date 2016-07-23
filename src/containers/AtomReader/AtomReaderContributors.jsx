import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {PreviewCard} from 'components';

let styles;

export const AtomReaderContributors = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		contributorsData: PropTypes.array,
	},

	render: function() {
		const contributorsData = this.props.contributorsData || [];
		return (
			<div>
				
				<h2 className={'normalWeight'}>Contributors</h2>
				
				{
					contributorsData.sort((foo, bar)=>{
						// Sort so that alphabetical
						if (foo.source.name > bar.source.name) { return 1; }
						if (foo.source.name < bar.source.name) { return -1; }
						return 0;
					}).map((item, index)=>{
						const roles = item.metadata && item.metadata.roles || [];
						return (
							<PreviewCard 
								key={'contributor-' + index}
								type={'user'}
								image={item.source.image}
								title={item.source.name}
								slug={item.source.username}
								footer={roles.length && roles.map((role, roleIndex)=> {
									return (
										<div key={'role-' + index + '-' + roleIndex} style={styles.role}>
											{role.label}
										</div>
									);
								})} />
						);
					})
				}

			</div>
		);
	}
});

export default Radium(AtomReaderContributors);

styles = {
	role: {
		display: 'inline-block',
		margin: '.25em 1em',
	},
};
