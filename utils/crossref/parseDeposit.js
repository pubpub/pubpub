const doiDataPaths = [
	['book', 'content_item'],
	['conference', 'conference_paper'],
	['journal', 'journal_article'],
	['posted_content'],
	['peer_review'],
];

export const getDoiData = ({ doi_batch: { body } }) => {
	let i = 0;

	while (i < doiDataPaths.length) {
		const path = doiDataPaths[i];
		let visiting = body;
		let j = 0;

		while (j < path.length) {
			const key = path[j];
			visiting = visiting[key];

			if (!visiting) {
				break;
			}

			if (j === path.length - 1) {
				return visiting.doi_data;
			}

			j++;
		}

		i++;
	}

	return null;
};

export const getDepositRecordContentVersion = (depositRecord) => {
	if (!depositRecord) {
		return null;
	}

	const {
		depositJson: { deposit },
	} = depositRecord;
	const doiData = getDoiData(deposit);

	if (!doiData) {
		return null;
	}

	return doiData.resource['@content_version'];
};

export const setDepositRecordContentVersion = (depositRecord, contentVersion) => {
	const {
		depositJson: { deposit },
	} = depositRecord;
	const doiData = getDoiData(deposit);

	if (!contentVersion) {
		delete doiData.resource['@content_version'];
	} else {
		doiData.resource['@content_version'] = contentVersion;
	}
};

export const getDepositRecordReviewType = (depositRecord) => {
	if (!depositRecord) {
		return null;
	}

	const {
		depositJson: {
			deposit: {
				doi_batch: { body },
			},
		},
	} = depositRecord;

	if (!('peer_review' in body)) {
		return null;
	}

	return body.peer_review['@type'];
};

export const setDepositRecordReviewType = (depositRecord, reviewType) => {
	if (!depositRecord) {
		return null;
	}

	depositRecord.depositJson.deposit.doi_batch.body.peer_review['@type'] = reviewType;
};

export const getDepositRecordReviewRecommendation = (depositRecord) => {
	if (!depositRecord) {
		return null;
	}

	const {
		depositJson: {
			deposit: {
				doi_batch: { body },
			},
		},
	} = depositRecord;

	if (!('peer_review' in body)) {
		return null;
	}

	return body.peer_review['@recommendation'];
};

export const setDepositRecordReviewRecommendation = (depositRecord, recommendation) => {
	if (!depositRecord) {
		return null;
	}

	depositRecord.depositJson.deposit.doi_batch.body.peer_review[
		'@recommendation'
	] = recommendation;
};

export const getDepositBody = (crossrefDepositRecord) =>
	crossrefDepositRecord.depositJson.deposit.doi_batch.body;

export const isBook = (crossrefDepositRecord) =>
	crossrefDepositRecord && 'book' in getDepositBody(crossrefDepositRecord);
export const isJournal = (crossrefDepositRecord) =>
	crossrefDepositRecord && 'journal' in getDepositBody(crossrefDepositRecord);
export const isConference = (crossrefDepositRecord) =>
	crossrefDepositRecord && 'conference' in getDepositBody(crossrefDepositRecord);
export const isPreprint = (crossrefDepositRecord) =>
	crossrefDepositRecord && 'posted_content' in getDepositBody(crossrefDepositRecord);
export const isReview = (crossrefDepositRecord) =>
	crossrefDepositRecord && 'peer_review' in getDepositBody(crossrefDepositRecord);
export const isSupplementaryMaterial = (crossrefDepositRecord) =>
	crossrefDepositRecord && 'component_list' in getDepositBody(crossrefDepositRecord);

export const getDepositTypeTitle = (crossrefDepositRecord) => {
	if (isBook(crossrefDepositRecord)) return 'Book';
	if (isJournal(crossrefDepositRecord)) return 'Journal';
	if (isConference(crossrefDepositRecord)) return 'Conference';
	if (isPreprint(crossrefDepositRecord)) return 'Preprint';
	if (isReview(crossrefDepositRecord)) return 'Peer Review';
	if (isSupplementaryMaterial(crossrefDepositRecord)) return 'Supplementary Material';
	return '';
};
