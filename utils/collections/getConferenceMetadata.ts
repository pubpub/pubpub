import { Collection } from 'types';

const getConferenceTheme = (collection) => {
	if (collection.metadata.theme) {
		return collection.metadata.theme;
	}
	return collection.metadata && collection.metadata.theme;
};

const getConferenceAcronym = (collection) => {
	if (collection.metadata.acronym) {
		return collection.metadata.acronym;
	}
	return collection.metadata && collection.metadata.acronym;
};

const getConferenceLocation = (collection) => {
	if (collection.metadata.location) {
		return collection.metadata.location;
	}
	return collection.metadata && collection.metadata.location;
};

const getConferenceDate = (collection) => {
	if (collection.metadata.date) {
		return collection.metadata.date;
	}
	return collection.metadata && collection.metadata.date;
};

export const ConferenceMetadata = (collection: Collection) => {
	const theme = getConferenceTheme(collection);
	const acronym = getConferenceAcronym(collection);
	const location = getConferenceLocation(collection);
	const conferenceDate = getConferenceDate(collection);

	return { theme, location, acronym, conferenceDate };
};
