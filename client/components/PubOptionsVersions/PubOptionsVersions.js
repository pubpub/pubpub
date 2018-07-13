import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

require('./pubOptionsVersions.scss');

const propTypes = {
	// communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	// setPubData: PropTypes.func.isRequired,
};

class PubOptionsVersions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
		};
	}

	render() {
		const pubData = this.props.pubData;
		const activeVersion = pubData.activeVersion;
		const versions = pubData.versions.map((item)=> {
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
			<div className="pub-options-versions-component">
				<h1>Versions</h1>
				<div className="version-sections">
					<div className="section">
						<div className="title">All Versions</div>
						<ul className="pt-menu">
							{versions.map((version)=> {
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
								<a href={`/pub/${pubData.slug}?version=${versions[versions.length - 1].id}`} className="pt-menu-item pt-popover-dismiss">
									{dateFormat(versions[versions.length - 1].createdAt, 'mmm dd, yyyy · h:MMTT')}
								</a>
							</li>
						</ul>
					</div>
					<div className="section">
						<div className="title">Most Recently Updated</div>
						<ul className="pt-menu">
							<li>
								<a href={`/pub/${pubData.slug}?version=${versions[0].id}`} className="pt-menu-item pt-popover-dismiss">
									{dateFormat(versions[0].createdAt, 'mmm dd, yyyy · h:MMTT')}
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		);
	}
}

PubOptionsVersions.propTypes = propTypes;
export default PubOptionsVersions;
