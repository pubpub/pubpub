import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import PubCollabHeader from 'components/PubCollabHeader/PubCollabHeader';

import { pubBody } from '../../../stories/_data.js';

require('./pubCollaboration.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class PubEditor extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {
		return (
			<div className={'pub-collaboration'}>

				<Helmet>
					<title>Edit</title>
				</Helmet>

				<div className={'upper'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>
								<PubCollabHeader />
							</div>
						</div>
					</div>
				</div>
				<div className={'lower'}>
					<div className={'container'}>
						<div className={'row'}>
							<div className={'col-12'}>

								<div className={'side-panel'}>
									<div className={'side-panel-content'}>
										<div className={'pt-card pt-elevation-2'} style={{ marginBottom: '1em' }}>
											Hello, I wonder how this comment size dictates the
											 functionality of longer forms of text and other
											 things like the such.
										</div>
									</div>
								</div>

								<div className={'content-panel'}>
									{pubBody}
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PubEditor.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(PubEditor));
