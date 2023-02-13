import { Plugin } from 'prosemirror-state';
import { Fragment, Slice, Node } from 'prosemirror-model';
import isURL from 'is-url';

const HTTP_LINK_REGEX = new RegExp(
	// eslint-disable-next-line no-useless-escape
	/(?:(?:(https|http|ftp)+):\/\/)?(?:\S+(?::\S*)?(@))?(?:(?:([a-z0-9][a-z0-9\-]*)?[a-z0-9]+)(?:\.(?:[a-z0-9\-])*[a-z0-9]+)*(?:\.(?:[a-z]{2,})(:\d{1,5})?))(?:\/[^\s]*)?\s$/g,
);

const linkify = function (fragment: Fragment): Fragment {
	const linkified: Node[] = [];
	fragment.forEach(function (child: Node) {
		if (child.isText) {
			const text = child.text as string;
			let pos = 0;
			let match;
			// const link = match[0].substring(0, match[0].length - 1);

			// eslint-disable-next-line no-cond-assign
			while ((match = HTTP_LINK_REGEX.exec(text))) {
				const start = match.index;
				const end = start + match[0].length;
				const link = child.type.schema.marks.link;
				const attrs = { type: match[2] === '@' ? 'email' : 'uri' };

				// simply copy across the text from before the match
				if (start > 0) {
					linkified.push(child.cut(pos, start));
				}

				const urlText = text.slice(start, end);
				const linkAttrs =
					attrs.type === 'email'
						? { href: 'mailto:' + urlText }
						: { href: urlText, target: '_blank' };

				linkified.push(
					child.cut(start, end).mark(link.create(linkAttrs).addToSet(child.marks)),
				);
				pos = end;
			}

			// copy over whatever is left
			if (pos < text.length) {
				linkified.push(child.cut(pos));
			}
		} else {
			linkified.push(child.copy(linkify(child.content)));
		}
	});

	return Fragment.fromArray(linkified);
};

export default () => {
	return new Plugin({
		props: {
			handlePaste: (view, event) => {
				if (
					event.clipboardData &&
					isURL(event.clipboardData.getData('Text')) &&
					view.state.selection.from !== view.state.selection.to
				) {
					view.dispatch(
						view.state.tr.addMark(
							view.state.selection.from,
							view.state.selection.to,
							view.state.schema.marks.link.create({
								href: event.clipboardData.getData('Text'),
							}),
						),
					);

					return true;
				}
				return false;
			},
			transformPasted: (slice: Slice) => {
				return new Slice(linkify(slice.content), slice.openStart, slice.openEnd);
			},
		},
	});
};
