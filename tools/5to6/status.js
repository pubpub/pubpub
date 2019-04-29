/* eslint-disable no-console */
const LineDiff = require('line-diff');
const stableStringify = require('json-stable-stringify');

const { storage, pubIds } = require('./setup');

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
			const { ok, warning, error, unstarted } = current;
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
			if (!pubDir.exists('transformed.json')) {
				return { ...current, unstarted: { ...unstarted, [pubId]: true } };
			}
			return { ...current, ok: { ...ok, [pubId]: true } };
		},
		{ ok: {}, warning: {}, error: {}, unstarted: {} },
	);

const main = () => {
	const shouldPrintKinds = [process.argv.find((x) => x.startsWith('--print-kind'))]
		.filter((x) => x)
		.map((arg) => arg.split('=')[1].split(','))[0];
	const shouldPrintDiffs = process.argv.includes('--print-warning-diffs');
	const shouldPrintProblems = process.argv.includes('--print-problems');
	const shouldPrintTotals = process.argv.includes('--print-totals');
	const status = getStatus();
	Object.entries(status).forEach(([key, pubInfo]) => {
		const pubIdsForKey = Object.keys(pubInfo);
		if (shouldPrintTotals) {
			console.log(`${key}: ${pubIdsForKey.length}`);
		}
		if (shouldPrintKinds && shouldPrintKinds.includes(key)) {
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
