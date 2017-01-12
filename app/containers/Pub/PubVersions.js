import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Dialog, Position, Tooltip } from '@blueprintjs/core';
import { putVersion } from './actionsVersions';
import { Loader } from 'components';

let styles;

export const PubVersions = React.createClass({
	propTypes: {
		versionsData: PropTypes.array,
		pub: PropTypes.object,
		location: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			confirmPublish: undefined,
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({ confirmPublish: undefined });	
		}
	},

	setPublish: function(versionId) {
		this.setState({ confirmPublish: versionId });
	},

	publishVersion: function() {
		this.props.dispatch(putVersion(this.props.pub.id, this.state.confirmPublish));
	},

	render: function() {
		const location = this.props.location || {};
		const pathname = location.pathname;
		const query = location.query || {};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;
		return (
			<div style={styles.container}>
				<h2>Versions</h2>

				{this.props.versionsData.sort((foo, bar)=> {
					// Sort so that most recent is first in array
					if (foo.createdAt > bar.createdAt) { return -1; }
					if (foo.createdAt < bar.createdAt) { return 1; }
					return 0;
				}).map((version, index, array)=> {
					const previousVersion = index < array.length - 1 ? array[index + 1] : {};
					return (
						<div key={'version-' + version.id} style={styles.versionRow}>

							{this.props.pub.canEdit &&
								<div style={styles.smallColumn}>
									<Tooltip 
										content={
											<div>
												<div>Version is {version.isPublished ? 'Public' : 'Private'}</div>
												{!version.isPublished &&
													<div>Click to publish</div>
												}
												
											</div>
										} 
										position={Position.BOTTOM_LEFT}>
										<span onClick={version.isPublished ? ()=>{} : this.setPublish.bind(this, version.id)} className={'pt-button pt-minimal'} style={version.isPublished ? styles.noClick : {}}>
											<span className={'pt-icon-standard pt-icon-globe'} style={version.isPublished ? styles.icon : [styles.icon, styles.inactiveIcon]} />
											<span style={styles.iconSpacer} />
											<span className={'pt-icon-standard pt-icon-people'} style={styles.inactiveIcon} />
											<span style={styles.iconSpacer} />
											<span className={'pt-icon-standard pt-icon-lock'} style={version.isPublished ? [styles.icon, styles.inactiveIcon] : styles.icon} />
										</span>
									</Tooltip>
								</div>
							}
							
							<div style={styles.largeColumn}>
								{/* Link to Diff view */}
								<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/diff', query: { ...query, version: undefined, base: previousVersion.hash, target: version.hash } }}>
									<h6 style={styles.noMargin}>{version.versionMessage || 'No message'}</h6>
								</Link>
								<p style={styles.noMargin}>{dateFormat(version.createdAt, 'mmm dd, yyyy HH:MM')}</p>
							</div>
							<div style={styles.smallColumn}>
								{/* Link to pub at that version instance */}
								<Link to={{ pathname: '/pub/' + this.props.pub.slug, query: { ...query, version: version.hash } }}>	
									<button className={'pt-button p2-minimal'}>View Pub</button>
								</Link>
							</div>

							{!version.isPublished &&
								<Dialog isOpen={this.state.confirmPublish === version.id} onClose={this.setPublish.bind(this, undefined)}>
									<div className="pt-dialog-body">
										<p>Please confirm that you want to publish the following version. Once published, the version will be publicly available.</p>
										<p><b>Publishing cannot be undone.</b></p>
										<div className={'pt-card pt-elevation-2'}>
											<h6 style={styles.noMargin}>{version.versionMessage || 'No message'}</h6>
											<p style={styles.noMargin}>{dateFormat(version.createdAt, 'mmm dd, yyyy HH:MM')}</p>
										</div>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<div style={styles.loaderContainer}><Loader loading={isLoading} /></div>
											<div style={styles.loaderContainer}>{errorMessage}</div>
											<button type="button" className="pt-button" onClick={this.setPublish.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary" onClick={this.publishVersion}>Publish Version</button>
										</div>
									</div>
								</Dialog>
							}
							
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
	},
	noClick: {
		pointerEvents: 'none',
	},
	loaderContainer: {
		display: 'inline-block',
		margin: 'auto 0',
	},
};
