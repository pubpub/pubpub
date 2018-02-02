import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./pubPresCite.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
};

class PubPresCite extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mode: 'pub',
		};
	}

	render() {
		const pubData = this.props.pubData;
		const modeData = this.state.mode === 'pub'
			? pubData.citationData.pub
			: pubData.citationData.version;

		return (
			<div className="pub-pres-cite-component">
				<div className={'pt-button-group pt-small'}>
					<button className={`pt-button ${this.state.mode === 'pub' ? 'pt-active' : ''}`} onClick={()=> { this.setState({ mode: 'pub' }); }}>Cite the Work</button>
					<button className={`pt-button ${this.state.mode === 'version' ? 'pt-active' : ''}`} onClick={()=> { this.setState({ mode: 'version' }); }}>Cite this Version</button>
				</div>

				<h5>Cite</h5>
				
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
