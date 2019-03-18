import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from '@pubpub/editor';
import discussionSchema from 'components/DiscussionAddon/discussionSchema';
import GridWrapper from 'components/GridWrapper/GridWrapper';
import { getResizedUrl } from 'utilities';

require('./pubBody.scss');

const propTypes = {
	locationData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	collabData: PropTypes.object.isRequired,
	firebaseBranchRef: PropTypes.object,
	updateLocalData: PropTypes.func.isRequired,
};
const defaultProps = {
	firebaseBranchRef: undefined,
};

class PubBody extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: undefined,
		};
	}

	render() {
		const { loginData, pubData, collabData, firebaseBranchRef, updateLocalData } = this.props;
		return (
			<div className="pub-body-component">
				<GridWrapper containerClassName="pub">
					<Editor
						key={firebaseBranchRef ? 'ready' : 'unready'}
						customNodes={{
							...discussionSchema,
						}}
						nodeOptions={{
							image: {
								onResizeUrl: (url) => {
									return getResizedUrl(url, 'fit-in', '800x0');
								},
							},
							// discussion: this.props.discussionNodeOptions,
						}}
						placeholder={pubData.isStaticDoc ? 'Begin writing here...' : undefined}
						initialContent={pubData.initialDoc}
						isReadOnly={pubData.isStaticDoc || !pubData.isEditor}
						onChange={(editorChangeObject) => {
							updateLocalData('collab', { editorChangeObject: editorChangeObject });
						}}
						collaborativeOptions={
							firebaseBranchRef && !pubData.isStaticDoc
								? {
										firebaseRef: firebaseBranchRef,
										clientData: { id: loginData.id },
										initialDocKey: pubData.initialDocKey,
										onClientChange: () => {},
										onStatusChange: () => {},
								  }
								: undefined
						}
						highlights={[]}
						handleSingleClick={() => {}}
					/>
				</GridWrapper>
			</div>
		);
	}
}

PubBody.propTypes = propTypes;
PubBody.defaultProps = defaultProps;
export default PubBody;

// import Editor from '@pubpub/editor';
// import { EditableText, Button, Portal } from '@blueprintjs/core';
// import discussionSchema from 'components/DiscussionAddon/discussionSchema';

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
