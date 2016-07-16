import React, {PropTypes} from 'react';
import Radium from 'radium';
import {PreviewCard} from 'components';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

export const UserPubs = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.bool,
	},

	getInitialState: function() {
		return {
			
		};
	},

	render: function() {

		const atoms = this.props.profileData.atoms;
		return (
			<div>

				{

					atoms.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1;}
						return 0;
					}).map((item, index)=>{
						return (
							<PreviewCard 
								key={'atomItem-' + index}
								type={'atom'}
								slug={item.slug}
								title={item.title}
								image={item.image}
								description={item.description}
								showEdit={this.props.ownProfile === 'self' ? true : false} />
						);
					})
				}


			</div>
		);
	}
});

export default Radium(UserPubs);
