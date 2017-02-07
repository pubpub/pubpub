import React from 'react';
import Radium from 'radium';
import { RenderFile } from 'components';
import { parseString } from 'bibliography';
import AMA from 'bibliography/AMA';

let styles;

export const MarkdownDocs = React.createClass({



	render() {
		const testFile = {
			content:  `# Header 1
## Header 2
### Header 3

$2+3$ inline

$$
\\frac{4}{5}
$$

[www.url.com](Link)

Here is ~Subscript~ and ^Superscript^ and !myCat.jpg

What about a 
![My thing](!myCat.jpg)
!galaxy.jpg

@ref/Hinton2006

!dog.mp4`,
			type: 'text/markdown',
		};
		
		const testFiles = [
			{
				name: 'myCat.jpg',
				type: 'image/jpeg',
				url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR4us-lMwwiaHtL_hzg3eGGU04otY9cAp9726s_rqN8kpF6-q4Xe4sXak4'
			},
			{
				name: 'dog.mp4',
				type: 'video/mp4',
				url: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcR4us-lMwwiaHtL_hzg3eGGU04otY9cAp9726s_rqN8kpF6-q4Xe4sXak4'
			},
			{
				name: 'galaxy.jpg',
				type: 'image/jpeg',
				url: 'https://www.nasa.gov/sites/default/files/thumbnails/image/hubble_friday_05132016.jpg'
			},
			{
				name: 'main.bib',
				type: 'application/x-bibtex',
				content: `@article{hinton2006,
author = {Hinton, GE and Salakhutdinov, RR},
journal = {Science},
keywords = {machineLearning},
number = {July},
pages = {504--508},
title = {{Reducing the Dimensionality of Data with Neural Networks}},
url = {http://www.sciencemag.org/content/313/5786/504.short},
volume = {313},
year = {2006}
}`
			}
			
		];
		const bibliography = parseString(testFiles[3].content);
		console.log(bibliography);
		return (
			<div style={styles.container}>
				<div style={styles.panel}>
					{/*<textarea value={this.state.text} onChange={evt => this.setState({ text: evt.target.value })} />*/}
					<pre>{testFile.content}</pre>
				</div>
				<div style={[styles.panel, styles.body]} className={'markdown-body'}>
					<RenderFile file={testFile} allFiles={testFiles} noHighlighter={true} />
					<AMA entry={bibliography.entries.hinton2006} />
					
				</div>
			</div>
		);
	}

});

export default Radium(MarkdownDocs);

styles = {
	container: {
		maxWidth: '1024px',
		margin: '0 auto',
		padding: '2em 1em',
		display: 'table',
		width: '100%',
	},
	panel: {
		width: '50%',
		display: 'table-cell',
		padding: '1em',
	},
	body: {
		fontFamily: 'Merriweather',
	},
};
