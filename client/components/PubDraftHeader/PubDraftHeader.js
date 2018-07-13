import React, { Component } from 'react';
import PropTypes from 'prop-types';
import throttle from 'lodash.throttle';
import { Tooltip } from '@blueprintjs/core';
import Avatar from 'components/Avatar/Avatar';

require('./pubDraftHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	// locationData: PropTypes.object,
	setOptionsMode: PropTypes.func.isRequired,
	onRef: PropTypes.func.isRequired,
	bottomCutoffId: PropTypes.string,
	collabStatus: PropTypes.string.isRequired,
	activeCollaborators: PropTypes.array.isRequired,
};

const defaultProps = {
	// locationData: { params: {} },
	bottomCutoffId: '',
};

class PubDraftHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isFixed: false,
		};

		this.calculateIfFixed = this.calculateIfFixed.bind(this);
		this.headerRef = React.createRef();
		this.bottomCutoffElem = null;
		this.handleScroll = throttle(this.calculateIfFixed, 50, { leading: true, trailing: true });
	}

	componentDidMount() {
		this.calculateIfFixed();
		window.addEventListener('scroll', this.handleScroll);
		this.bottomCutoffElem = document.getElementById(this.props.bottomCutoffId);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	calculateIfFixed() {
		/* 73 is the height of .wrapper */
		const isOverBottom = this.bottomCutoffElem && this.bottomCutoffElem.getBoundingClientRect().top < 73;
		if (!this.state.isFixed) {
			const isAboveTop = this.headerRef.current.getBoundingClientRect().top < 0;
			if (isAboveTop && !isOverBottom) {
				this.setState({ isFixed: true });
			}
		} else {
			const isBelowTop = this.headerRef.current.getBoundingClientRect().top > 0;
			if (isBelowTop || isOverBottom) {
				this.setState({ isFixed: false });
			}
		}
	}

	render() {
		const pubData = this.props.pubData;
		const uniqueActiveCollaborators = {};
		this.props.activeCollaborators.forEach((item)=> {
			if (item.initials !== '?') {
				uniqueActiveCollaborators[item.id] = item;
			}
		});
		const numAnonymous = this.props.activeCollaborators.reduce((prev, curr)=> {
			if (curr.initials === '?') { return prev + 1; }
			return prev;
		}, 0);
		if (numAnonymous) {
			uniqueActiveCollaborators.anon = {
				backgroundColor: 'rgba(96,96,96, 0.2)',
				cursorColor: 'rgba(96,96,96, 1.0)',
				id: 'anon',
				initials: numAnonymous,
				name: `${numAnonymous} anonymous user${numAnonymous === 1 ? '' : 's'}`,
			};
		}
		return (
			<div className="pub-draft-header-component" ref={this.headerRef}>
				<div className={`wrapper ${this.state.isFixed ? 'fixed' : ''}`}>
					<div className="container pub">
						<div className="row">
							<div className="col-12">
								<div className="left-section">
									<span className={`collab-status ${this.props.collabStatus}`}>
										<span>Working Draft </span>
										{this.props.collabStatus}
										{this.props.collabStatus === 'saving' || this.props.collabStatus === 'connecting' ? '...' : ''}
									</span>
								</div>
								<div className="right-section">
									<button className="pt-button pt-intent-primary pt-small" type="button" onClick={()=> { this.props.setOptionsMode('saveVersion'); }}>Save Version</button>
								</div>
							</div>
							<div className="col-12">
								<div className="left-section" ref={this.props.onRef} key="wrapper" />
								<div className="right-section">
									{Object.keys(uniqueActiveCollaborators).map((key)=> {
										return uniqueActiveCollaborators[key];
									}).filter((item)=> {
										return item && item.id !== this.props.loginData.id;
									}).map((collaborator)=> {
										return (
											<div className="avatar-wrapper" key={`present-avatar-${collaborator.id}`}>
												<Tooltip
													content={collaborator.name}
													tooltipClassName="pt-dark"
												>
													<Avatar
														/* Cast userInitials to string since
														the anonymous Avatar is a int count */
														userInitials={String(collaborator.initials)}
														userAvatar={collaborator.image}
														borderColor={collaborator.cursorColor}
														borderWidth="2px"
														width={24}
													/>
												</Tooltip>
											</div>
										);
									})}
									<button className="pt-button pt-small" type="button">
										Editing
										<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PubDraftHeader.propTypes = propTypes;
PubDraftHeader.defaultProps = defaultProps;
export default PubDraftHeader;
