/* eslint-disable no-console */
const LineDiff = require('line-diff');
const stableStringify = require('json-stable-stringify');

const { storage, pubIds } = require('./setup');
const { matchTransformHash } = require('./v6/transformHash');

const printDiffs = (warnings) => {
	warnings.forEach(({ payload }) => {
		if (payload && payload.isDiff) {
			const { closest, actual } = payload;
			const closestString = stableStringify(closest, { space: '  ' });
			const actualString = stableStringify(actual, { space: '  ' });
			console.log(
				new LineDiff(closestString, actualString)
					.toString()
					.split('\n')
					.filter((line) => line.trim().startsWith('+') || line.trim().startsWith('-'))
					.join('\n'),
			);
			console.log('\n');
		}
	});
};

const getStatus = () =>
	pubIds.reduce(
		(current, pubId) => {
			const { transformed, warning, error, unstarted, uploaded } = current;
			const pubDir = storage.within(`pubs/${pubId}`);
			if (pubDir.exists('problems.json')) {
				const problems = JSON.parse(pubDir.read('problems.json'));
				if (problems.errors.length) {
					return { ...current, error: { ...error, [pubId]: problems } };
				}
				if (problems.warnings.length) {
					return { ...current, warning: { ...warning, [pubId]: problems } };
				}
			}
			if (pubDir.exists('transformed.json')) {
				if (matchTransformHash(pubDir)) {
					return { ...current, uploaded: { ...uploaded, [pubId]: true } };
				}
				return { ...current, transformed: { ...transformed, [pubId]: true } };
			}
			return { ...current, unstarted: { ...unstarted, [pubId]: true } };
		},
		{ uploaded: {}, transformed: {}, warning: {}, error: {}, unstarted: {} },
	);

const main = () => {
	const shouldPrintStatuses = [process.argv.find((x) => x.startsWith('--print-status'))]
		.filter((x) => x)
		.map((arg) => arg.split('=')[1].split(','))[0];
	const shouldPrintAllStatuses = shouldPrintStatuses[0] === 'all';
	const shouldPrintDiffs = process.argv.includes('--print-warning-diffs');
	const shouldPrintProblems = process.argv.includes('--print-problems');
	const shouldPrintTotals = process.argv.includes('--print-totals');
	const status = getStatus();
	Object.entries(status).forEach(([key, pubInfo]) => {
		const pubIdsForKey = Object.keys(pubInfo);
		if (shouldPrintTotals) {
			console.log(`${key}: ${pubIdsForKey.length}`);
		}
		if (shouldPrintAllStatuses || (shouldPrintStatuses && shouldPrintStatuses.includes(key))) {
			pubIdsForKey.forEach((id) => {
				console.log(id);
				const problems = pubInfo[id];
				if (shouldPrintProblems) {
					console.log(JSON.stringify(problems));
				}
				if (shouldPrintDiffs) {
					printDiffs(problems.warnings);
				}
			});
		}
	});
};

main();
