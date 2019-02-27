import PropTypes from 'prop-types';
import React from 'react';

import { getRandomColor } from 'utilities';
import sharedPropTypes from './propTypes';

const propTypes = {
	loginData: sharedPropTypes.loginData,
	children: PropTypes.func.isRequired,
};

const getLocalUser = ({ loginData, pubData }) => {
	const { isDraftEditor, isManager, firebaseToken } = pubData;
	const { avatar, fullName, id, initials } = loginData;
	const loginId = id || `anon-${Math.floor(Math.random() * 9999)}`;
	const userColor = getRandomColor(loginId);
	return {
		id: loginId,
		backgroundColor: `rgba(${userColor}, 0.2)`,
		cursorColor: `rgba(${userColor}, 1.0)`,
		image: avatar || null,
		name: fullName || 'Anonymous',
		initials: initials || '?',
		canEdit: isDraftEditor || isManager,
		firebaseToken: firebaseToken,
	};
};

export default class PubCollabManager extends React.Component {
	constructor(props) {
		super(props);
		this.localUser = getLocalUser(props);
		this.state = {
			collabStatus: 'connecting',
			activeCollaborators: [this.localUser],
		};
		this.setSavingTimeout = null;
		this.handleStatusChange = this.handleStatusChange.bind(this);
	}

	handleClientChange(clients) {
		this.setState({
			activeCollaborators: [this.localUser, ...clients],
		});
	}

	handleCollabStatusChange(status) {
		clearTimeout(this.setSavingTimeout);

		/* If loading, wait until 'connected' */
		if (this.state.collabStatus === 'connecting' && status === 'connected') {
			this.setState({ collabStatus: status });
		}
		if (
			this.state.collabStatus !== 'connecting' &&
			this.state.collabStatus !== 'disconnected'
		) {
			if (status === 'saving') {
				this.setSavingTimeout = setTimeout(() => {
					this.setState({ collabStatus: status });
				}, 250);
			} else {
				this.setState({ collabStatus: status });
			}
		}
		/* If disconnected, only set state if the new status is 'connected' */
		if (this.state.collabStatus === 'disconnected' && status === 'connected') {
			this.setState({ collabStatus: status });
		}
	}

	render() {
		const { activeCollaborators, collabStatus } = this.state;
		return this.props.children({
			activeCollaborators: activeCollaborators,
			collabStatus: collabStatus,
			updateCollabStatus: this.handleStatusChange,
		});
	}
}

PubCollabManager.propTypes = propTypes;
