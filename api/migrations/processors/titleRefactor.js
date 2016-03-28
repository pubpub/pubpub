
 function generateHeaderString({markdown, title, abstract, authorsNote, authors}) {

	const headerMarkdown = `-----
title: ${title}
abstract: ${abstract}
${authors.map((author) => {
	return `author: ${author.username}\n\tname:${author.name}\n`;
}).join('')}
${(authorsNote) ? `authorsNote: ${authorsNote}` : '' }
-----
`;

	const newMarkdown = headerMarkdown + markdown;
	return newMarkdown;
}


export function refactorTitleFirebase({pub, markdown, authors}) {

	let foundTitle = null;
	let foundAbstract = null;
	let foundAuthorsNote = null;
	let newMarkdown = markdown;

	const titleRegex = /\[\[title:(.*?)\]\]/g;
	const abstractRegex = /\[\[abstract:(.*?)\]\]/g;
	const authorsnoteRegex = /\[\[authorsnote:(.*?)\]\]/g;


	const processTitle = function(match, p1) {
		foundTitle = p1;
		return '';
	};

	const processAbstract = function(match, p1) {
		foundAbstract = p1;
		return '';
	};

	const processAuthorsNote = function(match, p1) {
		foundAuthorsNote = p1;
		return '';
	};

	newMarkdown = newMarkdown.replace(titleRegex, processTitle);
	newMarkdown = newMarkdown.replace(abstractRegex, processAbstract);
	newMarkdown = newMarkdown.replace(authorsnoteRegex, processAuthorsNote);

	if (!foundTitle) {
		console.log('- Could not find title in ' + pub.slug);
	}

	// console.log(foundTitle, foundAbstract, foundAuthorsNote);

	return generateHeaderString({markdown: newMarkdown, title: foundTitle, abstract: foundAbstract, authorsNote: foundAuthorsNote, authors});

}

export function refactorTitleMongo({pub, markdown, authors}) {
	return generateHeaderString({markdown, title: pub.title, abstract: pub.abstract, authorsNote: pub.authorsNote, authors});
}
