import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { Menu } from '@blueprintjs/core';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import { FormattedRelative } from 'react-intl';

let styles;

export const PubBreadcrumbs = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		version: PropTypes.object,
		versions: PropTypes.array,
		params: PropTypes.object,
		pathname: PropTypes.string,
		query: PropTypes.object,
	},

	render() {
		const version = this.props.version || {};
		const versions = this.props.versions || [];
		const files = version.files || [];
		const query = this.props.query || {};
		const pathname = this.props.pathname || '';
		const params = this.props.params || {};
		const meta = params.meta;
		const routeFilename = params.filename;

		const mainFile = files.reduce((previous, current)=> {
			if (version.defaultFile === current.name) { return current; }
			if (!version.defaultFile && current.name.split('.')[0] === 'main') { return current; }
			return previous;
		}, files[0]);

		const routeFile = files.reduce((previous, current)=> {
			if (current.name === routeFilename) { return current; }
			return previous;
		}, undefined);

		const currentFile = meta === 'files' ? routeFile : mainFile;

		if (!files.length) { return <div />; }

		let privacy = 'Private';
		if (version.isRestricted) { privacy = 'Restricted'; }
		if (version.isPublished) { privacy = 'Published'; }

		return (
			<div style={styles.container}>
				<div style={styles.versionStatus}>
					{/*<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/versions', query: query }} className={'opacity-on-hover-parent pt-button pt-minimal'} style={styles.statusLink}>
						{dateFormat(version.createdAt, 'mmmm dd, yyyy')} · {privacy}
						{privacy === 'Private' &&
							<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
						}
						{privacy === 'Restricted' &&
							<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
						}
						{privacy === 'Published' &&
							<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
						}
					</Link>*/}
					<DropdownButton 
						content={
							<Menu>
								{versions.filter((item, index)=> {
									return index < 10;
								}).map((versionItem, index)=> {
									let currentPrivacy = 'Private';
									if (versionItem.isRestricted) { currentPrivacy = 'Restricted'; }
									if (versionItem.isPublished) { currentPrivacy = 'Published'; }
									return (
										<li key={`version-menuitem-${index}`} style={versionItem.id === version.id ? { fontWeight: 'bold' } : {}}>
											<Link className="pt-menu-item pt-popover-dismiss" to={{ pathname: pathname, query: { ...query, version: versionItem.hash } }}>
												<FormattedRelative value={versionItem.createdAt} /> · {currentPrivacy}
												{currentPrivacy === 'Private' &&
													<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
												}
												{currentPrivacy === 'Restricted' &&
													<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
												}
												{currentPrivacy === 'Published' &&
													<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
												}
											</Link>
										</li>
									);	
								})}
								<li key={'version-menuitem-all'}>
									<Link className="pt-menu-item pt-popover-dismiss" style={{ fontStyle: 'italic' }} to={`/pub/${this.props.pub.slug}/versions`}>
										Show All Versions
									</Link>
								</li>
							</Menu>
						}
						title={
							<span>
								{dateFormat(version.createdAt, 'mmmm dd, yyyy')} · {privacy}
								{privacy === 'Private' &&
									<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
								}
								{privacy === 'Restricted' &&
									<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
								}
								{privacy === 'Published' &&
									<span style={styles.privacyIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
								}
							</span>
						} 
						position={2} />
				</div>

				{currentFile && 
					<DropdownButton 
						content={
							<Menu>
								{files.map((file, index)=> {
									return (
										<li key={`file-menuitem-${index}`}>
											<Link className="pt-menu-item pt-popover-dismiss" to={{ pathname: `/pub/${this.props.pub.slug}/files/${file.name}`, query: query }}>
												{file.name} {version.defaultFile === file.name && <span className={'pt-tag pt-minimal'}>Main File</span>}
											</Link>
										</li>
									);	
								})}
								<li key={'file-menuitem-all'}>
									<Link className="pt-menu-item pt-popover-dismiss" style={{ fontStyle: 'italic' }} to={`/pub/${this.props.pub.slug}/files`}>
										Show All Files
									</Link>
								</li>
							</Menu>
						}
						title={<a className="pt-breadcrumb">File: {currentFile.name}</a>} 
						position={0} />
				}

				{/*<ul className="pt-breadcrumbs" style={styles.breadcrumbs}>
					<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Files</Link></li>
					{currentFile &&
						<li><a className="pt-breadcrumb">{currentFile.name}</a></li>
					}
				</ul>*/}

				{/*currentFile &&
					<Link to={`/pub/${this.props.pub.slug}/edit/${currentFile.name}`} style={{ marginLeft: '1em', minHeight: '25px', lineHeight: '25px' }} className={'pt-button pt-icon-edit'}>
						Edit
					</Link>
				*/}
			
			</div>
		);
	},

});

export default Radium(PubBreadcrumbs);

styles = {
	container: {
		marginBottom: '2em',
		padding: '1em 0em 0em',
		borderBottom: '1px solid #CCC',
		zIndex: 10,
		minHeight: '45px',
	},
	breadcrumbs: {
		minHeight: '30px',
	},
	versionStatus: {
		float: 'right',
		lineHeight: '30px',
	},
	statusLink: {
		display: 'inline-block',
		padding: '0px 2px',
	},
	privacyIcon: {
		paddingLeft: '0.5em',
		color: '#5c7080',
		margin: 0,
	},
};
