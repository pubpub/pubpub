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
	const chapterTitles = content.map((item)=> {
		return item.title;
	});
	const queryObject = props.locationData.query;
	const activeChapterId = props.locationData.params.chapterId ? props.locationData.params.chapterId - 1 : 0;
	return (
		<div className="pub-pres-chapters-component">
			{!props.mode &&
				<h5>Chapters</h5>
			}
			<ul className="pt-menu">
				{chapterTitles.map((chapterTitle, index)=> {
					return (
						<li key={chapterTitle}>
							<a href={`/pub/${props.pubData.slug}/chapter/${index + 1}${queryObject.version ? `?version=${queryObject.version}` : ''}`} className={`pt-menu-item pt-popover-dismiss ${activeChapterId === index ? 'pt-active' : ''}`}>
								{chapterTitle}
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
