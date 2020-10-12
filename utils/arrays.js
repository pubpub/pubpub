export const intersperse = (arr, val) => {
	const res = [];
	arr.forEach((el, index) => {
		res.push(el);
		if (index !== arr.length - 1) {
			const resolvedVal = typeof val === 'function' ? val(index) : val;
			res.push(resolvedVal);
		}
	});
	return res;
};

export const partitionOn = (array, test) => {
	const pass = [];
	const fail = [];
	array.forEach((el) => {
		if (test(el)) {
			pass.push(el);
		} else {
			fail.push(el);
		}
	});
	return [pass, fail];
};

export const indexByProperty = (array, property) => {
	const res = {};
	array.forEach((el) => {
		res[el[property]] = el;
	});
	return res;
};
