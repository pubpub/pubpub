import React, { PropTypes } from 'react';

// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import { globalStyles } from 'utils/globalStyles';

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

		// const mainFile = files.reduce((previous, current)=> {
		// 	if (version.defaultFile === current.name) { return current; }
		// 	if (!version.defaultFile && current.name.split('.')[0] === 'main') { return current; }
		// 	return previous;
		// }, files[0]);

		const routeFile = files.reduce((previous, current)=> {
			if (current.name === routeFilename) { return current; }
			return previous;
		}, undefined);

		if (!files.length) { return <div />; }

		let mode = 'Private';
		if (version.isRestricted) { mode = 'Restricted'; }
		if (version.isPublished) { mode = 'Published'; }

		return (
			<div style={styles.container}>
				<div style={styles.versionStatus}>
					<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/versions', query: query }} className={'opacity-on-hover-parent pt-button pt-minimal'} style={styles.statusLink}>
						{dateFormat(version.createdAt, 'mmmm dd, yy')} · {mode}
						{mode === 'Private' &&
							<span style={styles.modeIcon} className={'pt-icon-standard pt-icon-lock opacity-on-hover-child'} />
						}
						{mode === 'Restricted' &&
							<span style={styles.modeIcon} className={'pt-icon-standard pt-icon-people opacity-on-hover-child'} />
						}
						{mode === 'Published' &&
							<span style={styles.modeIcon} className={'pt-icon-standard pt-icon-globe opacity-on-hover-child'} />
						}
					</Link>
				</div>
				<ul className="pt-breadcrumbs" style={styles.breadcrumbs}>
					<li><Link to={{ pathname: '/pub/' + this.props.pub.slug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> Files</Link></li>

					{meta !== 'files' && !routeFilename &&
						<li><a className="pt-breadcrumb">Main</a></li>
					}

					{!!routeFilename &&
						<li><a className="pt-breadcrumb">{routeFile.name}</a></li>
					}

				</ul>
				
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
	modeIcon: {
		paddingLeft: '0.5em',
		color: '#5c7080',
		margin: 0,
	},
};
