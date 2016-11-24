/*--------*/
// Define Action types
//
// All action types are defined as constants. Do not manually pass action
// types as strings in action creators
/*--------*/
export const CREATE_JOURNAL_LOAD = 'createJournal/CREATE_JOURNAL_LOAD';
export const CREATE_JOURNAL_SUCCESS = 'createJournal/CREATE_JOURNAL_SUCCESS';
export const CREATE_JOURNAL_FAIL = 'createJournal/CREATE_JOURNAL_FAIL';

/*--------*/
// Define Action creators
//
// All calls to dispatch() call one of these functions. Do not manually create
// action objects (e.g. {type:example, payload:data} ) within dispatch()
// function calls
/*--------*/
export function createJournal(createData) {
	return (dispatch) => {
		dispatch({ type: CREATE_JOURNAL_LOAD });

		return clientFetch('/api/journal', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: createData.name,
				shortDescription: createData.shortDescription,
				icon: createData.icon,
				slug: createData.slug,
			})
		})
		.then((result) => {
			dispatch({ type: CREATE_JOURNAL_SUCCESS, result, slug: createData.slug });
		})
		.catch((error) => {
			console.log(error);
			dispatch({ type: CREATE_JOURNAL_FAIL, error });
		});
	};
}
