import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import Collaborative from '@pubpub/editor/addons/Collaborative';
import Image from '@pubpub/editor/addons/Image';
import InsertMenu from '@pubpub/editor/addons/InsertMenu';
import { NonIdealState } from '@blueprintjs/core';
import { s3Upload } from 'utilities';

const propTypes = {
	onRef: PropTypes.func.isRequired,
	clientData: PropTypes.object.isRequired,
	editorKey: PropTypes.string.isRequired,
	onClientChange: PropTypes.func.isRequired,
};

class PubCollabEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			error: undefined,
		};
	}
	componentDidCatch(error, info) {
		this.setState({ error: true });
	}
	render() {
		if (this.state.error) {
			return (
				<NonIdealState
					title={'Uh Oh'}
					visual={'error'}
					description={'An error has occured. We\'ve logged the bug and have notified our development team. Please reload the page to continue.'}
					action={
						<button
							className={'pt-button'}
							onClick={()=>{ window.location.reload(); }}
						>
							Reload Page
						</button>
					}
				/>
			);
		}
		return (
			<Editor placeholder={'Begin writing here...'} ref={this.props.onRef}>
				<FormattingMenu />
				<InsertMenu />
				<Collaborative
					firebaseConfig={{
						apiKey: 'AIzaSyBpE1sz_-JqtcIm2P4bw4aoMEzwGITfk0U',
						authDomain: 'pubpub-rich.firebaseapp.com',
						databaseURL: 'https://pubpub-rich.firebaseio.com',
						projectId: 'pubpub-rich',
						storageBucket: 'pubpub-rich.appspot.com',
						messagingSenderId: '543714905893',
					}}
					clientData={this.props.clientData}
					editorKey={this.props.editorKey}
					onClientChange={this.props.onClientChange}
				/>
				<Image handleFileUpload={s3Upload} />
			</Editor>
		);
	}
}

PubCollabEditor.propTypes = propTypes;
export default PubCollabEditor;
