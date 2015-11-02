const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => value => rules.map(rule => rule(value)).filter(error => !!error)[0 /* first error */];

export function required(value) {
	if (isEmpty(value)) {
		return 'Required';
	}
}

export function minLength(min) {
	return value => {
		if (!isEmpty(value) && value.length < min) {
			return `Must be at least ${min} characters`;
		}
	};
}

export function maxLength(max) {
	return value => {
		if (!isEmpty(value) && value.length > max) {
			return `Must be no more than ${max} characters`;
		}
	};
}

export function integer(value) {
	if (!Number.isInteger(Number(value))) {
		return 'Must be an integer';
	}
}

export function oneOf(enumeration) {
	return value => {
		if (!~enumeration.indexOf(value)) {
			return `Must be one of: ${enumeration.join(', ')}`;
		}
	};
}

export function createValidator(rules) {
	return (data = {}) => {
		const errors = {valid: true};
		Object.keys(rules).forEach((key) => {
			const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
			const error = rule(data[key]);
			if (error) {
				errors[key] = error;
				errors.valid = false;
			}
		});
		return errors;
	};
}
