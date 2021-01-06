/* global describe, it, expect */
import { editFirebaseDraft } from 'stubstub';

import { getStepsInChangeRange } from '../changes';

describe('getStepsInChangeRange', () => {
	it('returns expected steps', async () => {
		const editor = await editFirebaseDraft();
		editor.transform((tr, schema) => {
			tr.insert(0, schema.text('Hello fellow human'));
			tr.insert(0, schema.text('Here are some steps'));
		});
		await editor.writeChange();
		editor.transform((tr, schema) => {
			tr.insert(10, schema.text('This is another step'));
			tr.insert(5, schema.text('Very cool'));
		});
		await editor.writeChange();
		editor.transform((tr, schema) => {
			tr.replaceRangeWith(0, 10, schema.text('Okay just one more'));
		});
		await editor.writeChange();
		const [zeroToTwo, negativeOneToTwo] = await Promise.all([
			getStepsInChangeRange(editor.getRef(), 0, 2),
			getStepsInChangeRange(editor.getRef(), -1, 2),
		]);
		expect(zeroToTwo).toEqual(negativeOneToTwo);
		expect(zeroToTwo).toMatchInlineSnapshot();
		expect(await getStepsInChangeRange(editor.getRef(), 0, 0)).toMatchInlineSnapshot();
		expect(await getStepsInChangeRange(editor.getRef(), 0, 1)).toMatchInlineSnapshot();
		expect(await getStepsInChangeRange(editor.getRef(), 1, 2)).toMatchInlineSnapshot();
	});
});
