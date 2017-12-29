import React from 'react';
import { hydrate } from 'react-dom';

export const hydrateWrapper = (Component)=> {
	if (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:9001') {
		const initialData = JSON.parse(document.getElementById('initial-data').getAttribute('data-json'));
		hydrate(<Component {...initialData} />, document.getElementById('root'));
	}
};
