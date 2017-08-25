import React from 'react';
// import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';

const propTypes = {
	// title: PropTypes.string.isRequired,
};

const PubCollabDropdownPrivacy = function(props) {
	return (
		<DropdownButton label={'Public Collaboration'} icon={'pt-icon-globe'}>
			<div className={'pt-menu'}>
				<DropdownRichItem
					title={'Private Collaboration'}
					description={'Collaborators must be invited. The public can view and make suggestions on published snapshots.'}
					icon={'pt-icon-lock2'}
				/>
				<DropdownRichItem
					title={'Public Suggestions'}
					description={'The working draft will be visible to all and suggestions can be made.'}
					icon={'pt-icon-team'}
				/>
				<DropdownRichItem
					title={'Public Collaboration'}
					description={'The working draft will be editable by anyone.'}
					icon={'pt-icon-globe'}
					hideBottomBorder={true}
				/>
			</div>
		</DropdownButton>
	);
};

// PubCollabDropdownPrivacy.propTypes = propTypes;
export default PubCollabDropdownPrivacy;
