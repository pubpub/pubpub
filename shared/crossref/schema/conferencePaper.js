import componentList from './componentList';
import contributors from './contributors';
import doiData from './doiData';

export default ({
	attributions,
	getDoi,
	getResourceUrl,
	language,
	sortedVersions,
	timestamp,
	title,
}) => {
	return {
		conference_paper: {
			'@language': language,
			titles: {
				title: title,
			},
			contributors: contributors(attributions),
			...doiData(getDoi(), timestamp, getResourceUrl()),
			...componentList(sortedVersions, timestamp, getDoi, getResourceUrl),
		},
	};
};
