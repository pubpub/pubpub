import React from 'react';
import Radium, { Style } from 'radium';
import Helmet from 'react-helmet';
import Link from 'components/Link/Link';
import Diff from 'react-stylable-diff';
import Textarea from 'react-textarea-autosize';
import { NonIdealState, Checkbox, Button, NumericInput, RadioGroup, Radio } from '@blueprintjs/core';
import fetch from 'isomorphic-fetch';
let styles = {};

export const ExperimentsReviewDiff = React.createClass({

	getInitialState() {
		return {
			before: '',
			after: '',
			numReviewers: 0,
			reviewType: 'other',
			reviewDuration: 0,
			accepted: false,

			acceptedTerms: false,
			addedContent: false,
			verifiedDiff: false,
			submitted: false,

			submitLoading: false,
			error: undefined,
		};
	},

	acceptTerms: function() {
		this.setState({ acceptedTerms: true, error: undefined });
		document.body.scrollTop = 0;
	},
	acceptTermsBack: function() {
		this.setState({ acceptedTerms: false, error: undefined });
		document.body.scrollTop = 0;
	},

	addContent: function() {
		if (!this.state.before) { return this.setState({ error: 'Before content is required'}); }
		if (!this.state.after) { return this.setState({ error: 'After content is required'}); }

		this.setState({ addedContent: true, error: undefined });
		document.body.scrollTop = 0;
	},
	addContentBack: function() {
		this.setState({ addedContent: false, error: undefined });
		document.body.scrollTop = 0;
	},

	verifyDiff: function() {
		this.setState({ verifiedDiff: true, error: undefined });
		document.body.scrollTop = 0;
	},
	verifyDiffBack: function() {
		this.setState({ verifiedDiff: false, error: undefined });
		document.body.scrollTop = 0;
	},

	submit: function() {

		if (!this.state.numReviewers) { return this.setState({ error: 'Number of Reviewers Required'}); }
		if (!this.state.reviewDuration) { return this.setState({ error: 'Review duration cannot be 0 days'}); }

		this.setState({ submitLoading: true, error: undefined });
		let url = 'https://dev-experiments-api.pubpub.org/reviewdiff';
		if (window.location.hostname === 'www.pubpub.org') {
			url = 'https://experiments-api.pubpub.org/reviewdiff';
		}

		return fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				before: this.state.before,
				after: this.state.after,
				numReviewers: this.state.numReviewers,
				reviewType: this.state.reviewType,
				reviewDuration: this.state.reviewDuration * 60 * 60 * 24,
				accepted: this.state.accepted,
			})
		})
		.then((response)=> {
			if (!response.ok) { return response.json().then(err => { throw err; }); }
			this.setState({ 
				submitLoading: false,
				submitted: true
			});
			document.body.scrollTop = 0;
			return response.json();
		})
		.catch((err)=> {
			this.setState({ submitLoading: false, error: JSON.stringify(err) });
			console.log(err);
		});
	},

	render: function() {

		return (
			<div style={styles.container}>
				<Helmet title={'Impact of Review Experiment · PubPub'} />

				<Style rules={{
					'.Difference': { whiteSpace: 'pre-wrap' },
					'.Difference > del': { backgroundColor: 'rgb(255, 224, 224)', textDecoration: 'none' },
					'.Difference > ins': { backgroundColor: 'rgb(201, 238, 211)', textDecoration: 'none' },
				}} />

				{!this.state.acceptedTerms &&
					<div>
						<h1>Impact of Review</h1>
						<p>We are studying the impact of the peer review process. We ask you to submit three items relating to work that you have submitted for peer review.</p>
						<ol>
							<li>Raw text of the work <i>before</i> peer review</li>
							<li>Raw text of the work <i>after</i> peer review</li>
							<li>Answers to simple questions regarding the result of peer review</li>
						</ol>

						<p>Your submitted content and answers are anonymous and will never be shared, sold, or distributed in any identifiable form.</p>
						<p>The results of these experiments will be published and available on PubPub.</p>
						<div>
							<Button style={styles.button} onClick={this.acceptTerms} className={'pt-intent-primary'}>I agree</Button>
						</div>
					</div>
				}

				{this.state.acceptedTerms && !this.state.addedContent &&
					<div>
						<h1>Impact of Review: Add Content</h1>				
						<p>Please copy and paste the content of your article before and after peer review into the boxes below. Do not worry about formatting, images, or other media. The inputs below accept simple raw text.</p>
						<div style={styles.addContentTable}>
							<div style={styles.addContentCell}>
								Draft before Review:
								<Textarea style={styles.input} className={'pt-input'} value={this.state.before} onChange={evt => this.setState({ before: evt.target.value })}/>
							</div>
							<div style={styles.addContentCell}>
								Draft after Review:
								<Textarea style={styles.input} className={'pt-input'} value={this.state.after} onChange={evt => this.setState({ after: evt.target.value })}/>
							</div>
						</div>
						<div>
							<Button style={styles.button} onClick={this.acceptTermsBack}>Back</Button>
							<Button style={styles.button} onClick={this.addContent} className={'pt-intent-primary'}>Calculate Difference</Button>
						</div>
					</div>
				}

				{this.state.acceptedTerms && this.state.addedContent && !this.state.verifiedDiff &&
					<div>
						<h1>Impact of Review: Verify</h1>		
						<p>Please verify that the difference below looks roughly correct. Sections highlighted in red represent words that were removed between the two documents. Sections highlighted in green represent words that were added between the two documents.</p>
						<div style={styles.differenceView}>
							<Diff inputA={this.state.before} inputB={this.state.after} type={'sentences'}/>
						</div>
						<div>
							<Button style={styles.button} onClick={this.addContentBack}>Back</Button>
							<Button style={styles.button} onClick={this.verifyDiff} className={'pt-intent-primary'}>Verify Difference</Button>
						</div>
					</div>
				}

				{this.state.acceptedTerms && this.state.addedContent && this.state.verifiedDiff && !this.state.submitted &&
					<div>
						<h1>Impact of Review: Details</h1>				
						<p>Please answer the following questions regarding the work you submitted for peer review.</p>
						<div>

							<RadioGroup
								label="Review Type"
								onChange={evt => this.setState({ reviewType: evt.target.value })}
								selectedValue={this.state.reviewType}
							>
								<Radio label="Single Blind" value="single" />
								<Radio label="Double Blind" value="double" />
								<Radio label="Other" value="other" />
							</RadioGroup>
							<label>
								Number of Reviewers
								<NumericInput value={this.state.numReviewers} min={0} onValueChange={(num, string) => { return this.setState({ numReviewers: num }); }}/>
							</label>
							<label>
								Review Duration (Days)
								<NumericInput value={this.state.reviewDuration} min={0} onValueChange={(num, string) => { return this.setState({ reviewDuration: num }); }}/>
							</label>
							<Checkbox checked={this.state.accepted} label={'Work was accepted for publication'} onChange={evt => this.setState({ accepted: !this.state.accepted})} />
							
						</div>
						<div>
							<Button style={styles.button} onClick={this.verifyDiffBack}>Back</Button>
							<Button style={styles.button} onClick={this.submit} loading={this.state.submitLoading} className={'pt-intent-primary'}>Submit Content</Button>
						</div>
						
					</div>
				}

				{this.state.acceptedTerms && this.state.addedContent && this.state.verifiedDiff && this.state.submitted &&
					<div>
						<h1>Impact of Review: Submitted</h1>				
						<div style={styles.complete}>
							<NonIdealState
								action={
									<Link to={'/experiments'} className={'pt-button'}>Return to Experiments</Link>
								}
								description={'Thank you! Your review has been submitted and is stored anonymously. Feel free to restart the process to report a different peer review process.'}
								title={'Review Difference Submitted!'}
								visual={'endorsed'} />
						</div>
					</div>
				}

				{!!this.state.error &&
					<div className={'pt-callout pt-intent-danger'}>
						{this.state.error}
					</div>
				}


			</div>
		);
	}

});


export default Radium(ExperimentsReviewDiff);

styles = {
	container: {
		maxWidth: '767px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},	
	addContentTable: {
		display: 'table',
		width: '100%',
	},
	addContentCell: {
		width: 'calc(50% - 2em)',
		display: 'table-cell',
		padding: '0em 1em',
	},
	input: {
		resize: 'none',
		width: '100%',
		minHeight: '400px',
	},
	differenceView: {
		boxShadow: '0px 1px 6px rgba(0, 0, 0, 0.4)',
		padding: '1em',
		margin: '1em 0em',
	},
	complete: {
		margin: '3em 0em',
	},
	button: {
		marginRight: '1em',
	},
	
};
