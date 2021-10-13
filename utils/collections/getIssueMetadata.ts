import { Collection } from 'types';

const getIssuePrintIssn = (collection) => {
	if (collection.metadata.printIssn) {
		return collection.metadata.printIssn;
	}
	return collection.metadata && collection.metadata.printIssn;
};

const getIssueElectronicIssn = (collection) => {
	if (collection.metadata.electronicIssn) {
		return collection.metadata.electronicIssn;
	}
	return collection.metadata && collection.metadata.electronicIssn;
};

const getIssueVolume = (collection) => {
	if (collection.metadata.volume) {
		return collection.metadata.volume;
	}
	return collection.metadata && collection.metadata.volume;
};

const getIssuePrintPublicationDate = (collection) => {
	if (collection.metadata.printPublicationDate) {
		return collection.metadata.printPublicationDate;
	}
	return collection.metadata && collection.metadata.printPublicationDate;
};

const getIssuePublicationDate = (collection) => {
	if (collection.metadata.publicationDate) {
		return collection.metadata.publicationDate;
	}
	return collection.metadata && collection.metadata.publicationDate;
};

const getIssue = (collection) => {
	if (collection.metadata.issue) {
		return collection.metadata.issue;
	}
	return collection.metadata && collection.metadata.issue;
};

export const IssueMetadata = (collection: Collection) => {
	const printIssn = getIssuePrintIssn(collection);
	const electronicIssn = getIssueElectronicIssn(collection);
	const volume = getIssueVolume(collection);
	const printPublicationDate = getIssuePrintPublicationDate(collection);
	const publicationDate = getIssuePublicationDate(collection);
	const issue = getIssue(collection);

	return { printIssn, electronicIssn, volume, printPublicationDate, publicationDate, issue };
};
