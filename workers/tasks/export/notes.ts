import md5 from 'crypto-js/md5';

import { DocJson } from 'types';
import { jsonToNode, getNotes, Note } from 'components/Editor';
import { NoteManager } from 'client/utils/notes';
import { getStructuredCitations } from 'server/utils/citations';
import { RenderedStructuredValue } from 'utils/notesCore';

import { NotesData, NoteWithStructuredHtml, PubMetadata } from './types';

export type PandocNote = Note & {
	id: string;
	hash: string;
	cslJson: Record<string, any>;
};

export type PandocNotes = Record<string, PandocNote>;

const enrichNoteWithStructuredResult = (
	note: Note,
	renderedStructuredValues: Record<string, RenderedStructuredValue>,
): NoteWithStructuredHtml => {
	const { structuredValue } = note;
	if (structuredValue && renderedStructuredValues[structuredValue]) {
		const { html } = renderedStructuredValues[structuredValue];
		return { ...note, structuredHtml: html };
	}
	return note;
};

export const getNotesData = async (
	pubMetadata: PubMetadata,
	pubDoc: DocJson,
): Promise<NotesData> => {
	const { citationStyle, citationInlineStyle } = pubMetadata;
	const hydratedPubDoc = jsonToNode(pubDoc);
	const { footnotes, citations } = getNotes(hydratedPubDoc);

	const structuredValues = [
		...new Set([...footnotes, ...citations].map((note) => note.structuredValue)),
	];

	const renderedStructuredValues = await getStructuredCitations(
		structuredValues,
		citationStyle,
		citationInlineStyle,
	);

	return {
		renderedStructuredValues,
		noteManager: new NoteManager(citationStyle, citationInlineStyle, renderedStructuredValues),
		footnotes: footnotes.map((note) =>
			enrichNoteWithStructuredResult(note, renderedStructuredValues),
		),
		citations: citations.map((note) =>
			enrichNoteWithStructuredResult(note, renderedStructuredValues),
		),
	};
};

export const getHashForNote = (note: Pick<Note, 'structuredValue' | 'unstructuredValue'>) => {
	const { structuredValue, unstructuredValue } = note;
	const digest = md5(`${structuredValue}__${unstructuredValue}`).toString();
	return digest.slice(0, 8);
};

export const getPandocNotesByHash = (
	notes: Note[],
	renderedStructuredValues: Record<string, RenderedStructuredValue>,
) => {
	const index: Record<string, PandocNote> = {};
	notes.forEach((note) => {
		const hash = getHashForNote(note);
		if (note.structuredValue) {
			const renderedStructuredValue = renderedStructuredValues[note.structuredValue];
			const cslJson = renderedStructuredValue?.json[0];
			if (cslJson) {
				const citationLabel = cslJson['citation-label'];
				let id = citationLabel;
				for (let suffix = 2; Object.keys(index).includes(id); suffix++) {
					id = `${citationLabel}-${suffix}`;
				}
				index[hash] = { ...note, id, hash, cslJson };
				return;
			}
		}
		index[hash] = { ...note, id: hash, hash, cslJson: { id: hash } };
	});
	return index;
};

export const getReferencesEntryForPandocNotes = (notes: PandocNotes) => {
	return Object.values(notes).map((note) => note.cslJson);
};
