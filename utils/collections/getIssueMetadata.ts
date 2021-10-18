import { Collection } from 'types';

const getIssuePrintIssn = (collection) => collection.metadata?.printIssn;
const getIssueElectronicIssn = (collection) => collection.metadata?.electronicIssn;
const getIssueVolume = (collection) => collection.metadata?.volume;
const getIssuePrintPublicationDate = (collection) => collection.metadata?.printPublicationDate;
const getIssuePublicationDate = (collection) => collection.metadata?.publicationDate;
const getIssue = (collection) => collection.metadata?.issue;

export const issueMetadata = (collection: Collection) => {
	const printIssn = getIssuePrintIssn(collection);
	const electronicIssn = getIssueElectronicIssn(collection);
	const volume = getIssueVolume(collection);
	const issue = getIssue(collection);
	const printPublicationDate = getIssuePrintPublicationDate(collection);
	const publicationDate = getIssuePublicationDate(collection);

	return { printIssn, electronicIssn, volume, issue, printPublicationDate, publicationDate };
};
