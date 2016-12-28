import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Position, Tooltip } from '@blueprintjs/core';

let styles;

export const PubVersions = React.createClass({
	propTypes: {
		versionsData: PropTypes.array,
		pubSlug: PropTypes.string,
		location: PropTypes.object,
	},

	setPublic: function(versionId) {
		console.log('Publishing ', versionId);
	},

	render: function() {
		const location = this.props.location || {};
		const query = location.query || {};
		return (
			<div style={styles.container}>
				<h2>Versions</h2>

				{this.props.versionsData.sort((foo, bar)=> {
					// Sort so that most recent is first in array
					if (foo.createdAt > bar.createdAt) { return -1; }
					if (foo.createdAt < bar.createdAt) { return 1; }
					return 0;
				}).map((item)=> {
					return (
						<div key={'version-' + item.id} style={styles.versionRow}>

							<div style={styles.smallColumn}>
								<Tooltip 
									content={
										<div>
											<div>Currently {item.isPublished ? 'Public' : 'Private'}: </div>
											<div>Click to publish</div>
										</div>
									} 
									position={Position.BOTTOM_LEFT}>
									<span onClick={this.setPublic.bind(this, item.id)} className={'pt-button pt-minimal'}>
										<span className={'pt-icon-standard pt-icon-globe'} style={item.isPublished ? styles.icon : [styles.icon, styles.inactiveIcon]} />
										<span style={styles.iconSpacer} />
										<span className={'pt-icon-standard pt-icon-lock'} style={item.isPublished ? [styles.icon, styles.inactiveIcon] : styles.icon} />
									</span>
								</Tooltip>
							</div>
							
							<div style={styles.largeColumn}>
								{/* Link to Diff view */}
								<h6 style={styles.noMargin}>{item.versionMessage || 'No message'}</h6>
								<p style={styles.noMargin}>{dateFormat(item.createdAt, 'mmm dd, yyyy HH:MM')}</p>
							</div>
							<div style={styles.smallColumn}>
								{/* Link to pub at that version instance */}
								<Link to={{ pathname: '/pub/' + this.props.pubSlug, query: { ...query, version: item.hash } }}>	
									<button className={'pt-button p2-minimal'}>View Pub</button>
								</Link>
							</div>
							
						</div>
					);
				})}

			</div>
		);
	}
});

export default Radium(PubVersions);

styles = {
	container: {
		padding: '1.5em',
	},
	noMargin: {
		margin: 0,
	},
	versionRow: {
		display: 'table',
		width: '100%',
		margin: '1em 0em 0em',
		padding: '1em 0em 0em',
		borderTop: '1px solid #CCC',
		verticalAlign: 'middle',
	},
	smallColumn: {
		display: 'table-cell',
		width: '1%',
		whiteSpace: 'nowrap',
		verticalAlign: 'middle',
	}, 
	largeColumn: {
		display: 'table-cell',
		width: '100%',
		padding: '0em 1em',
		verticalAlign: 'middle',
	},
	inactiveIcon: {
		opacity: '.25',
	},
	icon: {
		margin: 0,
		lineHeight: 'inherit',
	},
	iconSpacer: { 
		width: '0.5em', 
		height: '1em', 
		display: 'inline-block',
	}
};
