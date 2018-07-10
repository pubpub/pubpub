import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Overlay from 'components/Overlay/Overlay';
import PubHeader from 'components/PubHeader/PubHeader';

import { apiFetch, hydrateWrapper, nestDiscussionsToThreads, generateHash } from 'utilities';

require('./pub.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class Pub extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pubData: this.props.pubData,
		};
		this.editorRef = React.createRef();
	}

	render() {
		const pubData = this.state.pubData;
		return (
			<div id="pub-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<PubHeader
						pubData={pubData}
						locationData={this.props.locationData}
						loginData={this.props.loginData}
						setOverlayPanel={()=>{}}
						isMinimal={false}
					/>
					<div className="container pub">
						<div className="row">
							<div className="col-12 pub-columns">
								<div className="main-content">
									<p>Nature’s ecosystem provides us with an elegant example of a complex adaptive system where myriad “currencies” interact and respond to feedback systems that enable both flourishing and regulation. This collaborative model–rather than a model of exponential financial growth or the Singularity, which promises the transcendence of our current human condition through advances in technology—should provide the paradigm for our approach to artificial intelligence. More than 60 years ago, MIT mathematician and philosopher Norbert Wiener warned us that “when human atoms are knit into an organization in which they are used, not in their full right as responsible human beings, but as cogs and levers and rods, it matters little that their raw material is flesh and blood.” We should heed Wiener’s warning.</p>
									<h1>INTRODUCTION: THE CANCER OF CURRENCY</h1>
									<p>As the sun beats down on Earth, photosynthesis converts water, carbon dioxide and the sun’s energy into oxygen and glucose. Photosynthesis is one of the many chemical and biological processes that transforms one form of matter and energy into another. These molecules then get metabolized by other biological and chemical processes into yet other molecules. Scientists often call these molecules “currencies” because they represent a form of power that is transferred between cells or processes to mutual benefit—“traded,” in effect. The biggest difference between these and financial currencies is that there is no “master currency” or “currency exchange.” Rather, each currency can only be used by certain processes, and the “market” of these currencies drives the dynamics that are “life.” </p>
									<p>As certain currencies became abundant as an output of a successful process or organism, other organisms evolved to take that output and convert it into something else. Over billions of years, this is how the Earth’s ecosystem has evolved, creating vast systems of metabolic pathways and forming highly complex self-regulating systems that, for example, stabilize our body temperatures or the temperature of the Earth, despite continuous fluctuations and changes among the individual elements at every scale—from micro to macro. The output of one process becomes the input of another. Ultimately, everything interconnects.</p>
									<p>We live in a civilization in which the primary currencies are money and power—where more often than not, the goal is to accumulate both at the expense of society at large. This is a very simple and fragile system compared to the Earth’s ecosystems, where myriads of “currencies” are exchanged among processes to create hugely complex systems of inputs and outputs with feedback systems that adapt and regulate stocks, flows, and connections.</p>
									<p>Unfortunately, our current human civilization does not have the built-in resilience of our environment, and the paradigms that set our goals and drive the evolution of society today have set us on a dangerous course which the mathematician Norbert Wiener warned us about decades ago. The paradigm of a single master currency has driven many corporations and institutions to lose sight of their original missions. Values and complexity are focused more and more on prioritizing exponential financial growth, led by for-profit corporate entities that have gained autonomy, rights, power, and nearly unregulated societal influence. The behavior of these entities are akin to cancers. Healthy cells regulate their growth and respond to their surroundings, even eliminating themselves if they wander into an organ where they don’t belong. Cancerous cells, on the other hand, optimize for unconstrained growth and spread with disregard to their function or context.</p>
								</div>
								<div className="side-content">
									Side
								</div>
							</div>
						</div>
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Pub.propTypes = propTypes;
export default Pub;

hydrateWrapper(Pub);
