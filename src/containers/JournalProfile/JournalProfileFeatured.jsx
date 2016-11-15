import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard, SelectValue, SelectOption} from 'components';
import Select from 'react-select';
import request from 'superagent';
import dateFormat from 'dateformat';

// import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const JournalProfileFeatured = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		handleFeatureAtom: PropTypes.func,
		handleCollectionsChange: PropTypes.func,
	},

	getInitialState: function() {
		return {
			// State is used to store collectionData for each featured item,
			featureValue: null,
		};
	},

	componentWillMount() {
		// Create an object with key = collectionID and value = title of collection.
		// We will use this to 'lookup' collection titles by their ID
		const collections = safeGetInToJS(this.props.journalData, ['journalData', 'collections']) || [];
		const collectionsObject = {};
		collections.map((item)=> {
			collectionsObject[item._id] = item.title;
		});

		// Load all of the collection data for each link into the Component State.
		// This state is used to control the Selectize component
		const featuredData = safeGetInToJS(this.props.journalData, ['featuredData']) || [];
		const collectionStates = {};
		featuredData.map((featureLink)=> {
			const metadata = featureLink.metadata || {};
			const linkCollections = metadata.collections || [];
			collectionStates[featureLink._id] = linkCollections.map((tag)=>{
				// Return an object that is structured to work with the
				// Selectize component
				return {value: tag, label: collectionsObject[tag]};
			})
			.filter((tag)=> {
				// Only return the tags that have a label.
				// This prevents us from rendering empty collections which have been deleted
				// but still remain in the collections metadata
				return tag.label;
			});
		});
		this.setState(collectionStates);
	},

	handleSelectChange: function(itemID, collectionList) {
		this.setState({[itemID]: collectionList});
		const collectionIDs = collectionList.map(item=>item.value);
		this.props.handleCollectionsChange(itemID, collectionIDs);
	},

	loadOptions: function(input, callback) {
		request.get('/api/autocompleteAtoms?string=' + input).end((err, response)=>{
			const responseArray = response.body || [];
			const featuredData = safeGetInToJS(this.props.journalData, ['featuredData']) || [];
			const featuredDataIDs = featuredData.map((featured)=> {
				return featured.destination._id;
			});

			const options = responseArray.filter((item)=>{
				// Filter out already featured atoms
				return featuredDataIDs.indexOf(item._id) === -1;
			}).map((item)=>{
				return {
					value: item.slug,
					label: item.title,
					slug: item.slug,
					image: item.previewImage,
					id: item._id,
				};
			});
			callback(null, { options: options });
		});
	},

	handleFeatureSelectChange: function(value) {
		this.setState({ featureValue: value });
	},

	featureAtom: function() {
		if (!this.state.featureValue) { return null; }
		this.props.handleFeatureAtom(this.state.featureValue.id);
		this.setState({featureValue: null});
	},

	render: function() {
		const journalData = safeGetInToJS(this.props.journalData, ['journalData']) || {};
		const featuredData = safeGetInToJS(this.props.journalData, ['featuredData']) || [];
		const metaData = {
			title: 'Featured · ' + journalData.journalName,
		};

		const collections = journalData.collections || [];
		const options = collections.map((item)=> {
			return {value: item._id, label: item.title};
		});

		return (
			<div className={'firstChildNoTopMargin'}>
				<Helmet {...metaData} />
				<Style rules={{
					'.featured-list .Select-control': { borderWidth: '0px', height: '34px'},
					'.featured-list .Select-placeholder': {lineHeight: '34px'},
				}} />

				<Select.Async
					name="form-field-name"
					minimumInput={3}
					autoload={false}
					value={this.state.featureValue}
					loadOptions={this.loadOptions}
					placeholder={<FormattedMessage id="journalProfileFeatured.SearchForPubToFeature" defaultMessage="Search for Pub to Feature"/>}
					onChange={this.handleFeatureSelectChange}
					optionComponent={SelectOption}
					valueComponent={SelectValue}/>
				<div className={'button'} style={[styles.submitButton, (this.state.featureValue && this.state.featureValue.id) && styles.submitButtonActive]} onClick={this.featureAtom}><FormattedMessage id="journalProfileFeatured.FeaturePub" defaultMessage="Feature Pub"/></div>


				<div className={'featured-list'}>
				{
					featuredData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						const selection = (<Select
							name={'collections-' + index}
							options={options}
							value={this.state[item._id]}
							multi={true}
							placeholder={<span><FormattedMessage id="JournalProfileFeatured.AddToCollections" defaultMessage="Add to collections"/></span>}
							onChange={this.handleSelectChange.bind(this, item._id)} />);
						return (
							<PreviewCard
								type={'atom'}
								key={'featured-' + index}
								image={item.destination.previewImage}
								title={item.destination.title}
								slug={item.destination.slug}
								description={item.destination.description}
								header={<div>Featured on {dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</div>}
								footer={selection} />
						);
					})
				}
				</div>


			</div>
		);
	}
});

export default Radium(JournalProfileFeatured);

styles = {
	submitButton: {
		fontSize: '0.9em',
		margin: '1em 0em',
		pointerEvents: 'none',
		opacity: 0.5,
	},
	submitButtonActive: {
		pointerEvents: 'auto',
		opacity: 1,
	},
};
