import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Button } from '@blueprintjs/core';
import { putReviewer } from './actionsReviewers';

let styles;

export const PubInvitedReviewerMessage = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		isLoading: PropTypes.bool,
		currentInvitedReviewer: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			confirmRejectInvitation: false,
			rejectionReason: '',
		};
	},

	// componentWillReceiveProps(nextProps) {
	// 	if (prevReviewers.length < nextReviewers.length) {
	// 		this.setState({ newReviewer: null });
	// 	}
	// },

	acceptInvitation: function() {
		this.props.dispatch(putReviewer(this.props.pub.id, this.props.currentInvitedReviewer.id, true, false));
	},

	rejectInvitation: function() {
		this.props.dispatch(putReviewer(this.props.pub.id, this.props.currentInvitedReviewer.id, false, true, this.state.rejectionReason));
	},

	setRejectInvitation: function() {
		this.setState({ confirmRejectInvitation: true });
	},

	clearRejectInvitation: function() {
		this.setState({ confirmRejectInvitation: false });
	},

	updateRejectionReason: function(evt) {
		this.setState({ rejectionReason: evt.target.value });
	},

	render: function() {
		const reviewer = this.props.currentInvitedReviewer || {};
		const inviterUser = reviewer.inviterUser;
		const inviterJournal = reviewer.inviterJournal;

		return (
			<div className={'pt-card pt-elevation-3'}>
				{!this.state.confirmRejectInvitation &&
					<div style={styles.optionsWrapper}>
					
						<div style={styles.inlineTableCell}>
							<span>You've been invited by </span> 
							<Link to={'/user/' + inviterUser.username} style={styles.link}>{`${inviterUser.firstName} ${inviterUser.lastName}`} </Link>
							{!!inviterJournal &&
								<span>
									<span> on behalf of </span>
									<Link to={'/user/' + inviterJournal.slug} style={styles.link}>{inviterJournal.title} </Link>		
								</span>
							}
							<span>to review this pub.</span> 
						</div>
						
						<div style={styles.inlineTableCellSmall}>
							<Button loading={this.props.isLoading} onClick={this.acceptInvitation} className={'pt-intent-primary'} text={'Accept Invitation'} />
						</div>

						<div style={styles.inlineTableCellSmall}>
							<Button onClick={this.setRejectInvitation} text={'Decline'} />
						</div>

					</div>
				}
				

				{this.state.confirmRejectInvitation &&
					<div style={styles.optionsWrapper}>
						<div style={[styles.inlineTableCell, styles.alignBottom]}>
							<label>
								Provide a reason for declining this review invitation <span style={styles.optional}>(optional)</span>
								<input className={'pt-input'} value={this.state.rejectionReason} onChange={this.updateRejectionReason} style={styles.input} />	
							</label>
						</div>
						
						<div style={[styles.inlineTableCellSmall, styles.alignBottom]}>
							<Button loading={this.props.isLoading} onClick={this.rejectInvitation} className={'pt-intent-danger'} text={'Decline Invitation'} />
						</div>

						<div style={[styles.inlineTableCellSmall, styles.alignBottom]}>
							<Button onClick={this.clearRejectInvitation} text={'Cancel'} />	
						</div>
	
					</div>
				}
			</div>
		);
	}
});

export default Radium(PubInvitedReviewerMessage);

styles = {
	link: {
		fontWeight: 'bold',
	},
	optionsWrapper: {
		paddingTop: '0.5em',
		display: 'table',
	},
	optional: {
		opacity: 0.75,
	},
	input: {
		width: '100%',
	},
	inlineItem: {
		marginRight: '1em',
		verticalAlign: 'middle',
	},
	inlineTableCell: {
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	inlineTableCellSmall: {
		display: 'table-cell',
		verticalAlign: 'middle',
		whiteSpace: 'nowrap',
		width: '1%',
		paddingLeft: '1em',
	},
	alignBottom: {
		verticalAlign: 'bottom',
	},
};
