import React from 'react';
import PropTypes from 'prop-types';
import { initFirebase } from 'utilitiesFirebaseClient';

const propTypes = {
	pubData: PropTypes.object.isRequired,
	children: PropTypes.func.isRequired,
};

class PubSyncManager extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firebaseRootRef: undefined,
			firebaseBranchRef: undefined,
			pubData: this.props.pubData,
		};
	}

	componentDidMount() {
		const rootKey = `pub-${this.props.pubData.id}`;
		const branchKey = `branch-${this.props.pubData.activeBranch.id}`;
		initFirebase(rootKey, this.props.pubData.firebaseToken).then((rootRef) => {
			this.firebaseRootRef = rootRef;
			this.setState({
				firebaseRootRef: rootRef,
				firebaseBranchRef: rootRef.child(branchKey),
			});

			this.firebaseRootRef.child('metadata').on('child_changed', this.syncMetadata);
		});
	}

	componentWillUnmount() {
		if (this.state.firebaseRootRef) {
			this.firebaseRootRef.child('metadata').off('child_changed', this.syncMetadata);
		}
	}

	syncMetadata(snapshot) {
		this.setState({ [snapshot.key]: snapshot.val() });
	}

	updateLocalPubData(newPubData) {
		this.setState(
			(prevState) => {
				return {
					pubData: {
						...prevState.pubData,
						...newPubData,
					},
				};
			},
			() => {
				const keysToSync = [
					'attributions',
					'avatar',
					'branchPermissions',
					'branches',
					'citationData',
					'description',
					'discussions',
					'doi',
					'downloads',
					'isCommunityAdminManaged',
					'labels',
					'managers',
					'pubTags',
					'slug',
					'title',
					'useHeaderImage',
				];
				const firebaseSyncData = {};
				keysToSync.forEach((key) => {
					if (key in newPubData) {
						firebaseSyncData[key] = newPubData[key];
					}
				});
				this.firebaseRootRef.child('metadata').update(firebaseSyncData);
			},
		);
	}

	render() {
		return this.props.children({
			pubData: this.state.pubData,
			firebaseBranchRef: this.state.firebaseBranchRef,
			updateLocalPubData: this.updateLocalPubData,
		});
	}
}

PubSyncManager.propTypes = propTypes;
export default PubSyncManager;
