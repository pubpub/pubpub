import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';

const propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
	isDisabled: PropTypes.bool,
	hideNone: PropTypes.bool,
	leftAligned: PropTypes.bool,

};
const defaultProps = {
	value: 'none',
	onChange: ()=>{},
	isDisabled: false,
	hideNone: false,
	leftAligned: false,
};

const PubCollabDropdownPermissions = function(props) {
	const keySuffix = Math.round(Math.random() * 25000);
	const items = {
		none: {
			value: 'none',
			title: 'None',
			icon: 'pt-icon-lock2',
			onClick: ()=>{ props.onChange('none'); },
			description: 'Cannot view the working draft or discussions.',
		},
		view: {
			value: 'view',
			title: 'Can View',
			icon: 'pt-icon-doc',
			onClick: ()=>{ props.onChange('view'); },
			description: 'Can participate in discussions and view updates to the working draft.',
		},
		edit: {
			value: 'edit',
			title: 'Can Edit',
			icon: 'pt-icon-edit2',
			onClick: ()=>{ props.onChange('edit'); },
			description: 'Can directly edit the working draft and participate in discussions.',
		},
		manage: {
			value: 'manage',
			title: 'Can Manage',
			icon: 'pt-icon-admin',
			onClick: ()=>{ props.onChange('manage'); },
			description: 'Can edit and manage collaborators, metadata, and publishing.',
		},
	};

	if (props.hideNone) { delete items.none; }
	const selectedKey = props.value === 'none' && props.hideNone ? 'view' : props.value;
	return (
		<DropdownButton
			label={items[selectedKey].title}
			icon={items[selectedKey].icon}
			isRightAligned={!props.leftAligned}
			isDisabled={props.isDisabled}
		>
			<div className="pt-menu">
				{Object.keys(items).map((key, index, array)=> {
					const item = items[key];
					return (
						<DropdownRichItem
							key={`${item.value}-option-${keySuffix}`}
							title={item.title}
							description={item.description}
							icon={item.icon}
							onClick={item.onClick}
							hideBottomBorder={index === array.length - 1}
						/>
					);
				})}
			</div>
		</DropdownButton>
	);
};

PubCollabDropdownPermissions.propTypes = propTypes;
PubCollabDropdownPermissions.defaultProps = defaultProps;
export default PubCollabDropdownPermissions;
