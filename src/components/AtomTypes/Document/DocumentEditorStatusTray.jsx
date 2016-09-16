import Radium from 'radium';
import React, {PropTypes} from 'react';
import {safeGetInToJS} from 'utils/safeParse';

import {renderReactFromJSON} from './proseEditor';

export const StatusTray = React.createClass({
	propTypes: {
		loading: PropTypes.boolean,
		error: PropTypes.oneOf(['disconnect', 'timeout', 'unknown']),
		participants: PropTypes.array, // full, embed, static-full, static-embed
	},

	render: function() {

		const {participants, loading, error} = this.props;

		let statusColor = 'red';
		let loadingColor = 'white';
		let loadingBorder = 'black';

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

		return (<div style={statusIcons}>
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
						        switch (error) {
						          case "disconnect": return "Cannot reach the server, there may be a problem with your internet connection. ";
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
			{participants.map((participant) => {
				return (<div style={{display: 'inline-block', margin: '0px 10px'}}> <img src={'https://jake.pubpub.org/unsafe/fit-in/20x20/' + participant.avatar_url}></img> </div>);
			})}
		</div>);

	}
});

export default Radium(StatusTray);
