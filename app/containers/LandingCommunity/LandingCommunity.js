import React from 'react';
import { Link } from 'react-router-dom';

const LandingCommunity = function() {
	return (
		<div className={'landing-page container'}>
			<div className={'row'}>
				<div className={'col-12'}>
					<h1>Viral Communications</h1>
					<button className={'pt-button pt-intent-primary'}>Default</button>
					<button className={'pt-button pt-intent-primary'}>Hover</button>
					<button className={'pt-button pt-intent-primary pt-active'}>Active</button>
				</div>
			</div>
		</div>
	);
};

export default LandingCommunity;
