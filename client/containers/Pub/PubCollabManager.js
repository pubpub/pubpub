import PropTypes from 'prop-types';
import React from 'react';
/* Firebase has some issues with their auth packages and importing */
/* conflicting dependencies. https://github.com/firebase/firebase-js-sdk/issues/752 */
/* eslint-disable-next-line import/no-extraneous-dependencies */
import firebase from '@firebase/app';

import { getRandomColor, getFirebaseConfig } from 'utilities';
import sharedPropTypes from './sharedPropTypes';

/* eslint-disable-next-line import/no-extraneous-dependencies */
require('@firebase/auth');
/* eslint-disable-next-line import/no-extraneous-dependencies */
require('@firebase/database');

const propTypes = {
	children: PropTypes.func.isRequired,
	editorChangeObject: PropTypes.shape({
		isCollabLoaded: PropTypes.bool,
	}).isRequired,
	loginData: sharedPropTypes.loginData.isRequired,
	onSectionsChange: PropTypes.func.isRequired,
	pubData: sharedPropTypes.pubData.isRequired,
};

const getLocalUser = (loginData, pubData) => {
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

const authenticateWithFirebase = (pubData) => {
	const { editorKey, firebaseToken } = pubData;
	/* Setup Firebase App */
	const firebaseAppName = `Pub-${editorKey}`;
	const existingApp = firebase.apps.reduce((prev, curr) => {
		if (curr.name === firebaseAppName) {
			return curr;
		}
		return prev;
	}, undefined);
	const firebaseApp = existingApp || firebase.initializeApp(getFirebaseConfig(), firebaseAppName);
	const database = firebase.database(firebaseApp);
	return firebase
		.auth(firebaseApp)
		.signInWithCustomToken(firebaseToken)
		.then(() => database.ref(`${pubData.editorKey}`));
};

export default class PubCollabManager extends React.Component {
	constructor(props) {
		super(props);
		this.localUser = getLocalUser(props.loginData, props.pubData);
		this.state = {
			collabStatus: 'connecting',
			activeCollaborators: [this.localUser],
			firebaseRef: null,
		};
		this.setSavingTimeout = null;
		this.firebaseRef = null;
		this.handleCollabStatusChange = this.handleCollabStatusChange.bind(this);
		this.handleClientChange = this.handleClientChange.bind(this);
	}

	componentDidMount() {
		const { onSectionsChange, pubData } = this.props;
		if (pubData.isDraft) {
			authenticateWithFirebase(pubData).then((firebaseRef) => {
				firebaseRef.child('/sections').on('value', onSectionsChange);
				this.setState({ firebaseRef: firebaseRef });
				/* Add listener event to update sectionsData when it changes in Firebase */
			});
			window.addEventListener('keydown', this.handleKeyPressEvents);
		}
	}

	componentWillUnmount() {
		const { onSectionsChange } = this.props;
		const { firebaseRef } = this.state;
		if (firebaseRef) {
			firebaseRef.child('/sections').off('value', onSectionsChange);
		}
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
		const { pubData, editorChangeObject } = this.props;
		const { activeCollaborators, collabStatus, firebaseRef } = this.state;
		return this.props.children({
			activeCollaborators: activeCollaborators,
			collabStatus: collabStatus,
			handleCollabStatusChange: this.handleCollabStatusChange,
			handleClientChange: this.handleClientChange,
			isCollabLoading: pubData.isDraft && !editorChangeObject.isCollabLoaded,
			firefbaseRef: firebaseRef,
		});
	}
}

PubCollabManager.propTypes = propTypes;
