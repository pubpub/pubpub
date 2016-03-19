/*--------*/
// Define Action types
// 
// All action types are defined as constants. Do not manually pass action 
// types as strings in action creators
/*--------*/
export const CREATE_ASSET_LOAD = 'asset/CREATE_ASSET_LOAD';
export const CREATE_ASSET_SUCCESS = 'asset/CREATE_ASSET_SUCCESS';
export const CREATE_ASSET_FAIL = 'asset/CREATE_ASSET_FAIL';

/*--------*/
// Define Action creators
// 
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createAsset(assetObject) {

	return {
		types: [CREATE_ASSET_LOAD, CREATE_ASSET_SUCCESS, CREATE_ASSET_FAIL],
		promise: (client) => client.post('/assetCreate', {data: {
			assetObject: assetObject
		}})
	};
}
