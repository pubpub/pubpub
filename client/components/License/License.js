import React from 'react';

require('./license.scss');

const License = function() {
	return (
		<div className="license-component">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<a rel="license" href="https://creativecommons.org/licenses/by/4.0/">
							<img alt="Creative Commons License" src="https://licensebuttons.net/l/by/4.0/88x31.png" />
						</a>
						<div className="text">
							This work is licensed under a <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default License;
