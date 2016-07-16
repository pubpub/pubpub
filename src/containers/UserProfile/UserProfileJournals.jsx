import React, {PropTypes} from 'react';
import Radium from 'radium';
import {PreviewCard} from 'components';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const UserPubs = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
	},

	getInitialState: function() {
		return {
			
		};
	},

	render: function() {

		const atoms = this.props.profileData.atoms;
		return (
			<div style={styles.container}>

				<h3>Journals</h3>
				{
					atoms.map((atom, index)=>{
						return (<PreviewCard 
							key={'atomItem-' + index}
							type={'atom'}
							slug={atom.slug}
							title={atom.title}
							image={atom.image}
							description={atom.description}
							showEdit={this.props.ownProfile === 'self' ? true : false} />
						);
					})
				}

			</div>
		);
	}
});

export default Radium(UserPubs);

styles = {
	
};
