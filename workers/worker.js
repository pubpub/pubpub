import fs from 'fs';
import Promise from 'bluebird';
import nodePandoc from 'node-pandoc';
import tmp from 'tmp-promise';

// const fsReadFile = Promise.promisify(fs.readFile);
// const fsWriteFile = Promise.promisify(fs.writeFile);
tmp.file({ postfix: '.docx' })
.then((tmpFile)=> {
	const src = '<h1>Hello</h1><p>It&rsquo;s bananas</p>';
	// Arguments in either a single String or as an Array:
	// const args = '-f html -t docx -o word.docx';
	const args = `-f html -t docx -o ${tmpFile.path}`;
	console.log(tmpFile.path);

	// Call pandoc
	nodePandoc(src, args, (err, result)=> {
		if (err) console.error('Oh Nos: ',err);
		// Without the -o arg, the converted value will be returned.
		return console.log(result), result;
	});
})
.catch((promiseErr)=> {
	console.log('Error in promise chain', promiseErr);
});

