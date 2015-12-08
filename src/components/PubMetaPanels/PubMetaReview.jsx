import React, { PropTypes } from 'react';
import Radium, {Style} from 'radium';
import {MultiSelect} from 'react-selectize';
// import {loadCss} from '../../utils/loadingFunctions';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaReview = React.createClass({
	propTypes: {
		reviewObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			reviewObject: {},
		};
	},

	getInitialState: function() {
		return {
			goodTags: [],
			badTags: [],
			baseTags: [ 'analysis', 'clarity', 'conclusion', 'discussion', 'introduction'].map((tag)=> {
				return {label: tag, value: tag};
			}),
		};
	},

	valueChangeGood: function(tags, callback) {
		this.setState({goodTags: tags}, callback);
	},
	valueChangeBad: function(tags, callback) {
		this.setState({badTags: tags}, callback);
	},
	
	tagUsed: function(label) {
		const usedByGood = this.state.goodTags.map(function(goodTag) {return goodTag.label;}).indexOf(label) !== -1;
		const usedByBad = this.state.badTags.map(function(badTag) {return badTag.label;}).indexOf(label) !== -1;
		return usedByBad || usedByGood;
	},

	createFromSearch: function(options, values, search) {
		if ( search.length === 0 || this.tagUsed(search.toLowerCase()) ) {
			return null;
		}
		return {label: search.toLowerCase(), value: search.toLowerCase()};
	},
	filterJointOptions: function(options, values, search) {
		return this.state.baseTags.filter((option)=> {
			return option.label.indexOf(search.toLowerCase()) > -1 && this.tagUsed(option.label) === false;
		});
	},

	noResults: function(values, search) {
		return (<div className = "no-results-found">
			{(()=> {
				if (search.length === 0) {
					return 'Type a few characters to create a tag';
				} else if (this.tagUsed(search.toLowerCase())) {
					return 'Tag already used';
				}
			})()}
		</div>);
	},

	render: function() {
		return (
			<div style={styles.container}>
				<Style rules={{
					'.goodTags .react-selectize.multi-select .simple-value': {
						backgroundColor: '#CFF1D0',
						border: '1px solid #979797',
						color: '#111',
						borderRadius: '1px',
						fontFamily: 'Lato',
						padding: '2px 10px',
						fontSize: '16px',
						height: '18px',
						lineHeight: '12px',
					},
					'.badTags .react-selectize.multi-select .simple-value': {
						backgroundColor: '#EFC9C9',
						border: '1px solid #979797',
						color: '#111',
						borderRadius: '1px',
						fontFamily: 'Lato',
						padding: '2px 10px',
						fontSize: '16px',
						height: '18px',
						lineHeight: '12px',
					},
					'.react-selectize .control .reset': {
						right: 0,
					},
					'.react-selectize .control .reset:hover': {
						color: '#222',
					},
					'.react-selectize .control .arrow': {
						display: 'none',
					},
					'.react-selectize .control': {
						borderRadius: 0,
						borderColor: '#ddd',
						minHeight: '60px',
					}

					
				}}/>

	
				<div style={styles.tagFormDescription}>
					Reviews are anonymous.
				</div>
				<div style={styles.tagFormDescription}>
					Reviews are weighted by your discussion activity on this pub. 
				</div>
				<div style={styles.tagFormDescription}>
					We encourage you to update your review as new versions are published.
				</div>

				<div style={styles.tagFormHeader}>Done Well</div>
				<div style={styles.tagFormDescription}></div>
				<div style={styles.tagFormWrapper} className={'goodTags'}>
					<MultiSelect
						values = {this.state.goodTags}
						onValuesChange = {this.valueChangeGood} 
						options={this.state.baseTags}
						filterOptions={this.filterJointOptions}
						createFromSearch={this.createFromSearch}
						renderNoResultsFound = {this.noResults} 
						placeholder={'Click to add Tag'}/>
				</div>


				<div style={styles.tagFormHeader}>Needs Work</div>
				<div style={styles.tagFormDescription}></div>

				<div style={styles.tagFormWrapper} className={'badTags'}>
					<MultiSelect
						values = {this.state.badTags}
						onValuesChange = {this.valueChangeBad} 
						options={this.state.baseTags}
						filterOptions={this.filterJointOptions}
						createFromSearch={this.createFromSearch}
						renderNoResultsFound = {this.noResults} 
						placeholder={'Click to add Tag'} />
				</div>
				<div style={styles.saveButton} key={'reviewSubmitButton'}>Save Review</div>
				
					
			</div>
		);
	}
});

export default Radium(PubMetaReview);

styles = {
	container: {
		padding: 15,

	},
	tagFormWrapper: {
		maxWidth: 500,
		margin: '0px 0px 25px 20px',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			margin: '0px 5px 25px 5px',
			maxWidth: '100%',
			width: '100%',
		},
	},
	tagFormHeader: {
		fontSize: '25px',
		margin: '25px 0px 10px 5px',

		color: '#555',

	},
	tagFormDescription: {
		fontSize: '16px',
		maxWidth: '700px',
		color: '#777',
		// fontFamily: 'Lora',
		margin: '0px 0px 10px 5px',
	},
	saveButton: {
		width: '150px',
		marginLeft: 385,
		fontSize: '20px',
		textAlign: 'center',
		color: '#666',
		':hover': {
			color: '#000',
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			marginLeft: 0,
			textAlign: 'right',
			width: '100%',
		},
	},
};
