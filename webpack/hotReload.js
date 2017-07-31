import React from 'react';
import ReactDOM from 'react-dom';

import Root from '../app';

const render = () => {
	ReactDOM.render(<Root />, document.querySelector('react'));
};

render();

module.hot.accept('../app', render);
