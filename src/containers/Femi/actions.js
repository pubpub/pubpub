export const FUNK_LOAD = 'femi/FUNK_LOAD';
export const FUNK_SUCCESS = 'femi/FUNK_SUCCESS';
export const FUNK_FAIL = 'femi/FUNK_FAIL';

export function funk(input) {
	return {
		types: [FUNK_LOAD, FUNK_SUCCESS, FUNK_FAIL],
		promise: (client) => client.post('/femi', {data: {
			'input': input
		}})
	};
}