import React from 'react';
import PropTypes from 'prop-types';

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
	console.log(sectionsData);

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
					href={`/pub/${pubData.slug}/${prevSectionId ? 'content/' : ''}${prevSectionId}${props.queryObject.version ? `?version=${props.queryObject.version}` : ''}`}
					className={`pt-button pt-icon-arrow-left ${prevSectionId || currentSectionIndex > 0 ? '' : ' disabled'}`}
				>
					Previous
				</a>
				<button
					onClick={()=> { props.setOptionsMode('sections'); }}
					className="pt-button pt-icon-properties"
					type="button"
				>
					Contents
				</button>
				<a
					href={`/pub/${pubData.slug}/content/${nextSectionId}${props.queryObject.version ? `?version=${props.queryObject.version}` : ''}`}
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
