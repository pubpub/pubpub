import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import Overlay from 'components/Overlay/Overlay';

require('./pubSettings.scss');

const propTypes = {
	settingsMode: PropTypes.string,
	setSettingsMode: PropTypes.func.isRequired,
	pubData: PropTypes.object.isRequired,
};

const defaultProps = {
	settingsMode: undefined,
};

class PubSettings extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const pubData = this.props.pubData;
		
		return (
			<Overlay
				isOpen={this.props.settingsMode}
				onClose={()=> { this.props.setSettingsMode(undefined); }}
				maxWidth={928}
			>
				<div className="pub-settings-component">
					<div className="left-column">
						<ul className="pt-menu">
							<li><a class="pt-menu-item" tabindex="0">Details</a></li>
							<li><a class="pt-menu-item" tabindex="0">Versions</a></li>
							<li><a class="pt-menu-item pt-active" tabindex="0">Permissions</a></li>
							<li><a class="pt-menu-item" tabindex="0">Metadata</a></li>
							<li><a class="pt-menu-item" tabindex="0">Settings</a></li>
							<li><a class="pt-menu-item" tabindex="0">Search</a></li>
						</ul>
					</div>
					<div className="right-column">
						<h1>{this.props.settingsMode}</h1>
						<p>Nature’s ecosystem provides us with an elegant example of a complex adaptive system where myriad “currencies” interact and respond to feedback systems that enable both flourishing and regulation. This collaborative model–rather than a model of exponential financial growth or the Singularity, which promises the transcendence of our current human condition through advances in technology—should provide the paradigm for our approach to artificial intelligence. More than 60 years ago, MIT mathematician and philosopher Norbert Wiener warned us that “when human atoms are knit into an organization in which they are used, not in their full right as responsible human beings, but as cogs and levers and rods, it matters little that their raw material is flesh and blood.” We should heed Wiener’s warning.</p>
						<h1>INTRODUCTION: THE CANCER OF CURRENCY</h1>
						<p>As the sun beats down on Earth, photosynthesis converts water, carbon dioxide and the sun’s energy into oxygen and glucose. Photosynthesis is one of the many chemical and biological processes that transforms one form of matter and energy into another. These molecules then get metabolized by other biological and chemical processes into yet other molecules. Scientists often call these molecules “currencies” because they represent a form of power that is transferred between cells or processes to mutual benefit—“traded,” in effect. The biggest difference between these and financial currencies is that there is no “master currency” or “currency exchange.” Rather, each currency can only be used by certain processes, and the “market” of these currencies drives the dynamics that are “life.” </p>
						<p>As certain currencies became abundant as an output of a successful process or organism, other organisms evolved to take that output and convert it into something else. Over billions of years, this is how the Earth’s ecosystem has evolved, creating vast systems of metabolic pathways and forming highly complex self-regulating systems that, for example, stabilize our body temperatures or the temperature of the Earth, despite continuous fluctuations and changes among the individual elements at every scale—from micro to macro. The output of one process becomes the input of another. Ultimately, everything interconnects.</p>
						<p>We live in a civilization in which the primary currencies are money and power—where more often than not, the goal is to accumulate both at the expense of society at large. This is a very simple and fragile system compared to the Earth’s ecosystems, where myriads of “currencies” are exchanged among processes to create hugely complex systems of inputs and outputs with feedback systems that adapt and regulate stocks, flows, and connections.</p>
					</div>
				</div>
			</Overlay>
		);
	}
};

PubSettings.propTypes = propTypes;
PubSettings.defaultProps = defaultProps;
export default PubSettings;
