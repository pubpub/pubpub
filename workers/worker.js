import nodePandoc from 'node-pandoc';

const src = '<h1>Hello</h1><p>It&rsquo;s bananas</p>';
// Arguments in either a single String or as an Array:
const args = '-f html -t docx -o word.docx';


// Call pandoc
nodePandoc(src, args, (err, result)=> {
	if (err) console.error('Oh Nos: ',err);
  // Without the -o arg, the converted value will be returned.
  return console.log(result), result;
});
