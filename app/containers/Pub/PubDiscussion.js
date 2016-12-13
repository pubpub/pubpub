import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { Loader } from 'components';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import dateFormat from 'dateformat';
import ReactMarkdown from 'react-markdown';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider, Tooltip } from '@blueprintjs/core';
import { postDiscussion } from './actionsDiscussions'
import PubLabelList from './PubLabelList';

let styles;

export const PubDiscussion = React.createClass({
	propTypes: {
		discussion: PropTypes.object,
		labelsData: PropTypes.array,
		pubId: PropTypes.number,
		pathname: PropTypes.string,
		query: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			description: '',

		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({ description: '' });
		}
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	validate: function(data) {
		// Check to make sure name exists
		if (!data.description || !data.description.length) {
			return { isValid: false, validationError: <FormattedMessage id="discussion.CannotPostEmptyReply" defaultMessage="Cannot post empty reply" /> };
		}

		return { isValid: true, validationError: undefined };

	},

	createSubmit: function(evt) {
		evt.preventDefault();
		const createData = {
			replyRootPubId: this.props.pubId,
			replyParentPubId: this.props.discussion.id,
			title: 'Reply to: ' + this.props.discussion.title,
			description: this.state.description,
		};
		const { isValid, validationError } = this.validate(createData);
		this.setState({ validationError: validationError });
		if (isValid) {
			this.props.dispatch(postDiscussion(createData.replyRootPubId, createData.replyParentPubId, createData.title, createData.description));	
		}
	},

	render: function() {
		const discussion = this.props.discussion || {};
		const labelsData = this.props.labelsData || [];
		const children = discussion.children || [];
		const isLoading = this.props.isLoading;
		const serverErrors = {
			'Slug already used': '',
		};
		const errorMessage = serverErrors[this.props.error] || this.state.validationError;

		const discussions = [discussion, ...discussion.children];

		return (
			<div style={styles.container} className={'discussion-item'}>
				<Style rules={{
					'.discussion-item .pt-button-group:not(.pt-vertical) .pt-popover-target, .discussion-item .pt-button-group:not(.pt-vertical) .pt-tether-target': { float: 'none' },
				}} />

				<h3>{discussion.title}</h3>
				
				<PubLabelList 
					allLabels={labelsData} 
					selectedLabels={discussion.labels} 
					pubId={discussion.id} 
					rootPubId={this.props.pubId} 
					canEdit={true} 
					pathname={this.props.pathname} 
					query={this.props.query} 
					dispatch={this.props.dispatch}/>

				{discussions.sort((foo, bar)=>{
					// Sort so that oldest is first in array
					if (foo.createdAt > bar.createdAt) { return 1; }
					if (foo.createdAt < bar.createdAt) { return -1; }
					return 0;
				}).map((child, index)=> {
					const user = child.contributors[0].user;
					return (
						<div key={'discussion-' + index} style={styles.discussionItem}>
							<div style={styles.discussionItemHeader}>
								<div  style={styles.discussionItemImageWrapper}>
									<img src={'https://jake.pubpub.org/unsafe/50x50/' + user.image} style={styles.discussionItemImage}/>	
								</div>
								
								<div style={styles.discussionItemName}>
									{user.firstName + ' ' + user.lastName} · {dateFormat(child.createdAt, 'mmm dd, yyyy')}
								</div>

								<div style={styles.discussionItemActions} className="pt-button-group pt-minimal">	
									<Tooltip content={'Add Feedback'} position={Position.LEFT} useSmartPositioning={true}>						
										<button type="button" className="pt-button pt-icon-social-media" />
									</Tooltip>
									<Tooltip content={'Edit'} position={Position.LEFT} useSmartPositioning={true}>						
										<button type="button" className="pt-button pt-icon-edit" />
									</Tooltip>
									<Tooltip content={'Cite Discussion'} position={Position.LEFT} useSmartPositioning={true}>						
										<button type="button" className="pt-button pt-icon-bookmark" />
									</Tooltip>

								</div>
							</div>
							<div style={styles.discussionItemBody} className={'discussion-body'}>
								<ReactMarkdown source={child.description} />
							</div>
							
						</div>
					);
				})}

				<hr />

				<form onSubmit={this.createSubmit}>
					<h3>Reply</h3>
					<textarea id={'description'} name={'description'} type="text" style={[styles.input, styles.description]} value={this.state.description} onChange={this.inputUpdate.bind(this, 'description')} />
					

					<button className={'pt-button pt-intent-primary'} onClick={this.createSubmit}>
						Post Reply
					</button>

					<div style={styles.loaderContainer}>
						<Loader loading={isLoading} showCompletion={!errorMessage} />
					</div>

					<div style={styles.errorMessage}>{errorMessage}</div>

				</form>
			</div>
		);
	}
});

export default Radium(PubDiscussion);

styles = {
	container: {
		
	},
	discussionItem: {
		border: '1px solid #CCC',
		margin: '1em 0em',
	},
	discussionItemHeader: {
		display: 'table',
		width: '100%',
	},
	discussionItemImageWrapper: {
		display: 'table-cell',
		width: '1%',
		paddingRight: '.5em',
	},
	discussionItemImage: {
		width: '50px',
		display: 'block',
	},
	discussionItemName: {
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	discussionItemActions: {
		display: 'table-cell',
		whiteSpace: 'nowrap',
		width: '1%',
		verticalAlign: 'middle',
	},
	discussionItemBody: {
		backgroundColor: 'white',
		padding: '1em 1em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	description: {
		height: '8em',
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},

};
