import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import Editor from '@pubpub/editor';
import discussionSchema from 'components/DiscussionAddon/discussionSchema';
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
			mode: 'pub',
			firebaseRootRef: undefined,
		};
		// this.firebaseRootRef;
	}

	componentDidMount() {
		initFirebase(this.props.pubData.firebaseRootKey, this.props.pubData.firebaseToken).then(
			(rootRef) => {
				this.firebaseRootRef = rootRef;
				this.setState({ firebaseRootRef: rootRef });
				// this.firebaseRootRef.child('/sections').on('value', this.handleSectionsChange);
			},
		);
	}

	componentWillUnmount() {
		if (this.state.firebaseRootRef) {
			// this.firebaseRootRef.child('/sections').off('value', this.handleSectionsChange);
		}
	}

	render() {
		return (
			<div id="pub-new-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<Editor
						placeholder="Begin writing here..."
						initialContent={this.props.pubData.content}
						isReadOnly={false}
						onChange={(changeObject) => {
							console.log(changeObject);
						}}
						key={this.state.firebaseRootRef ? 'ready' : 'unready'}
						collaborativeOptions={
							// This isn't quite right - because we still render the client
							// version of Editor without the collabOptions while firebase
							// authenticates. Is there a cleaner way to hold off on collab
							// init until after authentication?
							this.state.firebaseRootRef
								? {
										firebaseRef: this.state.firebaseRootRef,
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
