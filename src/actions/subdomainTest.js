/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const LOAD = 'subdomainTest/LOAD';
export const LOAD_SUCCESS = 'subdomainTest/LOAD_SUCCESS';
export const LOAD_FAIL = 'subdomainTest/LOAD_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function testGetEmpty() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.get('/getEcho', {}),
		test: 'testGetEmpty'
	};
}

export function testGetParams() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.get('/getEcho', {params: {
			'fake1': 123,
			'fake2': 'fish'
		}}),
		test: 'testGetParams'
	};
}

export function testPostEmpty() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.post('/postEcho', {}),
		test: 'testPostEmpty'
	};
}

export function testPostData() {
	return {
		types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
		promise: (client) => client.post('/postEcho', {data: {
			'fake3': 345,
			'fake4': 'salmon'
		}}),
		test: 'testPostData'
	};
}

