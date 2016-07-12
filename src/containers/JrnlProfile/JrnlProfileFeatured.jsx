import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';
import Select from 'react-select';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileFeatured = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
		handleCollectionsChange: PropTypes.func,
	},

	getInitialState: function() {
		return {
		};
	},

	componentWillMount() {
		const collections = safeGetInToJS(this.props.jrnlData, ['jrnlData', 'collections']) || [];
		const collectionsObject = {};
		collections.map((item)=> {
			collectionsObject[item._id] = item.title;
		});

		const featuredData = safeGetInToJS(this.props.jrnlData, ['featuredData']) || [];
		const collectionStates = {};
		featuredData.map((item)=> {
			const metadata = item.metadata || {};
			const linkCollections = metadata.collections || [];
			collectionStates[item._id] = linkCollections.map((tag)=>{
				return {value: tag, label: collectionsObject[tag]}
			});
		});
		this.setState(collectionStates);
	},

	handleSelectChange: function(itemID, collectionList) {
		this.setState({[itemID]: collectionList});
		const collectionIDs = collectionList.map(item=>item.value);
		this.props.handleCollectionsChange(itemID, collectionIDs);
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const featuredData = safeGetInToJS(this.props.jrnlData, ['featuredData']) || [];
		const metaData = {
			title: 'Featured · ' + jrnlData.jrnlName,
		};
		
		const collections = jrnlData.collections || [];
		const options = collections.map((item)=> { 
			return {value: item._id, label: item.title};
		});

		return (
			<div>
				<Helmet {...metaData} />				

				{
					featuredData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1;}
						return 0;
					}).map((item, index)=>{
						const selection = (<Select
							name={'collections-' + index}
							options={options}
							value={this.state[item._id]}
							multi={true}
							placeholder={<span>Add to collections</span>}
							onChange={this.handleSelectChange.bind(this, item._id)} />);
						return (
							<PreviewCard 
								key={'featured-' + index}
								image={item.destination.previewImage}
								title={item.destination.title}
								description={item.destination.description} 
								header={<div>Featured on {item.createDate}</div>}
								footer={selection} />
						);
					})
				}
				
				
			</div>
		);
	}
});

export default Radium(JrnlProfileFeatured);

styles = {
	
};
