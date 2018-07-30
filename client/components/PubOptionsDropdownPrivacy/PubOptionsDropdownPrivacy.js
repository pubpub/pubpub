import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import DropdownRichItem from 'components/DropdownRichItem/DropdownRichItem';

require('./pubOptionsDropdownPrivacy.scss');

const propTypes = {
	value: PropTypes.string,
	isDraft: PropTypes.bool,
	onChange: PropTypes.func
};
const defaultProps = {
	value: 'private',
	isDraft: false,
	onChange: ()=>{},
};

const PubOptionsDropdownPrivacy = function(props) {
	const keySuffix = Math.round(Math.random() * 25000);
	const items = {
		private: {
			value: 'private',
			title: 'Private',
			icon: 'pt-icon-lock2',
			onClick: ()=>{ props.onChange('private'); },
			// description: 'Collaborators must be invited to view or edit the working draft.',
		},
		publicView: {
			value: props.isDraft ? 'publicView' : 'public',
			title: props.isDraft ? 'Public View' : 'Public',
			icon: props.isDraft ? 'pt-icon-eye-open' : 'pt-icon-globe',
			onClick: ()=>{ props.onChange(props.isDraft ? 'publicView' : 'public'); },
			// description: 'The working draft can be viewed by anyone.',
		},
		publicEdit: {
			value: 'publicEdit',
			title: 'Public Edit',
			icon: 'pt-icon-edit2',
			onClick: ()=>{ props.onChange('publicEdit'); },
			// description: 'The working draft can be edited by anyone.',
		},
	};
	return (
		<div className="pub-options-dropdown-privacy-component">
			<DropdownButton label={items[props.value].title} icon={items[props.value].icon}>
				<div className="pt-menu">
					{Object.keys(items).filter((item, index)=> {
						return props.isDraft || index < 2;
					}).map((key, index, array)=> {
						const item = items[key];
						return (
							<DropdownRichItem
								key={`${item.value}-option-${keySuffix}`}
								title={item.title}
								// description={item.description}
								icon={item.icon}
								onClick={item.onClick}
								hideBottomBorder={index === array.length - 1}
							/>
						);
					})}
				</div>
			</DropdownButton>
		</div>
	);
};

PubOptionsDropdownPrivacy.propTypes = propTypes;
PubOptionsDropdownPrivacy.defaultProps = defaultProps;
export default PubOptionsDropdownPrivacy;
