export const getPDFDownloads = (pub) => {
	const downloads = pub.downloads;
	const exports = pub.activeBranch.exports;
	if (downloads && downloads.length > 0) {
		return downloads.filter((download) => {
			if (download.url.substring(download.url.length - 4) === '.pdf') {
				return download;
			}
			return false;
		});
	}
	if (exports && exports.length > 0) {
		return exports.filter((exportFile) => {
			if (exportFile.format === 'pdf') {
				return exportFile;
			}
			return false;
		});
	}
	return false;
};
