import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Position, Button } from '@blueprintjs/core';

require('./pubPresCite.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
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
