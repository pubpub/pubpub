/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const POST_JOURNAL_SUBMIT_LOAD = 'pub/POST_JOURNAL_SUBMIT_LOAD';
export const POST_JOURNAL_SUBMIT_SUCCESS = 'pub/POST_JOURNAL_SUBMIT_SUCCESS';
export const POST_JOURNAL_SUBMIT_FAIL = 'pub/POST_JOURNAL_SUBMIT_FAIL';

export const PUT_FEATURE_LOAD = 'pub/PUT_FEATURE_LOAD';
export const PUT_FEATURE_SUCCESS = 'pub/PUT_FEATURE_SUCCESS';
export const PUT_FEATURE_FAIL = 'pub/PUT_FEATURE_FAIL';

export const PUT_PUB_CONTEXT_LOAD = 'pub/PUT_PUB_CONTEXT_LOAD';
export const PUT_PUB_CONTEXT_SUCCESS = 'pub/PUT_PUB_CONTEXT_SUCCESS';
export const PUT_PUB_CONTEXT_FAIL = 'pub/PUT_PUB_CONTEXT_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function postJournalSubmit(pubId, journalId) {
	return (dispatch) => {
		dispatch({ type: POST_JOURNAL_SUBMIT_LOAD });

		return clientFetch('/api/pub/submits', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				journalId: journalId, 
			})
		})
		.then((result) => {
			dispatch({ type: POST_JOURNAL_SUBMIT_SUCCESS, result });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: POST_JOURNAL_SUBMIT_FAIL, error });
		});
	};
}

export function putFeature(pubId, journalId, isDisplayed) {
	return (dispatch) => {
		dispatch({ type: PUT_FEATURE_LOAD, journalId: journalId, isDisplayed: isDisplayed });

		return clientFetch('/api/pub/features', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				journalId: journalId, 
				isDisplayed: isDisplayed, 
			})
		})
		.then((result) => {
			dispatch({ type: PUT_FEATURE_SUCCESS });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_FEATURE_FAIL, error });
		});
	};
}

export function putPubContext(pubId, journalId) {
	return (dispatch) => {
		dispatch({ type: PUT_PUB_CONTEXT_LOAD, journalId: journalId, });

		return clientFetch('/api/pub', {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pubId: pubId, 
				defaultContext: journalId, 
			})
		})
		.then((result) => {
			dispatch({ type: PUT_PUB_CONTEXT_SUCCESS });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: PUT_PUB_CONTEXT_FAIL, error });
		});
	};
}
