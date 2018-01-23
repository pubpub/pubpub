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
	});
	return (
		<div className="pub-pres-versions-component">
			{!props.mode &&
				<h5>Versions · Published Snapshots</h5>
			}
			<div className="intro">Published snapshots are maintained as discrete versions. Select a version below to navigate to the permalink for that published snapshot.</div>
			<ul className="pt-menu">
				{versionsList.sort((foo, bar)=>{
					if (foo.createdAt < bar.createdAt) { return 1; }
					if (foo.createdAt > bar.createdAt) { return -1; }
					return 0;
				}).map((version)=> {
					return (
						<li key={`version-${version.id}`}>
							<a href={`/pub/${pubData.slug}?version=${version.id}`} className="pt-menu-item pt-popover-dismiss">
								<span style={{ fontWeight: version.isActive ? '600' : 'normal' }}>
									{dateFormat(version.createdAt, 'mmm dd, yyyy · h:MM TT')}
								</span>
							</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

PubPresVersions.defaultProps = defaultProps;
PubPresVersions.propTypes = propTypes;
export default PubPresVersions;
