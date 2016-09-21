import ElementPortal from 'react-element-portal';
import Radium from 'radium';
import React, {PropTypes} from 'react';

const pulseKeyframes = Radium.keyframes({
  '0%': {opacity: '0', transform: 'translateX(-10px)'},
  '100%': {opacity: '1', transform: 'translateX(0px)'},
}, 'pulse');


export const StatusTray = React.createClass({
	propTypes: {
		status: PropTypes.oneOf(['loading', 'connected', 'reconnecting', 'disconnected', 'timeout', 'unknown']),
		statusMsg: PropTypes.string,
		participants: PropTypes.array, // full, embed, static-full, static-embed
	},

	render: function() {

		const {participants, status} = this.props;

		const loading = (status === 'loading' || status === 'reconnecting');
		const error = (status === 'reconnecting' || status === 'disconnected' || status === 'timeout');

		let loadingColor = '#F3F3F4';
		// let loadingBorder = '(!error) ? 'black' : 'red'';
		const loadingBorder = 'black';

		const statusIcons = {
			position: 'absolute',
			top: '-30px',
			left: '30px',
			zIndex: 10000,
		};

		const statusLoaded = {
			width: '16px',
			height: '16px',
			borderRadius: '2px',
			display: 'inline-block',
			backgroundColor: 'white',
			padding: '0px',
			border: '2px solid black',
			color: 'black',
			lineHeight: '16px',
			position: 'relative',
			top: '-4px',
			cursor: 'default',
		};

		const statusBox = {
			padding: '15px',
			width: '250px',
		};

		return (

			<ElementPortal id="editor-participants">

			<div>
			<div style={{display: 'inline-block'}}>
				{(loading) ?
					<span style={{backgroundColor: loadingColor, borderColor: loadingBorder}} className="connection-loader">
						<span className="connection-loader-inner"/>
					</span>
					: <span className={'arrow-down-button no-arrow'} style={statusLoaded}>
					{(!error) ?
					<span>
						<span>✓</span>
						<div className={'hoverChild arrow-down-child'} style={statusBox}>
							<div>
								<div><strong>Connection:</strong> Online.</div>
								<div className={'light-color subtext'}>Your changes will be live synced to all collaborators.</div>
							</div>
						</div>
					</span>
					:
					<span>
						<span>✕</span>
						<div className={'hoverChild arrow-down-child'} style={statusBox}>
							<div>
								<div><strong>Connection:</strong> Disconnected.</div>
								<div className={'light-color subtext'}>
									{(() => {
						        switch (status) {
						          case "disconnected": return "Cannot reach the server, there may be a problem with your internet connection. ";
						          case "timeout": return  "Cannot reach the server, there may be a problem with your internet connection. Changes are not being synced.";
						          case "unknown":  return  "Unknown error, please contact us.";
						          default:return "Unknown error, please contact us.";
						        }
						      })()}
								</div>
							</div>
						</div>
					</span>
					}
				</span>}
			</div>

			{(!loading && !error) ?
				participants.map((participant) => {
					return (<div key={participant.name} style={{display: 'inline-block', margin: '0px 10px', animation: 'x 1s ease', animationName: pulseKeyframes}}> <img src={'https://jake.pubpub.org/unsafe/fit-in/20x20/' + participant.avatar_url}></img> </div>);
				})
			: null }
		</div>
	</ElementPortal>
	);

	}
});

export default Radium(StatusTray);
