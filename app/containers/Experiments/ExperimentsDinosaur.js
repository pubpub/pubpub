import React from 'react';
import Radium, { Style } from 'radium';
import Helmet from 'react-helmet';
import Link from 'components/Link/Link';
import Textarea from 'react-textarea-autosize';
import { NonIdealState, Checkbox, Button, NumericInput, RadioGroup, Radio } from '@blueprintjs/core';
import fetch from 'isomorphic-fetch';
let styles = {};

export const ExperimentsDinosaur = React.createClass({

	getInitialState() {
		return {
			// State
			mode: 0, // 0 = plain, 1 = GUI, 2 = code
			acceptedTerms: false,
			submittedReview: false,
			submittedSurvey: false,
			submitLoading: false,
			error: undefined,

			// Review
			reviewContent: '',
			reviewRating: undefined,

			// Survey
			age: '',
			levelOfEducation: '',
			isScientist: undefined,
			hasReviewed: '',
			hasBeenReviewed: '',
			interestedInTopic: undefined,
			field: 'todo: update choosing options',
			feedback: '',
			usedInterface: '',
		};
	},

	componentWillMount() {
		this.setState({ mode: Math.floor(Math.random() * 3)})
	},

	acceptTerms: function() {
		this.setState({ acceptedTerms: true, error: undefined });
		document.body.scrollTop = 0;
	},
	acceptTermsBack: function() {
		this.setState({ acceptedTerms: false, error: undefined });
		document.body.scrollTop = 0;
	},

	submitReview: function() {
		if (!this.state.reviewContent) { return this.setState({ error: 'Review content is required'}); }
		if (this.state.reviewRating === undefined) { return this.setState({ error: 'Review rating is required'}); }

		this.setState({ submittedReview: true, error: undefined });
		document.body.scrollTop = 0;
	},
	submitReviewBack: function() {
		this.setState({ submittedReview: false, error: undefined });
		document.body.scrollTop = 0;
	},

	submitSurvey: function() {

		if (!this.state.age) { return this.setState({ error: 'Age is required'}); }
		if (!this.state.levelOfEducation) { return this.setState({ error: 'Level of Education is required'}); }
		if (!this.state.isScientist) { return this.setState({ error: 'Scientist status is required'}); }
		if (!this.state.hasReviewed) { return this.setState({ error: 'Review experience is required'}); }
		if (!this.state.hasBeenReviewed) { return this.setState({ error: 'Publishing experience is required'}); }
		if (!this.state.interestedInTopic) { return this.setState({ error: 'Stated interest is required'}); }
		if (!this.state.field) { return this.setState({ error: 'Field is required'}); }
		if (!this.state.feedback) { return this.setState({ error: 'Please provide a short sentence or more describing your experience with this experiment.'}); }
		if (this.state.mode !== 0 && !this.state.usedInterface) { return this.setState({ error: 'Used interactive interface is required'}); }

		this.setState({ submitLoading: true, error: undefined });

		let url = 'https://dev-experiments-api.pubpub.org/dinosaur';
		if (window.location.hostname === 'www.pubpub.org') {
			url = 'https://experiments-api.pubpub.org/dinosaur';
		}

		return fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				reviewContent: this.state.reviewContent,
				reviewRating: this.state.reviewRating,
				age: this.state.age,
				levelOfEducation: this.state.levelOfEducation,
				isScientist: this.state.isScientist,
				hasReviewed: this.state.hasReviewed,
				hasBeenReviewed: this.state.hasBeenReviewed,
				interestedInTopic: this.state.interestedInTopic,
				field: this.state.field,
				feedback: this.state.feedback,
				usedInterface: this.state.usedInterface,
			})
		})
		.then((response)=> {
			if (!response.ok) { return response.json().then(err => { throw err; }); }
			this.setState({ 
				submitLoading: false,
				submittedSurvey: true
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
		// TODO - need to check if the user has already completed this experiment
		// TODO - add field to 
		const ageOptions = ['0 - 18', '19 - 25', '26 - 35'];
		const hasReviewedOptions = ['never', '1 or 2 times', '2-5 times', 'more than 5 times'];
		const hasBeenReviewedOptions = hasReviewedOptions;
		const levelOfEducationOptions = ['None', 'High school student', 'Undergraduate student', 'Masters student', 'PhD student', 'Postdoc', 'Faculty'];

		
			
			

		return (
			<div style={styles.container}>
				<Helmet title={'Review of Scientific Work · PubPub'} />

				{!this.state.acceptedTerms &&
					<div>
						<h1>Review of Scientific Work</h1>
						<p>We explore a series of tools for peer review. We ask you to play the role of a peer reviewer and review a short article on the growth of dinosaurs. Completing this experiment will likely take ~10 minutes. We ask you to do the following:</p>
						<ol>
							<li>Read a short piece of scientific work.</li>
							<li>Write a short (2-3 sentences) review of the work. And assign a 0-10 rating.</li>
							<li>Answer a short series of survey questions.</li>
						</ol>

						<p>Your submitted content and answers are anonymous and will never be shared, sold, or distributed in any identifiable form.</p>
						<p>The results of this experiment will be published and available on PubPub.</p>
						<div>
							<Button style={styles.button} onClick={this.acceptTerms} className={'pt-intent-primary'}>I agree</Button>
						</div>
					</div>
				}

				{this.state.acceptedTerms && !this.state.submittedReview &&
					<div>
						<h1>Review of Scientific Work: Review</h1>				
						<p>Please read the following article. Your goal as a peer reviewer is to be critical of the processes, writing, and conclusions. At the end of the article, we ask you to write a few short sentences and rate the work.</p>
						
						<div className={'pt-card pt-elevation-2'}>
							<h1>Great Paper</h1>
						</div>

						<label>
							Review the work. Please write a few short sentences containing your review and feedback on the work.
							<Textarea value={this.state.reviewContent} onChange={evt => this.setState({ reviewContent: evt.target.value })} style={styles.input} />
						</label>

						<div style={styles.inputBlock}>
							<div style={styles.label}>Review Rating</div>

							<div className={'pt-button-group pt-fill'} style={{ paddingTop: '1em' }}>
								<Button key={'reviewRating-0'} text={0} onClick={evt => this.setState({ reviewRating: 0 })} className={this.state.reviewRating === 0 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-1'} text={1} onClick={evt => this.setState({ reviewRating: 1 })} className={this.state.reviewRating === 1 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-2'} text={2} onClick={evt => this.setState({ reviewRating: 2 })} className={this.state.reviewRating === 2 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-3'} text={3} onClick={evt => this.setState({ reviewRating: 3 })} className={this.state.reviewRating === 3 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-4'} text={4} onClick={evt => this.setState({ reviewRating: 4 })} className={this.state.reviewRating === 4 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-5'} text={5} onClick={evt => this.setState({ reviewRating: 5 })} className={this.state.reviewRating === 5 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-6'} text={6} onClick={evt => this.setState({ reviewRating: 6 })} className={this.state.reviewRating === 6 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-7'} text={7} onClick={evt => this.setState({ reviewRating: 7 })} className={this.state.reviewRating === 7 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-8'} text={8} onClick={evt => this.setState({ reviewRating: 8 })} className={this.state.reviewRating === 8 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-9'} text={9} onClick={evt => this.setState({ reviewRating: 9 })} className={this.state.reviewRating === 9 ? 'pt-active' : ''}/>
								<Button key={'reviewRating-10'} text={10} onClick={evt => this.setState({ reviewRating: 10 })} className={this.state.reviewRating === 10 ? 'pt-active' : ''}/>
							</div>

							<div style={{ width: 'calc(100% / 11 * 4 - 2px', display: 'inline-block', textAlign: 'center', padding: '4em 0em 1em', marginTop: '-3em', backgroundColor: '#f3f3f4'}}>Reject</div>
							<div style={{ width: 'calc(100% / 11 * 3', display: 'inline-block', textAlign: 'center', padding: '4em 0em 1em', marginTop: '-3em', backgroundColor: '#d3d3d4'}}>Request Revisions</div>
							<div style={{ width: 'calc(100% / 11 * 4', display: 'inline-block', textAlign: 'center', padding: '4em 0em 1em', marginTop: '-3em', backgroundColor: '#f3f3f4'}}>Accept</div>
						</div>

						<div>
							<Button style={styles.button} onClick={this.acceptTermsBack}>Back</Button>
							<Button style={styles.button} onClick={this.submitReview} className={'pt-intent-primary'}>Proceed to Survey</Button>
						</div>
					</div>
				}

				{this.state.acceptedTerms && this.state.submittedReview && !this.state.submittedSurvey &&
					<div>
						<h1>Review of Scientific Work: Survey</h1>		
						<p>Final step! Please complete the survey below. All fields are required. We will only publish and share the results of this survey aggregated with all other survey results.</p>
						
						<div className={'pt-button-group'} style={styles.inputBlock}>
							<div style={styles.label}>Age</div>
							{ageOptions.map((item, index)=> {
								return <Button key={`age-${index}`} text={item} onClick={evt => this.setState({ age: item })} className={this.state.age === item ? 'pt-active' : ''}/>
							})}
						</div>

						<div className={'pt-button-group'} style={styles.inputBlock}>
							<div style={styles.label}>How many times have you been a peer reviewer in the past?</div>
							{hasReviewedOptions.map((item, index)=> {
								return <Button key={`hasReviewed-${index}`} text={item} onClick={evt => this.setState({ hasReviewed: item })} className={this.state.hasReviewed === item ? 'pt-active' : ''}/>
							})}
						</div>

						<div className={'pt-button-group'} style={styles.inputBlock}>
							<div style={styles.label}>How many times have you been a peer reviewer in the past?</div>
							{hasBeenReviewedOptions.map((item, index)=> {
								return <Button key={`hasBeenReviewed-${index}`} text={item} onClick={evt => this.setState({ hasBeenReviewed: item })} className={this.state.hasBeenReviewed === item ? 'pt-active' : ''}/>
							})}
						</div>

						<div className={'pt-button-group'} style={styles.inputBlock}>
							<div style={styles.label}>What is the highest academic role you've held?</div>
							{levelOfEducationOptions.map((item, index)=> {
								return <Button key={`levelOfEducation-${index}`} text={item} onClick={evt => this.setState({ levelOfEducation: item })} className={this.state.levelOfEducation === item ? 'pt-active' : ''}/>
							})}
						</div>

						<div className={'pt-button-group'} style={styles.inputBlock}>
							<div style={styles.label}>Do you consider yourself a scientist?</div>
								<Button key={'isScientist-0'} text={'Yes'} onClick={evt => this.setState({ isScientist: true })} className={this.state.isScientist === true ? 'pt-active' : ''}/>
								<Button key={'isScientist-1'} text={'No'} onClick={evt => this.setState({ isScientist: false })} className={this.state.isScientist === false ? 'pt-active' : ''}/>
						</div>

						<div className={'pt-button-group'} style={styles.inputBlock}>
							<div style={styles.label}>Were you interested in the topic?</div>
								<Button key={'interestedInTopic-0'} text={'Yes'} onClick={evt => this.setState({ interestedInTopic: true })} className={this.state.interestedInTopic === true ? 'pt-active' : ''}/>
								<Button key={'interestedInTopic-1'} text={'No'} onClick={evt => this.setState({ interestedInTopic: false })} className={this.state.interestedInTopic === false ? 'pt-active' : ''}/>
						</div>

						{this.state.mode !== 0 &&
							<div className={'pt-button-group'} style={styles.inputBlock}>
								<div style={styles.label}>Did you use the interactive interface associated with the figure?</div>
									<Button key={'usedInterface-0'} text={'Yes'} onClick={evt => this.setState({ usedInterface: true })} className={this.state.usedInterface === true ? 'pt-active' : ''}/>
									<Button key={'usedInterface-1'} text={'No'} onClick={evt => this.setState({ usedInterface: false })} className={this.state.usedInterface === false ? 'pt-active' : ''}/>
							</div>
						 }


						 <label>
						 	Please provide feedback on your experience during this experiment.
							 <Textarea value={this.state.feedback} onChange={evt => this.setState({ feedback: evt.target.value })} style={styles.input} />
						 </label>


						<div>
							<Button style={styles.button} onClick={this.submitReviewBack}>Back</Button>
							<Button style={styles.button} onClick={this.submitSurvey} className={'pt-intent-primary'}>Submit and Finish Experiment</Button>
						</div>
					</div>
				}

				{this.state.acceptedTerms && this.state.submittedReview && this.state.submittedSurvey &&
					<div>
						<h1>Impact of Review: Submitted</h1>				
						<div style={styles.complete}>
							<NonIdealState
								action={
									<Link to={'/experiments'} className={'pt-button'}>Return to Experiments</Link>
								}
								description={'Thank you! Your review has been submitted and is stored anonymously.'}
								title={'Review Submitted!'}
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


export default Radium(ExperimentsDinosaur);

styles = {
	container: {
		maxWidth: '767px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},	

	complete: {
		margin: '3em 0em',
	},
	button: {
		marginRight: '1em',
	},
	inputBlock: {
		display: 'block',
		margin: '2em 0em',
	},
	input: {
		width: '100%',
		minHeight: '3em',
	},
	
};
