const { fromFirebaseJson } = require('../util/firebaseJson');
const { uncompressChange } = require('./change');

module.exports = (pubDir) => {
	const { changes } = fromFirebaseJson(pubDir.read('firebase-v5.json').toString());
	return (
		(changes &&
			Object.values(changes).reduce((changesArr, compressedChange) => {
				if (compressedChange) {
					return [...changesArr, uncompressChange(compressedChange)];
				}
				return changesArr;
			}, [])) ||
		[]
	);
};
