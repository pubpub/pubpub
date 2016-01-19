
export function generateJournalURL(pub, journal) {
	return 'http://' + (journal.customDomain || journal.subdomain + '.pubpub.org');
};
