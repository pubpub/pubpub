import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Editor from '@pubpub/editor';
import { EditableText, Button, Portal } from '@blueprintjs/core';
import { initFirebase } from 'utilitiesFirebaseClient';
import { hydrateWrapper } from 'utilities';

require('./pubNew.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
};

class PubNew extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firebaseRootRef: undefined,
			firebaseBranchRef: undefined,
			title: this.props.pubData.title,
			showThing: false,
		};
		this.handleMetadataSync = this.handleMetadataSync.bind(this);
		this.handleTitleCancel = this.handleTitleCancel.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleTitleSave = this.handleTitleSave.bind(this);
	}

	componentDidMount() {
		const rootKey = `pub-${this.props.pubData.id}`;
		const branchKey = `branch-${this.props.pubData.branchId}`;
		initFirebase(rootKey, this.props.pubData.firebaseToken).then((rootRef) => {
			this.firebaseRootRef = rootRef;
			this.setState({
				firebaseRootRef: rootRef,
				firebaseBranchRef: rootRef.child(branchKey),
			});

			this.firebaseRootRef.child('metadata').on('child_changed', this.handleMetadataSync);
		});
	}

	componentWillUnmount() {
		if (this.state.firebaseRootRef) {
			this.firebaseRootRef.child('metadata').off('child_changed', this.handleMetadataSync);
		}
	}

	/*
		All metadata changes will need to 
		1) update postgres
		2) update firebase
		3) update local state
	*/

	handleMetadataSync(snapshot) {
		this.setState({ [snapshot.key]: snapshot.val() });
	}

	handleTitleCancel() {
		this.setState({ title: this.props.pubData.title });
	}

	handleTitleChange(newTitle) {
		this.setState({ title: newTitle.replace(/\n/g, '') });
	}

	handleTitleSave(newTitle) {
		this.firebaseRootRef.child('metadata/title').set(newTitle);
	}

	render() {
		/*
			I think we'll still have the model of:
			apiFetch()
			.then(() => {
				newObject = { ...object, key: updatedVal }
				updateState(newObject)
			})
			That is, we'll make a distinct API call, merge the result into our structured
			pubData, and then write that to firebase. We should be clear to only have those two writes
			though. No other state or storage should be necessary.
		*/
		const container =
			typeof document !== 'undefined' && document.getElementsByClassName('test-comp')[0];
		console.log('container is', container);
		return (
			<div id="pub-new-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					{container && (
						<React.Fragment>
							<Portal
								key={Math.random()}
								container={container}
								className="insert-portal"
							>
								<Button
									className="preview"
									minimal={true}
									onClick={() => {
										this.setState({ showThing: !this.state.showThing });
									}}
									text="I'm a preview!"
								/>
								{this.state.showThing && (
									<div className="content">
										<p>
											<strong>Mike: </strong>Here is some nicely formatted
											content.
										</p>
										<p>
											<strong>Megan: </strong>That is indeed nicely formatted.
											Bravo
										</p>
										<p>
											<strong>Mikal: </strong>Uhhh - gorgeous formatting. Wow.
											Double 5-stars!
										</p>
										<input type="text" className="bp3-input bp3-fill" />
									</div>
								)}
							</Portal>
						</React.Fragment>
					)}

					{/* <PubSyncManager pubData={this.props.pubData}>
						{(pubData, firebaseBranchRef, updateLocalPubData)=> (
							<PubHeader
								mode={this.state.mode} // This should probably just come from locationData
								pubData={pubData}
								updateLocalPubData={updateLocalPubData}
							/>
							{this.state.mode === 'document' &&
								<PubEditingHeader pubData={pubData} />
								<PubBody pubData={pubData} />
									<PubInlineMenu pubData={pubData} />
									<PubInlineDiscussions pubData={pubData} />
								<PubFooter pubData={pubData} />
								<PubDiscussions pubData={pubData} />
							}
							{this.state.mode === 'submission' &&
								<PubSubmission pubData={pubData} />
							}
							
						)}
					</PubSyncManager> */}
					<h2>
						<EditableText
							placeholder="Enter Pub title..."
							onConfirm={this.handleTitleSave}
							onChange={this.handleTitleChange}
							onCancel={this.handleTitleCancel}
							value={this.state.title}
							multiline={true}
							confirmOnEnterKey={true}
						/>
					</h2>
					<hr />
					<Editor
						placeholder="Begin writing here..."
						initialContent={this.props.pubData.content}
						isReadOnly={false}
						onChange={(changeObject) => {
							this.setState({ changeObject: changeObject });
						}}
						key={this.state.firebaseRootRef ? 'ready' : 'unready'}
						collaborativeOptions={
							// This isn't quite right - because we still render the client
							// version of Editor without the collabOptions while firebase
							// authenticates. Is there a cleaner way to hold off on collab
							// init until after authentication?
							this.state.firebaseRootRef
								? {
										firebaseRef: this.state.firebaseBranchRef,
										clientData: { id: 'testclientdataid' },
										initialDocKey: this.props.pubData.initDocKey,
										onClientChange: () => {},
										onStatusChange: () => {},
								  }
								: {}
						}
					/>
				</PageWrapper>
			</div>
		);
	}
}

PubNew.propTypes = propTypes;
export default PubNew;

hydrateWrapper(PubNew);
