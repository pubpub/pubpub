import React from 'react';
import PropTypes from 'prop-types';
import Overlay from 'components/Overlay/Overlay';
import PubOptionsAnalytics from 'components/PubOptionsAnalytics/PubOptionsAnalytics';
import PubOptionsAttribution from 'components/PubOptionsAttribution/PubOptionsAttribution';
import PubOptionsCite from 'components/PubOptionsCite/PubOptionsCite';
import PubOptionsDoi from 'components/PubOptionsDoi/PubOptionsDoi';
import PubOptionsDetails from 'components/PubOptionsDetails/PubOptionsDetails';
import PubOptionsDelete from 'components/PubOptionsDelete/PubOptionsDelete';
import PubOptionsExport from 'components/PubOptionsExport/PubOptionsExport';
import PubOptionsImport from 'components/PubOptionsImport/PubOptionsImport';
import PubOptionsPages from 'components/PubOptionsPages/PubOptionsPages';
import PubOptionsSections from 'components/PubOptionsSections/PubOptionsSections';
import PubOptionsSharing from 'components/PubOptionsSharing/PubOptionsSharing';
import PubOptionsSocial from 'components/PubOptionsSocial/PubOptionsSocial';
import PubOptionsSaveVersion from 'components/PubOptionsSaveVersion/PubOptionsSaveVersion';
import PubOptionsVersions from 'components/PubOptionsVersions/PubOptionsVersions';


require('./pubOptions.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	firebaseRef: PropTypes.object,
	editorRefNode: PropTypes.object,
	optionsMode: PropTypes.string,
	setOptionsMode: PropTypes.func.isRequired,
	setPubData: PropTypes.func.isRequired,
};

const defaultProps = {
	firebaseRef: undefined,
	editorRefNode: undefined,
	optionsMode: undefined,
};

const PubOptions = (props)=> {
	const optionsMode = props.optionsMode;
	// TODO: Hide based on canManage, and other metrics
	// TODO: Hide sections if we are not in draft, and there are no sections
	const modes = ['details', 'attribution', 'versions', 'pages', 'sharing', 'cite', 'DOI', 'sections', 'social', 'export', 'import', 'analytics', 'delete'];

	const defaultChildProps = {
		communityData: props.communityData,
		pubData: props.pubData,
		loginData: props.loginData,
		locationData: props.locationData,
		firebaseRef: props.firebaseRef,
		editorRefNode: props.editorRefNode,
		setOptionsMode: props.setOptionsMode,
		setPubData: props.setPubData,
		canManage: props.pubData.isManager,
	};

	const leftColumnStyle = optionsMode === 'saveVersion'
		? { display: 'none' }
		: {};

	return (
		<Overlay
			isOpen={optionsMode}
			onClose={()=> { props.setOptionsMode(undefined); }}
			maxWidth={928}
		>
			<div className="pub-options-component">
				{/* Left Navigation Buttons */}
				<div className="left-column" style={leftColumnStyle}>
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
					{optionsMode === 'analytics' &&
						<PubOptionsAnalytics key="analytics" {...defaultChildProps} />
					}
					{optionsMode === 'attribution' &&
						<PubOptionsAttribution key="attribution" {...defaultChildProps} />
					}
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
					{optionsMode === 'export' &&
						<PubOptionsExport key="export" {...defaultChildProps} />
					}
					{optionsMode === 'import' &&
						<PubOptionsImport key="import" {...defaultChildProps} />
					}
					{optionsMode === 'pages' &&
						<PubOptionsPages key="pages" {...defaultChildProps} />
					}
					{optionsMode === 'sections' &&
						<PubOptionsSections key="sections" {...defaultChildProps} />
					}
					{optionsMode === 'sharing' &&
						<PubOptionsSharing key="sharing" {...defaultChildProps} />
					}
					{optionsMode === 'social' &&
						<PubOptionsSocial key="social" {...defaultChildProps} />
					}
					{optionsMode === 'saveVersion' &&
						<PubOptionsSaveVersion key="saveVersion" {...defaultChildProps} />
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
