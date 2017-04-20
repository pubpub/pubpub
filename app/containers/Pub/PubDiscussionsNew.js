import React, { PropTypes } from 'react';
import Radium from 'radium';
import { browserHistory } from 'react-router';
import RenderFile from 'components/RenderFile/RenderFile';
import { globalStyles } from 'utils/globalStyles';
import { postDiscussion } from './actionsDiscussions';
import PubLabelList from './PubLabelList';
import { Checkbox, Button } from '@blueprintjs/core';

let styles;

export const PubDiscussionsNew = React.createClass({
	propTypes: {
		discussionsData: PropTypes.array,
		highlightData: PropTypes.object,
		pub: PropTypes.object,
		goBack: PropTypes.func,
		accountId: PropTypes.number,
		isLoading: PropTypes.bool,
		pathname: PropTypes.string,
		query: PropTypes.object,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			title: '',
			description: '',
			labels: [],
			highlights: [],
			isPrivate: false,
			mounting: true,
			preview: false,
			previewFiles: [],
		};
	},

	componentWillMount() {
		const highlightData = this.props.highlightData || {};
		const result = highlightData.result || {};
		if (this.props.query.useHighlight === 'true' && result.id) {
			this.setState({ 
				description: `[@highlight/${result.id}]`,
				highlights: [...this.state.highlights, result],
			});
		}
	},

	componentDidMount() {
		this.setState({ mounting: false });
	},

	componentWillReceiveProps(nextProps) {
		const previousDiscussions = this.props.discussionsData || [];
		const nextDiscussions = nextProps.discussionsData || [];
		if (nextDiscussions.length > previousDiscussions.length) {
			const newDiscussion = nextDiscussions[nextDiscussions.length - 1];
			browserHistory.push({ pathname: nextProps.pathname, query: { discussion: newDiscussion.threadNumber } });
		}

		const previousHighlightData = this.props.highlightData || {};
		const nextHighlightData = nextProps.highlightData || {};
		if (!previousHighlightData.result && nextHighlightData.result) {
			this.setState({ 
				description: this.state.description + `[@highlight/${nextHighlightData.result.id}]`,
				highlights: [...this.state.highlights, nextHighlightData.result]
			});
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	toggleIsPrivate: function(evt) {
		this.setState({ isPrivate: !this.state.isPrivate });
	},
	onLabelsChange: function(newLabels) {
		this.setState({ labels: newLabels.map((label)=> {
			return label.id;
		}) });
	},

	validate: function(data) {
		// Check to make sure name exists
		if (!data.title || !data.title.length) {
			return { isValid: false, validationError: 'Title Required' };
		}
		return { isValid: true, validationError: undefined };
	},

	createSubmit: function(evt) {
		evt.preventDefault();
		if (!this.props.accountId) {
			return this.setState({ validationError: 'Must be Logged In' });
		}
		const createData = {
			replyRootPubId: this.props.pub.id,
			replyParentPubId: this.props.pub.id,
			title: this.state.title,
			description: undefined,
			labels: this.state.labels,
			files: [
				{
					type: 'text/markdown',
					url: '/temp.md',
					name: 'main.md',
					content: this.state.description,
				}
			],
		};

		if (this.state.highlights.length) {
			createData.files.push({
				type: 'application/json',
				url: '/tempHighlights.json',
				name: 'highlights.json',
				content: JSON.stringify(this.state.highlights, null, 2),
			});
		}

		const { isValid, validationError } = this.validate(createData);
		this.setState({ validationError: validationError });
		const isPrivate = this.state.isPrivate;
		if (isValid) {
			this.props.dispatch(postDiscussion(createData.replyRootPubId, createData.replyParentPubId, createData.title, createData.description, createData.labels, createData.files, isPrivate));	
		}
	},

	togglePreview: function() {
		this.setState({
			preview: !this.state.preview,
			previewFiles: [
				{
					name: 'main.md',
					url: '/main.md',
					type: 'text/markdown',
					content: this.state.description,
				},
				{
					name: 'highlights.json',
					url: '/highlights.json',
					type: 'application/json',
					content: JSON.stringify(this.state.highlights),
				}
			],
		});
	},
	render: function() {
		const pub = this.props.pub || {};
		const labelList = pub.pubLabels || [];		
		const isLoading = this.props.isLoading;
		const serverErrors = {
			'Slug already used': 'Journal URL already used',
		};
		const errorMessage = serverErrors[this.props.error] || this.state.validationError;
		return (

			<div style={styles.container} >
				<div style={styles.header}>
					<div style={{ textAlign: 'right' }}>
						<button type="button" className="pt-button small-button pt-icon-chevron-left" onClick={this.props.goBack}>
							Back
						</button>
					</div>
				</div>
				<div style={styles.content} className={'pt-card pt-elevation-3'}>
					<h3>New Discussion</h3>
					<form onSubmit={this.createSubmit}>
						<PubLabelList allLabels={labelList} onChange={this.onLabelsChange} canEdit={pub.canEdit} canSelect={true} rootPubId={this.props.pub.id} pathname={this.props.pathname} query={this.props.query} dispatch={this.props.dispatch} />
						<input id={'journalName'} className={'pt-input'} name={'journal name'} placeholder={'Title'} type="text" style={styles.input} value={this.state.title} onChange={this.inputUpdate.bind(this, 'title')} />
						
						{!this.state.preview &&
							<textarea id={'description'} className={'pt-input'} name={'description'} type="text" style={[styles.input, styles.description]} value={this.state.description} onChange={this.inputUpdate.bind(this, 'description')} />
						}	
						{this.state.preview && 
							<div style={{ border: '1px solid #CCC', padding: '1em', margin: '0.5em 0em' }}>
								<RenderFile file={this.state.previewFiles[0]} allFiles={this.state.previewFiles} allReferences={[]} noHighlighter={true} />
							</div>
						}
						
						
						{(pub.canEdit || pub.canRead) &&
							<Checkbox checked={this.state.isPrivate} label={'Private Discussion'} onChange={this.toggleIsPrivate} />
						}

						<Button className={'pt-button pt-intent-primary'} onClick={this.createSubmit} loading={isLoading}>Create New Discussion</Button>
						<Button style={{ margin: '0em 0.5em' }} onClick={this.togglePreview}>{this.state.preview ? 'Edit' : 'Preview'}</Button>

						<div style={styles.errorMessage}>{errorMessage}</div>

					</form>
				</div>
			</div>
		);
	}
});

export default Radium(PubDiscussionsNew);

styles = {
	container: {
		height: '100%',
		width: '100%',
		position: 'relative',
	},
	header: {
		padding: '10px 0px', 
		height: '50px', 
		width: '100%',
	},
	content: {
		maxHeight: 'calc(100% - 60px)', 
		width: '100%', 
		overflow: 'hidden', 
		overflowY: 'scroll', 
		position: 'relative',
	},
	topButton: {
		marginLeft: '0.5em',
		verticalAlign: 'top',
	},

	input: {
		width: '100%',
		marginBottom: '1em',
	},
	// loaderContainer: {
	// 	display: 'inline-block',
	// 	position: 'relative',
	// 	top: 15,
	// },
	description: {
		height: '8em',
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
};
