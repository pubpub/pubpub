export const ANALYTICS_LOAD = 'femi/ANALYTICS_LOAD';
export const ANALYTICS_SUCCESS = 'femi/ANALYTICS_SUCCESS';
export const ANALYTICS_FAIL = 'femi/ANALYTICS_FAIL';

export function analytics(input, item) {
	return {
		types: [ANALYTICS_LOAD, ANALYTICS_SUCCESS, ANALYTICS_FAIL],
		promise: (client) => client.post('/analytics', {data: {
			'input': input,
			'item': item
		}})
	};
}