import React from 'react';
import PropTypes from 'prop-types';
import PubBottomSection, { SectionBullets, AccentedIconButton } from './PubBottomSection';

const propTypes = {
	pubData: PropTypes.shape({
		discussions: PropTypes.arrayOf(PropTypes.shape({})),
	}).isRequired,
};

const DiscussionsSection = (props) => {
	const {
		pubData: { discussions },
	} = props;

	const renderCenterItems = () => <SectionBullets>{discussions.length}</SectionBullets>;

	// eslint-disable-next-line react/prop-types
	const renderIconItems = ({ isExpanded, iconColor }) => {
		if (isExpanded) {
			return <AccentedIconButton accentColor={iconColor} icon="filter" />;
		}
		return null;
	};

	return (
		<PubBottomSection
			isSearchable={true}
			title="Comments"
			centerItems={renderCenterItems}
			iconItems={renderIconItems}
		/>
	);
};

DiscussionsSection.propTypes = propTypes;
export default DiscussionsSection;
