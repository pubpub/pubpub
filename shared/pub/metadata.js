export const getPDFDownload = (pub) => {
	const downloads = pub.downloads;
	const exports = pub.activeBranch.exports;
	if (downloads) {
		const matchingDownload = downloads.find((dl) => dl.url.endsWith('.pdf'));
		if (matchingDownload) return matchingDownload;
	}
	if (exports) {
		const matchingExport = exports.find((exportFile) => exportFile.format === 'pdf');
		if (matchingExport) return matchingExport;
	}
	return false;
};

export const getTextAbstract = (docJson) => {
	let abstract = '';
	if (!docJson) return abstract;
	const { content } = docJson;
	const [firstChild, secondChild] = content;
	const firstChildIsAbstractHeader =
		firstChild &&
		firstChild.type === 'heading' &&
		firstChild.attrs.level === 1 &&
		firstChild.content.length > 0 &&
		firstChild.content[0].text.toUpperCase() === 'abstract'.toUpperCase();
	if (firstChildIsAbstractHeader && secondChild) {
		const { content: abstractContent } = secondChild;
		if (abstractContent) {
			abstractContent.forEach((item) => {
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
	}
	return abstract;
};

export const getGSNotes = (notes) => {
	return notes.reduce((unique, note) => {
		const noteArray = [];
		const noteType = note.json[0].type;
		const noteTypes = {
			chapter: 'book',
			book: 'book',
			proceedings: 'conference',
			'paper-conference': 'conference',
		};
		const noteTypeString = noteTypes[noteType] || 'journal';

		const noteArr = Object.entries(note.json[0]);
		noteArr.forEach((entry) => {
			switch (entry[0]) {
				case 'title':
					noteArray.push(`citation_title=${entry[1]}`);
					break;
				case 'author':
					entry[1].forEach((author) => {
						noteArray.push(`citation_author=${author.given} ${author.family}`);
					});
					break;
				case 'container-title':
					noteArray.push(`citation_${noteTypeString}_title=${entry[1]}`);
					break;
				case 'issued':
					noteArray.push(
						`citation_publication_date=${entry[1]['date-parts'][0].join('/')}`,
					);
					break;
				case 'issue':
				case 'volume':
				case 'DOI':
				case 'ISSN':
				case 'ISBN':
					noteArray.push(`citation_${entry[0]}=${entry[1]}`);
					break;
				default:
					break;
			}
		});
		return unique.includes(noteArray.join(';')) ? unique : [...unique, noteArray.join(';')];
	}, []);
};
