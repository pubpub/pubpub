import {MarkdownParser} from 'prosemirror/dist/markdown';
import {schema} from './schema';
import markdownit from 'markdown-it';
import emoji from 'markdown-it-emoji';
import embed from './markdown-it-embed';

export const markdownParser = new MarkdownParser(schema, 
	markdownit({html: false})
	.use(emoji)
	.use(embed),
	{
		blockquote: {block: 'blockquote'},
		paragraph: {block: 'paragraph'},
		list_item: {block: 'list_item'},
		bullet_list: {block: 'bullet_list'},
		ordered_list: {block: 'ordered_list', attrs: tok => ({order: +tok.attrGet('order') || 1})},
		heading: {block: 'heading', attrs: tok => ({level: +tok.tag.slice(1)})},
		code_block: {block: 'code_block'},
		fence: {block: 'code_block'},
		hr: {node: 'horizontal_rule'},
		image: {node: 'image', attrs: tok => ({
			src: tok.attrGet('src'),
			title: tok.attrGet('title') || null,
			alt: tok.children[0] && tok.children[0].content || null
		})},
		embed: {node: 'embed', attrs: tok => ({
			source: tok.attrGet('source'),
			className: tok.attrGet('className') || null,
		})},
		emoji: {node: 'emoji', attrs: tok => ({
			content: tok.content,
			markup: tok.markup,
		})},
		hardbreak: {node: 'hard_break'},

		em: {mark: 'em'},
		strong: {mark: 'strong'},
		link: {mark: 'link', attrs: tok => ({
			href: tok.attrGet('href'),
			title: tok.attrGet('title') || null
		})},
		code_inline: {mark: 'code'}
	}
);
