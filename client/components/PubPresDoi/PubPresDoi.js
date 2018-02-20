import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Position, Button } from '@blueprintjs/core';

require('./pubPresDoi.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	postDoiIsLoading: PropTypes.object.isRequired,
	onAssignDoi: PropTypes.func.isRequired,
};

class PubPresDoi extends Component {
	constructor(props) {
		super(props);
		this.state = {
			justSetDoi: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (!this.props.pubData.doi && nextProps.pubData.doi) {
			this.setState({ justSetDoi: true });
		}
	}
	render() {
		const pubData = this.props.pubData;

		return (
			<div className="pub-pres-doi-component">
				<h5 className="overlay-title">DOI Assignment</h5>
				{!pubData.doi &&
					<p>A DOI can be registered for each pub by community admins. When completed, the pub is assigned an article-level DOI and each version is assigned its own component DOI. The article-level DOI will always point to the most recent version while each version DOI can be used to reference earlier snapshots.</p>
				}

				{pubData.doi && !this.state.justSetDoi &&
					<div>
						<p>DOIs have been registered for this pub and all of its published versions.</p>
						<p>Pub DOI: <a href={`https://doi.org/${pubData.doi}`}>{pubData.doi}</a></p>
					</div>
				}

				{pubData.doi && this.state.justSetDoi &&
					<div>
						<p>Successfully registered DOIs for this pub and all of its published versions!</p>
						<p>Registration may take a few hours to complete in Crossref's system. If DOI URLs do not work immediately, the registration is likely still processing.</p>
						<p>Pub DOI: <a href={`https://doi.org/${pubData.doi}`}>{pubData.doi}</a></p>
					</div>
				}
				{!pubData.doi &&
					<Button
						text="Assign DOI"
						loading={this.props.postDoiIsLoading}
						onClick={this.props.onAssignDoi}
					/>
				}
			</div>
		);
	}
}

PubPresDoi.propTypes = propTypes;
export default PubPresDoi;
