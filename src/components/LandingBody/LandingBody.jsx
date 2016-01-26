import React, {PropTypes} from 'react';
import Radium from 'radium';
import {LandingComponentBlock, LandingComponentCollectionList, LandingComponentSearch, LandingComponentRecentList} from '../LandingComponents';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LandingBody = React.createClass({
	propTypes: {
		componentsArray: PropTypes.array,
		journalID: PropTypes.string,
		journalData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			componentsArray: [],
		};
	},

	render: function() {
		// console.log('components Array in lBody', this.props.componentsArray);
		return (
			<div style={styles.container}>
				{
					this.props.componentsArray.map((component, index)=>{
						// console.log(component);
						switch (component.type) {
						case 'block': 
							return ( 
								<LandingComponentBlock 
									key={'LandingComponent-' + index} 
									text={component.text} 
									link={component.link} 
									image={component.image} 
									style={component.style}
									childArray={component.children}
									journalID={this.props.journalID}
									journalData={this.props.journalData}/>
							);
						case 'search': 
							return (
								<LandingComponentSearch 
									key={'LandingComponent-' + index}
									showBottomLine={component.showBottomLine}
									placeholder={component.placeholder}
									resultBackgroundColor={component.resultBackgroundColor}
									style={component.style} 
									searchFontColor={component.searchFontColor}
									searchPlaceholderColor={component.searchPlaceholderColor}
									bottomLineColor={component.bottomLineColor}
									journalID={this.props.journalID}/>
							);
						case 'collectionList': 
							return (
								<LandingComponentCollectionList 
									key={'LandingComponent-' + index}
									style={component.style} />
							);
						case 'recentList': 
							return (
								<LandingComponentRecentList 
									key={'LandingComponent-' + index}
									style={component.style} 
									recentPubs={this.props.journalData && this.props.journalData.get('pubsFeatured') ? this.props.journalData.get('pubsFeatured').toJS() : []}/>
							);
						default:
							return null;
						}
					})
				}
			</div>
		);
	}
});

export default Radium(LandingBody);

styles = {
	container: {

	},
};

// type
// text
// link
// image
// style
