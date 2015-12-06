import React, {PropTypes} from 'react';
import Radium from 'radium';
// import Markdown from 'react-remarkable';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';
// import dateFormat from 'dateformat';

let styles = {};

const PubReviews = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		reviewsData: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			reviewsData: [],
		};
	},

	calculateReviewScores: function(reviews) {
		// TODO: Make this code less miserable and documented (and move it to server)
		// console.log('calculating review scores');
		// console.log('in reviews ', reviews);
		const scoreLists = {};
		for (let reviewIndex = 0; reviewIndex < reviews.length; reviewIndex++) {
			for (let doneWellIndex = 0; doneWellIndex < reviews[reviewIndex].doneWell.length; doneWellIndex++) {
				if (reviews[reviewIndex].doneWell[doneWellIndex] in scoreLists) {
					scoreLists[reviews[reviewIndex].doneWell[doneWellIndex]].push(reviews[reviewIndex].weightLocal + Math.sqrt(reviews[reviewIndex].weightGlobal));
				} else {
					scoreLists[reviews[reviewIndex].doneWell[doneWellIndex]] = [(reviews[reviewIndex].weightLocal + Math.sqrt(reviews[reviewIndex].weightGlobal))];
				}
			}

			for (let needsWorkIndex = 0; needsWorkIndex < reviews[reviewIndex].needsWork.length; needsWorkIndex++) {
				if (reviews[reviewIndex].needsWork[needsWorkIndex] in scoreLists) {
					scoreLists[reviews[reviewIndex].needsWork[needsWorkIndex]].push(-1 * (reviews[reviewIndex].weightLocal + Math.sqrt(reviews[reviewIndex].weightGlobal)));
				} else {
					scoreLists[reviews[reviewIndex].needsWork[needsWorkIndex]] = [-1 * (reviews[reviewIndex].weightLocal + Math.sqrt(reviews[reviewIndex].weightGlobal))];
				}
			}
		}
		// console.log(scoreLists);
		const scoresObject = [];
		for (const scoresTag in scoreLists) {
			if (scoresTag !== undefined) {
				let total = 0;
				let absTotal = 0;
				for (const specificScore in scoreLists[scoresTag]) { 
					// console.log('---');
					// console.log(specificScore);
					// console.log(scoresTag);
					if (specificScore !== undefined) {
						total += scoreLists[scoresTag][specificScore]; 
						absTotal += Math.abs(scoreLists[scoresTag][specificScore]);	
					}
					
				}
				scoresObject.push({
					tag: scoresTag,
					score: Math.floor(100 * total / absTotal) / 100,
					votes: scoreLists[scoresTag].length,
				});	
			}
			
		}
		// console.log(scoresObject);
		return scoresObject.map((scorething)=>{
			return (
				<div key={'review-score-' + scorething.tag} style={rightBarStyles.reviewScore}>
					<span>{scorething.tag}</span>
					<span style={rightBarStyles.scorethingDivider}>|</span>
					<span>{scorething.votes} votes</span>
					<span style={rightBarStyles.scorethingDivider}>|</span>
					<span>{scorething.score}</span>
				</div>
			);	
		});
		
	},

	render: function() {

		return (
			<div style={styles.container}>
				
				<div className="pub-reviews-wrapper" style={rightBarStyles.sectionWrapper}>

					<div style={rightBarStyles.sectionHeader}>Peer Reviews ({this.props.reviewsData.length})</div>
					<div style={rightBarStyles.sectionSubHeader}>
						Full Details | Submit Review
					</div>
					<div style={rightBarStyles.reviewsWrapper}>
						{this.calculateReviewScores(this.props.reviewsData)}
						<div style={globalStyles.clearFix}></div>
					</div>
					
				</div>
				
			</div>
		);
	}
});

export default Radium(PubReviews);

styles = {
	
};
