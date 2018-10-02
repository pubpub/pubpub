import React from 'react';
import PropTypes from 'prop-types';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import { Button } from '@blueprintjs/core';

require('./pubSectionNav.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	queryObject: PropTypes.object.isRequired,
	hasSections: PropTypes.bool.isRequired,
	sectionId: PropTypes.string.isRequired,
	setOptionsMode: PropTypes.func.isRequired,
};

const PubSectionNav = function(props) {
	const pubData = props.pubData;
	const sectionsData = pubData.isDraft ? pubData.sectionsData : pubData.activeVersion.content;

	const sectionIds = props.hasSections
		? sectionsData.map((section)=> {
			return section.id || '';
		})
		: [];
	const currentSectionIndex = sectionIds.reduce((prev, curr, index)=> {
		if (props.sectionId === curr) { return index; }
		return prev;
	}, undefined);
	const nextSectionId = sectionIds.length > currentSectionIndex + 1
		? sectionIds[currentSectionIndex + 1]
		: '';
	const prevSectionId = currentSectionIndex - 1 > 0
		? sectionIds[currentSectionIndex - 1]
		: '';
	return (
		<div className="pub-section-nav-component">
			<div className="pt-button-group pt-fill pt-large">
				<a
					href={`/pub/${pubData.slug}/${pubData.isDraft ? 'draft/' : ''}${prevSectionId ? 'content/' : ''}${prevSectionId}${props.queryObject.version ? `?version=${props.queryObject.version}` : ''}`}
					className={`pt-button pt-icon-arrow-left ${prevSectionId || currentSectionIndex > 0 ? '' : ' disabled'}`}
				>
					Previous
				</a>
				<DropdownButton
					label={sectionsData[currentSectionIndex].title}
					usePortal={false}
				>
					<ul className="pt-menu pt-large">
						{sectionsData.map((section, index)=> {
							const isActive = index === currentSectionIndex;
							const href = `/pub/${pubData.slug}/${pubData.isDraft ? 'draft/' : ''}content/${section.id}${props.queryObject.version ? `?version=${props.queryObject.version}` : ''}`;
							return (
								<li key={`section-link-${section.id}`}>
									<a className={`pt-menu-item ${isActive ? 'pt-active' : ''}`} tabIndex="0" href={href}>
										{section.title}
									</a>
								</li>
							);
						})}
						{pubData.isDraft && (pubData.isDraftEditor || pubData.isManager) && [
							<li className="pt-menu-divider" />,
							<li>
								<Button
									className="pt-menu-item pt-popover-dismiss pt-minimal"
									onClick={()=> { props.setOptionsMode('sections'); }}
									text="Manage Sections"
								/>
							</li>
						]}
					</ul>
				</DropdownButton>
				<a
					href={`/pub/${pubData.slug}/${pubData.isDraft ? 'draft/' : ''}content/${nextSectionId}${props.queryObject.version ? `?version=${props.queryObject.version}` : ''}`}
					className={`pt-button ${nextSectionId ? '' : ' disabled'}`}
				>
					Next
					<span className="pt-icon-standard pt-icon-arrow-right pt-align-right" />
				</a>
			</div>
		</div>
	);
};

PubSectionNav.propTypes = propTypes;
export default PubSectionNav;
