import React from 'react';
// import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
// import Editor from '@pubpub/editor';
// import { EditableText, Button, Portal } from '@blueprintjs/core';
// import discussionSchema from 'components/DiscussionAddon/discussionSchema';
import { hydrateWrapper } from 'utilities';
import { communityDataProps, locationDataProps, loginDataProps } from 'utilities/sharedPropTypes';
import PubSyncManager from './PubSyncManager';
import PubHeader from './PubHeader';
import PubHeaderFormatting from './PubHeaderFormatting';
import PubBody from './PubBody';
import { pubDataProps } from './sharedPropTypes';

require('./pubNew.scss');

const propTypes = {
	communityData: communityDataProps.isRequired,
	loginData: loginDataProps.isRequired,
	locationData: locationDataProps.isRequired,
	pubData: pubDataProps.isRequired,
};

class PubNew extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			test: null,
		};
	}

	render() {
		return (
			<div id="pub-new-container">
				<PageWrapper
					locationData={this.props.locationData}
					communityData={this.props.communityData}
					loginData={this.props.loginData}
				>
					<PubSyncManager pubData={this.props.pubData}>
						{({ pubData, collabData, firebaseBranchRef, updateLocalData }) => (
							<React.Fragment>
								<PubHeader
									locationData={this.props.locationData}
									communityData={this.props.communityData}
									pubData={pubData}
									updateLocalData={updateLocalData}
								/>

								{pubData.mode === 'document' && (
									<React.Fragment>
										<PubHeaderFormatting
											loginData={this.props.loginData}
											pubData={pubData}
											collabData={collabData}
										/>
										<PubBody
											locationData={this.props.locationData}
											communityData={this.props.communityData}
											loginData={this.props.loginData}
											pubData={pubData}
											collabData={collabData}
											firebaseBranchRef={firebaseBranchRef}
											updateLocalData={updateLocalData}
										/>
										{/*
											<PubHeaderFormatting pubData={pubData} />
											<PubBody pubData={pubData} />
												<PubInlineMenu pubData={pubData} />
												<PubInlineDiscussions pubData={pubData} />
											<PubFooter pubData={pubData} />
											<PubDiscussions pubData={pubData} />
										*/}
									</React.Fragment>
								)}

								{pubData.mode === 'submission' && (
									<React.Fragment>
										<h1>Submission</h1>
									</React.Fragment>
								)}
							</React.Fragment>
						)}
					</PubSyncManager>
				</PageWrapper>
			</div>
		);
	}
}

PubNew.propTypes = propTypes;
export default PubNew;

hydrateWrapper(PubNew);

// 		const container =
// 			typeof document !== 'undefined' && document.getElementsByClassName('test-comp')[0];
// 		console.log('container is', container);
//					 {container && (
// 						<React.Fragment>
// 							<Portal
// 								// key={Math.random()}
// 								container={container}
// 								className="insert-portal"
// 							>
// 								<Button
// 									className="preview"
// 									minimal={true}
// 									onClick={() => {
// 										this.setState({ showThing: !this.state.showThing });
// 									}}
// 									text="I'm a preview!"
// 								/>
// 								{this.state.showThing && (
// 									<div className="content">
// 										<p>
// 											<strong>Mike: </strong>Here is some nicely formatted
// 											content.
// 										</p>
// 										<p>
// 											<strong>Megan: </strong>That is indeed nicely formatted.
// 											Bravo
// 										</p>
// 										<p>
// 											<strong>Mikal: </strong>Uhhh - gorgeous formatting. Wow.
// 											Double 5-stars!
// 										</p>
// 										<input type="text" className="bp3-input bp3-fill" />
// 									</div>
// 								)}
// 							</Portal>
// 						</React.Fragment>
// 					)}

// 					<h2>
// 						<EditableText
// 							placeholder="Enter Pub title..."
// 							onConfirm={this.handleTitleSave}
// 							onChange={this.handleTitleChange}
// 							onCancel={this.handleTitleCancel}
// 							value={this.state.title}
// 							multiline={true}
// 							confirmOnEnterKey={true}
// 						/>
// 					</h2>
// 					<hr />
//					<hr />
//					<Editor
//						placeholder="Begin writing here..."
//						initialContent={this.props.pubData.initialDoc}
//						isReadOnly={this.props.pubData.docIsStatic}
//						onChange={(changeObject) => {
//							this.setState({ changeObject: changeObject });
//						}}
//						customNodes={{
//							...discussionSchema,
//						}}
//						key={firebaseBranchRef ? 'ready' : 'unready'}
//						collaborativeOptions={
//							// This isn't quite right - because we still render the client
//							// version of Editor without the collabOptions while firebase
//							// authenticates. Is there a cleaner way to hold off on collab
//							// init until after authentication?
//							firebaseBranchRef && !this.props.pubData.docIsStatic
//								? {
//										firebaseRef: firebaseBranchRef,
//										clientData: { id: 'testclientdataid' },
//										initialDocKey: this.props.pubData.initialDocKey,
//										onClientChange: () => {},
//										onStatusChange: () => {},
//								  }
//								: {}
//						}
//					/>
