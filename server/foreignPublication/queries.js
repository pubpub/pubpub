import { ForeignPublication } from 'server/models';

export const createForeignPublication = ({
	title,
	url,
	byline = null,
	doi = null,
	description = null,
	avatar = null,
	publicationDate = null,
}) => {
	return ForeignPublication.create({
		title: title,
		url: url,
		byline: byline,
		doi: doi,
		description: description,
		avatar: avatar,
		publicationDate: publicationDate,
	});
};
