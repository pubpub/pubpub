import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link, browserHistory } from 'react-router';
 
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import { putJournal } from './actions';

import { Dialog } from '@blueprintjs/core';

let styles = {};


export const JournalSubmitted = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			confirmFeature: undefined,
			confirmReject: undefined,
		};
	},
	
	componentWillReceiveProps(nextProps) {
	
	},


	toggleFeature: function(index) {
		this.setState({ confirmFeature: index });
	},

	render: function() {
		const journal = this.props.journal || {};
		const pubsSubmitted = journal.pubsSubmitted || [];
		const metaData = {
			title: 'Submitted · ' + journal.name,
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;

		return (
			<div>
				<Helmet {...metaData} />

				{
					pubsSubmitted.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createdAt > bar.createdAt) { return -1; }
						if (foo.createdAt < bar.createdAt) { return 1; }
						return 0;
					}).map((submission, index)=> {
						return (
							<div key={'submission-' + index} style={styles.submissionWrapper}>
								<div style={styles.imageWrapper}>
									<Link to={'/pub/' + submission.slug}>
										<img src={submission.previewImage} style={styles.submissionImage} />
									</Link>
								</div>
								
								<div style={styles.submissionDetails}>
									<h4><Link to={'/pub/' + submission.slug}>{submission.title}</Link></h4>
									<p>{submission.description}</p>	
								</div>

								<div style={styles.buttons}>
									<div className="pt-button-group pt-vertical">
										<button type="button" className="pt-button" onClick={this.toggleFeature.bind(this, submission.id)}>Accept</button>
										<button type="button" className="pt-button">Reject</button>
									</div>

								</div>

								<Dialog isOpen={this.state.confirmFeature === submission.id} onClose={this.toggleFeature.bind(this, undefined)}>
									<div className="pt-dialog-body">
										Please confirm that you want to accept <b>{submission.title}</b>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<button type="button" className="pt-button" onClick={this.toggleFeature.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary">Feature Pub</button>
										</div>
									</div>
										
								</Dialog>
								
							</div>
						);
					})
				}


			</div>
		);
	}

});

export default Radium(JournalSubmitted);

styles = {
	submissionWrapper: {
		padding: '0em 0em 1em',
		margin: '0em 0em 1em 0em',
		borderBottom: '1px solid #CCC',
		display: 'table',
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		width: '100px',
	},
	submissionImage: {
		width: '100px',
		paddingRight: '1em',
	},
	submissionDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	buttons: {
		display: 'table-cell',
		width: '1%',
	},
	
};
