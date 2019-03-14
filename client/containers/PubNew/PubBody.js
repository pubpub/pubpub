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
