import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Position, Button } from '@blueprintjs/core';

require('./pubPresCite.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	postDoiIsLoading: PropTypes.object.isRequired,
	onAssignDoi: PropTypes.func.isRequired,
};

class PubPresCite extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'pub',
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
		const modeData = this.state.mode === 'pub'
			? pubData.citationData.pub
			: pubData.citationData.version;

		return (
			<div className="pub-pres-cite-component">
				<div className="pt-button-group pt-small">
					<Tooltip
						content="Cite the work as a whole. The url below will always produce the most recent version of the work."
						tooltipClassName="pt-dark cite-tooltip"
						position={Position.BOTTOM}
					>
						<button className={`pt-button ${this.state.mode === 'pub' ? 'pt-active' : ''}`} onClick={()=> { this.setState({ mode: 'pub' }); }}>Cite the Work</button>
					</Tooltip>
					<Tooltip
						content="Cite this specific version. The url below will always produce this specific version of the work."
						tooltipClassName="pt-dark cite-tooltip"
						position={Position.BOTTOM}
					>
						<button className={`pt-button ${this.state.mode === 'version' ? 'pt-active' : ''}`} onClick={()=> { this.setState({ mode: 'version' }); }}>Cite this Version</button>
					</Tooltip>
				</div>

				<h5 className="overlay-title">Cite</h5>
				{this.props.loginData.isAdmin && this.props.loginData.id === 'b242f616-7aaa-479c-8ee5-3933dcf70859' &&
					<div className="pt-callout">
						{!pubData.doi &&
							<Button
								text="Assign DOI"
								className="pt-small"
								loading={this.props.postDoiIsLoading}
								onClick={this.props.onAssignDoi}
							/>
						}
						<h5>DOI Assignment</h5>
						{!pubData.doi &&
							<p>A DOI can be assigned to each pub by community admins. When assigned, the pub is given an article-level DOI and each version is assigned it's own child DOI. The article-level DOI will always point to the most recent version while each version DOI can be used to reference the specific version.</p>
						}
						{pubData.doi && !this.state.justSetDoi &&
							<p>DOIs have been registered for this pub and all of it's published versions.</p>
						}

						{pubData.doi && this.state.justSetDoi &&
							<div>
								<p>Successfully registered DOIs for this pub and all of it's published versions!</p>
								<p>Registration may take a few hours to complete in Crossref's system. If DOI URLs do not work immediately, the registration is likely still processing.</p>
							</div>
						}
					</div>
				}

				<div className="style-wrapper">
					<div className="style-title">APA</div>
					<div className="style-content" dangerouslySetInnerHTML={{ __html: modeData.apa }} />
				</div>

				<div className="style-wrapper">
					<div className="style-title">Harvard</div>
					<div className="style-content" dangerouslySetInnerHTML={{ __html: modeData.harvard }} />
				</div>

				<div className="style-wrapper">
					<div className="style-title">Vancouver</div>
					<div className="style-content" dangerouslySetInnerHTML={{ __html: modeData.vancouver }} />
				</div>

				<div className="style-wrapper">
					<div className="style-title">Bibtex</div>
					<div className="style-content bibtex" dangerouslySetInnerHTML={{ __html: modeData.bibtex }} />
				</div>
			</div>
		);
	}
}

PubPresCite.propTypes = propTypes;
export default PubPresCite;
