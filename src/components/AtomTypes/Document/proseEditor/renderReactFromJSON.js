import React from 'react';
import murmurhash from 'murmurhash';

import EmbedWrapper from './EmbedWrapper';

let citeCounts = {};
let citeObjects = {};
let currentCiteCount = 1;

export const renderReactFromJSON = function(item, isRoot) {
	if (!item) {return null;}

	if (isRoot) {
		citeCounts = {};
		citeObjects = {};
		currentCiteCount = 1;
	}

	const content = item.map((node, index)=>{
		switch (node.type) {
		case 'heading':
			if (!node.content) { return null; }
			const id = node.content[0] && node.content[0].text && node.content[0].text.trim().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s/g, '-').toLowerCase();
			return React.createElement('h' + node.attrs.level, {key: index, id: id}, renderReactFromJSON(node.content));
		case 'blockquote':
			return <blockquote key={index}>{renderReactFromJSON(node.content)}</blockquote>;
		case 'ordered_list':
			return <ol start={node.attrs.order === 1 ? null : node.attrs.oder} key={index}>{renderReactFromJSON(node.content)}</ol>;
		case 'bullet_list':
			return <ul key={index}>{renderReactFromJSON(node.content)}</ul>;
		case 'list_item':
			return <li key={index}>{renderReactFromJSON(node.content)}</li>;
		case 'horizontal_rule':
			return <hr key={index}/>;
		case 'code_block':
			return <pre key={index}><code>{renderReactFromJSON(node.content)}</code></pre>;
		case 'paragraph':
			// console.log((node.content));
			const hashProp = node.content && node.content[0].type === 'text' ? {['data-hash']: murmurhash.v3(node.content[0].text)} : 0;
			return <div className={'p-block'} key={index} {...hashProp}>{renderReactFromJSON(node.content)}</div>;
		case 'page_break':
			return <div className={'pagebreak'} key={index}>pagebreak</div>;
		case 'image':
			return <img {...node.attrs} key={index}/>;
		case 'hard_break':
			return <br key={index}/>;
		case 'text':
			const marks = node.marks || [];
			return marks.reduce((previous, current)=>{
				switch (current._) {
				case 'strong':
					return <strong key={index}>{previous}</strong>;
				case 'em':
					return <em key={index}>{previous}</em>;
				case 'code':
					return <code key={index}>{previous}</code>;
				case 'sub':
					return <sub key={index}>{previous}</sub>;
				case 'sup':
					return <sup key={index}>{previous}</sup>;
				case 's':
				case 'strike':
					return <s key={index}>{previous}</s>;
				case 'link':
					return <a href={current.href} title={current.title} key={index} target={'_top'}>{previous}</a>;
				default: 
					return previous;
				}
			}, node.text);
		case 'embed':
			let citeCount;
			if (node.attrs.data._id in citeCounts) {
				citeCount = citeCounts[node.attrs.data._id];
			} else if (node.attrs.mode === 'cite') {
				citeCount = currentCiteCount++;
				citeCounts[node.attrs.data._id] = citeCount;
				citeObjects[node.attrs.data._id] = node.attrs.data;
			}
			return <EmbedWrapper {...node.attrs} key={index} citeCount={citeCount}/>;
		default:
			console.log('Error with ', node);
		}
	});

	if (isRoot) {
		return (
			<div>
				{content}
				{!!Object.keys(citeCounts).length &&
					<h1 className={'references-header'}>References</h1>
				}
				{Object.keys(citeCounts).sort((foo, bar)=>{
					if (citeCounts[foo] > citeCounts[bar]) { return 1; }
					if (citeCounts[foo] < citeCounts[bar]) { return -1; }
					return 0;
				}).map((countID, index)=>{
					return (
						<div key={'reference-list-item-' + index}>
							<span className={'reference-number'}>[{index + 1}]</span>
							<EmbedWrapper data={citeObjects[countID]} align={'inline-word'} context={'reference-list'}/>
						</div>
					);
				})}
			</div>
		);
	}
	return content;
};
