export function createJournalURL({customDomain, subDomain, slug}) {

	let journalURL;
	if (customDomain) {
		journalURL = 'http://' + customDomain;
	} else if (subDomain) {
		journalURL = 'http://' + subDomain + '.pubpub.org';
	} else {
		journalURL = 'http://pubpub.org';
	}

	if (slug) {
		const pubURL = journalURL + `/pub/${slug}`;
		return pubURL;
	}

	return journalURL;
}
