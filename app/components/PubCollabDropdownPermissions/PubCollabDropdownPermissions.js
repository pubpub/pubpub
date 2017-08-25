import React from 'react';
// import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';

// const propTypes = {
// 	title: PropTypes.string.isRequired,
// };

const PubCollabDropdownPermissions = function(props) {
	return (
		<DropdownButton label={'Can Suggest'} icon={'pt-icon-doc'}>
			<div className={'pt-menu'}>
				<DropdownRichItem
					title={'None'}
					description={'Cannot view the working draft or discussions.'}
					icon={'pt-icon-lock2'}
				/>
				<DropdownRichItem
					title={'Can Suggest'}
					description={'Can participate in discussions and suggest updates to the working draft.'}
					icon={'pt-icon-doc'}
				/>
				<DropdownRichItem
					title={'Can Edit'}
					description={'Can directly edit the working draft and participate in discussions.'}
					icon={'pt-icon-edit2'}
				/>
				<DropdownRichItem
					title={'Can Manage'}
					description={'Can edit and manage contributors, metadata, and publishing.'}
					icon={'pt-icon-admin'}
					hideBottomBorder={true}
				/>
			</div>
		</DropdownButton>
	);
};

// PubCollabDropdownPermissions.propTypes = propTypes;
export default PubCollabDropdownPermissions;
