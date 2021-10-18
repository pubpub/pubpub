import { Collection } from 'types';

const getConferenceTheme = (collection) => collection.metadata?.theme;
const getConferenceAcronym = (collection) => collection.metadata?.acronym;
const getConferenceLocation = (collection) => collection.metadata?.location;
const getConferenceDate = (collection) => collection.metadata?.date;

export const conferenceMetadata = (collection: Collection) => {
	const theme = getConferenceTheme(collection);
	const acronym = getConferenceAcronym(collection);
	const location = getConferenceLocation(collection);
	const conferenceDate = getConferenceDate(collection);

	return { theme, location, acronym, conferenceDate };
};
