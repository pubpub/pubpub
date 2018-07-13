import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'components/Overlay/Overlay';
import PubOptionsCite from 'components/PubOptionsCite/PubOptionsCite';
import PubOptionsDoi from 'components/PubOptionsDoi/PubOptionsDoi';
import PubOptionsDetails from 'components/PubOptionsDetails/PubOptionsDetails';
import PubOptionsDelete from 'components/PubOptionsDelete/PubOptionsDelete';
import PubOptionsPages from 'components/PubOptionsPages/PubOptionsPages';
import PubOptionsSections from 'components/PubOptionsSections/PubOptionsSections';
import PubOptionsSocial from 'components/PubOptionsSocial/PubOptionsSocial';
import PubOptionsVersions from 'components/PubOptionsVersions/PubOptionsVersions';


require('./pubOptions.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	firebaseRef: PropTypes.object,
	optionsMode: PropTypes.string,
	setOptionsMode: PropTypes.func.isRequired,
	setPubData: PropTypes.func.isRequired,
};

const defaultProps = {
	firebaseRef: undefined,
	optionsMode: undefined,
};

const PubOptions = (props)=> {
	const optionsMode = props.optionsMode;
	// TODO: Hide sections if we are not in draft, and there are no sections
	const modes = ['details', 'versions', 'pages', 'sharing', 'cite', 'DOI', 'sections', 'social', 'export', 'analytics', 'delete'];
	const defaultChildProps = {
		communityData: props.communityData,
		pubData: props.pubData,
		loginData: props.loginData,
		locationData: props.locationData,
		firebaseRef: props.firebaseRef,
		setPubData: props.setPubData,
	};

	return (
		<Overlay
			isOpen={optionsMode}
			onClose={()=> { props.setOptionsMode(undefined); }}
			maxWidth={928}
		>
			<div className="pub-options-component">
				{/* Left Navigation Buttons */}
				<div className="left-column">
					<ul className="pt-menu">
						{modes.map((mode)=> {
							return (
								<li key={mode}>
									<button
										type="button"
										onClick={()=> { props.setOptionsMode(mode); }}
										className={`pt-menu-item ${optionsMode === mode ? 'pt-active' : ''}`}
										tabIndex="0"
									>
										{mode}
									</button>
								</li>
							);
						})}
					</ul>
				</div>

				{/* Right Content Panel */}
				<div className="right-column">
					{optionsMode === 'cite' &&
						<PubOptionsCite key="cite" {...defaultChildProps} />
					}
					{optionsMode === 'DOI' &&
						<PubOptionsDoi key="doi" {...defaultChildProps} />
					}
					{optionsMode === 'details' &&
						<PubOptionsDetails key="details" {...defaultChildProps} />
					}
					{optionsMode === 'delete' &&
						<PubOptionsDelete key="delete" {...defaultChildProps} />
					}
					{optionsMode === 'pages' &&
						<PubOptionsPages key="pages" {...defaultChildProps} />
					}
					{optionsMode === 'sections' &&
						<PubOptionsSections key="sections" {...defaultChildProps} />
					}
					{optionsMode === 'social' &&
						<PubOptionsSocial key="social" {...defaultChildProps} />
					}
					{optionsMode === 'versions' &&
						<PubOptionsVersions key="versions" {...defaultChildProps} />
					}
				</div>
			</div>
		</Overlay>
	);
};

PubOptions.propTypes = propTypes;
PubOptions.defaultProps = defaultProps;
export default PubOptions;
