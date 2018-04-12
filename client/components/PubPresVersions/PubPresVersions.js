import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

require('./pubPresVersions.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	mode: PropTypes.string,
};

const defaultProps = {
	mode: undefined,
};

const PubPresVersions = function(props) {
	const pubData = props.pubData;
	const activeVersion = pubData.versions[0];
	const versionsList = pubData.versionsList.map((item)=> {
		if (item.id === activeVersion.id) {
			return { ...item, isActive: true };
		}
		return item;
	}).sort((foo, bar)=>{
		if (foo.createdAt < bar.createdAt) { return 1; }
		if (foo.createdAt > bar.createdAt) { return -1; }
		return 0;
	});
	return (
		<div className="pub-pres-versions-component">
			{!props.mode &&
				<h5>Versions · Published Snapshots</h5>
			}
			<div className="intro">Published snapshots are maintained as discrete versions. Select a version below to navigate to the permalink for that published snapshot.</div>

			<div className="version-sections">
				<div className="section">
					<div className="title">All Versions</div>
					<ul className="pt-menu">
						{versionsList.map((version)=> {
							return (
								<li key={`version-${version.id}`}>
									<a href={`/pub/${pubData.slug}?version=${version.id}`} className={`pt-menu-item pt-popover-dismiss ${version.isActive ? 'pt-active' : ''}`}>
										{dateFormat(version.createdAt, 'mmm dd, yyyy · h:MMTT')}
									</a>
								</li>
							);
						})}
					</ul>
				</div>
				<div className="section">
					<div className="title">First Published</div>
					<ul className="pt-menu">
						<li>
							<a href={`/pub/${pubData.slug}?version=${versionsList[versionsList.length - 1].id}`} className="pt-menu-item pt-popover-dismiss">
								{dateFormat(versionsList[versionsList.length - 1].createdAt, 'mmm dd, yyyy · h:MMTT')}
							</a>
						</li>
					</ul>
				</div>
				<div className="section">
					<div className="title">Most Recently Updated</div>
					<ul className="pt-menu">
						<li>
							<a href={`/pub/${pubData.slug}?version=${versionsList[0].id}`} className="pt-menu-item pt-popover-dismiss">
								{dateFormat(versionsList[0].createdAt, 'mmm dd, yyyy · h:MMTT')}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

PubPresVersions.defaultProps = defaultProps;
PubPresVersions.propTypes = propTypes;
export default PubPresVersions;
