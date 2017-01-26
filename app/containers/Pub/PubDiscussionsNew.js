import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Loader } from 'components';
import { browserHistory } from 'react-router';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import { postDiscussion } from './actionsDiscussions';
import PubLabelList from './PubLabelList';
import { Checkbox, Button } from '@blueprintjs/core';

let styles;

export const PubDiscussionsNew = React.createClass({
	propTypes: {
		discussionsData: PropTypes.array,
		pub: PropTypes.object,
		goBack: PropTypes.func,
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
			isPrivate: false,
			mounting: true,
		};
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
			return { isValid: false, validationError: <FormattedMessage id="discussion.TitleRequired" defaultMessage="Title Required" /> };
		}
		return { isValid: true, validationError: undefined };
	},

	createSubmit: function(evt) {
		evt.preventDefault();
		const createData = {
			replyRootPubId: this.props.pub.id,
			replyParentPubId: this.props.pub.id,
			title: this.state.title,
			description: this.state.description,
			labels: this.state.labels,
		};
		const { isValid, validationError } = this.validate(createData);
		this.setState({ validationError: validationError });
		const isPrivate = this.state.isPrivate;
		if (isValid) {
			this.props.dispatch(postDiscussion(createData.replyRootPubId, createData.replyParentPubId, createData.title, createData.description, createData.labels, isPrivate));	
		}
	},

	render: function() {
		const pub = this.props.pub || {};
		const labelList = pub.pubLabels || [];		
		const isLoading = this.props.isLoading;
		const serverErrors = {
			'Slug already used': <FormattedMessage id="discussion.JournalURLalreadyused" defaultMessage="Journal URL already used" />,
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
							
						<textarea id={'description'} className={'pt-input'} name={'description'} type="text" style={[styles.input, styles.description]} value={this.state.description} onChange={this.inputUpdate.bind(this, 'description')} />
						
						{(pub.canEdit || pub.canRead) &&
							<Checkbox checked={this.state.isPrivate} label={'Private Discussion'} onChange={this.toggleIsPrivate} />
						}
						{/*<button className={'pt-button pt-intent-primary'} onClick={this.createSubmit}>
							Create New Discussion
						</button>*/}

						<Button className={'pt-button pt-intent-primary'} onClick={this.createSubmit} loading={isLoading}>Create New Discussion</Button>

						{/*<div style={styles.loaderContainer}>
							<Loader loading={isLoading} showCompletion={!errorMessage} />
						</div>*/}

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
