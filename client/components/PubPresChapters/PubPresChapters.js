import React from 'react';
import PropTypes from 'prop-types';

require('./pubPresChapters.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	mode: PropTypes.string,
};

const defaultProps = {
	mode: undefined,
};

const PubPresChapters = (props)=> {
	const content = props.pubData.versions[0].content;
	const queryObject = props.locationData.query;
	const activeChapterId = props.locationData.params.chapterId || '';
	return (
		<div className="pub-pres-chapters-component">
			{!props.mode &&
				<h5>Chapters</h5>
			}
			<ul className="pt-menu">
				{content.map((chapter, index)=> {
					return (
						<li key={chapter.title}>
							<a href={`/pub/${props.pubData.slug}/${index === 0 ? '' : 'chapter/'}${chapter.id}${queryObject.version ? `?version=${queryObject.version}` : ''}`} className={`pt-menu-item pt-popover-dismiss ${activeChapterId === chapter.id ? 'pt-active' : ''}`}>
								{chapter.title}
							</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

PubPresChapters.propTypes = propTypes;
PubPresChapters.defaultProps = defaultProps;
export default PubPresChapters;
