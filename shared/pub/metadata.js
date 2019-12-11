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

export const getTextAbstract = (content) => {
	let abstract = '';
	if (
		content.content[0].type === 'heading' &&
		content.content[0].attrs.level === 1 &&
		content.content[0].attrs.id === 'abstract'
	) {
		content.content[1].content.forEach((item) => {
			switch (item.type) {
				case 'text':
					abstract += item.text;
					if (item.marks) {
						item.marks.forEach((mark) => {
							if (mark.type === 'link') {
								abstract += ` <${mark.attrs.href}> `;
							}
						});
					}
					break;
				case 'equation':
					abstract += item.attrs.value;
					break;
				default:
					break;
			}
		});
	}
	return abstract;
};
