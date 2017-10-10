import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';

require('./pubCollabDropdownPrivacy.scss');

const propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func
};
const defaultProps = {
	value: 'private',
	onChange: ()=>{},
};

const PubCollabDropdownPrivacy = function(props) {
	const keySuffix = Math.round(Math.random() * 25000);
	const items = {
		private: {
			value: 'private',
			title: 'Private Collaboration',
			icon: 'pt-icon-lock2',
			onClick: ()=>{ props.onChange('private'); },
			description: 'Collaborators must be invited to edit. The public can view and make suggestions on published snapshots.',
		},
		publicView: {
			value: 'publicView',
			title: 'Public View',
			icon: 'pt-icon-team',
			onClick: ()=>{ props.onChange('publicView'); },
			description: 'The working draft will be visible to all and suggestions can be made.',
		},
		publicEdit: {
			value: 'publicEdit',
			title: 'Public Collaboration',
			icon: 'pt-icon-globe',
			onClick: ()=>{ props.onChange('publicEdit'); },
			description: 'The working draft will be editable by anyone.',
		},
	};
	return (
		<div className={'pub-collab-dropdown-privacy'}>
			<h6>Collaboration Mode</h6>
			<DropdownButton label={items[props.value].title} icon={items[props.value].icon}>
				<div className={'pt-menu'}>
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
			<div className={'description'}>{items[props.value].description}</div>
		</div>
	);
};

PubCollabDropdownPrivacy.propTypes = propTypes;
PubCollabDropdownPrivacy.defaultProps = defaultProps;
export default PubCollabDropdownPrivacy;
