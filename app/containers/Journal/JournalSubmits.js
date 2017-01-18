import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import { Dialog, NonIdealState } from '@blueprintjs/core';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import { putJournalSubmit, postJournalFeature } from './actionsSubmits';
import { Loader } from 'components';

let styles = {};


export const JournalSubmits = React.createClass({
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
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({ confirmReject: undefined });	
			this.setState({ confirmFeature: undefined });	
		}
	},

	setFeature: function(index) {
		this.setState({ confirmFeature: index });
	},

	setReject: function(index) {
		this.setState({ confirmReject: index });
	},

	featurePub: function() {
		const journal = this.props.journal || {};
		this.props.dispatch(postJournalFeature(journal.id, this.state.confirmFeature));
	},

	rejectPub: function() {
		const journal = this.props.journal || {};
		this.props.dispatch(putJournalSubmit(journal.id, this.state.confirmReject));
	},

	render: function() {
		const journal = this.props.journal || {};
		const pubSubmits = journal.pubSubmits || [];
		const metaData = {
			title: 'Submitted · ' + journal.title,
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;

		return (
			<div>
				<Helmet {...metaData} />

				{!pubSubmits.length &&
					<NonIdealState
						description={'No pubs have been submitted to this journal. Pubs can be submitted by their authors for consideration.'}
						title={'No Submitted Pubs'}
						visual={'application'} />
				}
				{
					pubSubmits.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createdAt > bar.createdAt) { return -1; }
						if (foo.createdAt < bar.createdAt) { return 1; }
						return 0;
					}).map((pubSubmit, index)=> {
						const pub = pubSubmit.pub;
						const isDisabled = pubSubmit.isRejected || pubSubmit.isFeatured;
						return (
							<div key={'submission-' + index} style={styles.submissionWrapper}>
								<div style={styles.imageWrapper}>
									<Link to={'/pub/' + pub.slug}>
										<img src={pub.avatar} style={[styles.submissionImage, isDisabled && styles.dimItem]} />
									</Link>
								</div>
								
								<div style={styles.submissionDetails}>
									{pubSubmit.isRejected &&
										<p><b>Rejected</b> on {dateFormat(pubSubmit.updatedAt, 'mmmm dd, yyyy')}</p>	
									}
									{pubSubmit.isFeatured &&
										<p><b>Featured</b> on {dateFormat(pubSubmit.updatedAt, 'mmmm dd, yyyy')}</p>	
									}
									<h4 style={[isDisabled && styles.dimItem]}><Link to={'/pub/' + pub.slug}>{pub.title}</Link></h4>
									<p style={[isDisabled && styles.dimItem]}>{pub.description}</p>	
								</div>

								{!isDisabled && journal.isAdmin &&
									<div style={styles.buttons}>
										<div className="pt-button-group pt-vertical">
											<button type="button" className="pt-button" onClick={this.setFeature.bind(this, pub.id)}>Accept</button>
											<button type="button" className="pt-button" onClick={this.setReject.bind(this, pub.id)}>Reject</button>
										</div>
									</div>
								}

								<Dialog isOpen={this.state.confirmFeature === pub.id} onClose={this.setFeature.bind(this, undefined)}>
									<div className="pt-dialog-body">
										Please confirm that you want to feature <b>{pub.title}</b>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<div style={styles.loaderContainer}><Loader loading={isLoading} /></div>
											<div style={styles.loaderContainer}>{errorMessage}</div>
											<button type="button" className="pt-button" onClick={this.setFeature.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary" onClick={this.featurePub}>Feature Pub</button>
										</div>
									</div>
								</Dialog>

								<Dialog isOpen={this.state.confirmReject === pub.id} onClose={this.setReject.bind(this, undefined)}>
									<div className="pt-dialog-body">
										Please confirm that you want to reject <b>{pub.title}</b>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<div style={styles.loaderContainer}><Loader loading={isLoading} /></div>
											<div style={styles.loaderContainer}>{errorMessage}</div>
											<button type="button" className="pt-button" onClick={this.setReject.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary" onClick={this.rejectPub}>Reject Pub</button>
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

export default Radium(JournalSubmits);

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
	dimItem: {
		opacity: '0.35',
	},
	submissionDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	buttons: {
		display: 'table-cell',
		width: '1%',
	},
	loaderContainer: {
		display: 'inline-block',
		margin: 'auto 0',
	},
	
};
