import React from 'react';
import { Link } from 'react-router-dom';

require('./landingMain.scss');

const LandingMain = function() {
	return (
		<div className={'landing-page container'}>
			<div className={'row'}>
				<div className={'col-12'}>
					<h1>PubPub</h1>
					<h2>Collaborative Community Publishing</h2>
				</div>
			</div>
		</div>
	);
};

export default LandingMain;
