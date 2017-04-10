import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';

let styles;

export const PubBreadcrumbs = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		version: PropTypes.object,
		params: PropTypes.object,
		query: PropTypes.object,
	},

	render() {
		const version = this.props.version || {};
		const files = version.files || [];
		const query = this.props.query || {};
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
					<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/versions', query: query }} className={'opacity-on-hover-parent pt-button pt-minimal'} style={styles.statusLink}>
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
					</Link>
				</div>

				<ul className="pt-breadcrumbs" style={styles.breadcrumbs}>
					<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Files</Link></li>
					{currentFile &&
						<li><a className="pt-breadcrumb">{currentFile.name}</a></li>
					}
				</ul>

				{currentFile &&
					<Link to={`/pub/${this.props.pub.slug}/edit/${currentFile.name}`} style={{ marginLeft: '1em', minHeight: '25px', lineHeight: '25px' }} className={'pt-button pt-icon-edit'}>
						Edit
					</Link>
				}
			
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
