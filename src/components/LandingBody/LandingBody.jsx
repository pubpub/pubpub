import React, {PropTypes} from 'react';
import Radium from 'radium';
import {LandingComponentBlock, LandingComponentCollectionList, LandingComponentSearch, LandingComponentRecentList, LandingComponentCollectionGallery, LandingComponentCDMXConstitution} from '../LandingComponents';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

export const LandingBody = React.createClass({
	propTypes: {
		componentsArray: PropTypes.array,
		journalID: PropTypes.string,
		journalData: PropTypes.object,
		query: PropTypes.object,
		setQueryHandler: PropTypes.func,
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
									style={component.style} 
									collections={this.props.journalData.get('collections').toJS()} 
									selectCollections={component.collections && component.collections.replace(/ /g, '').split(',')} />
							);
						case 'collectionGallery': 
							return (
								<LandingComponentCollectionGallery 
									key={'LandingComponent-' + index}
									style={component.style} 
									collections={this.props.journalData.get('collections').toJS()} />
							);
						case 'recentList': 
							return (
								<LandingComponentRecentList 
									key={'LandingComponent-' + index}
									style={component.style} 
									recentPubs={this.props.journalData && this.props.journalData.get('pubsFeatured') ? this.props.journalData.get('pubsFeatured').toJS() : []}/>
							);

						case 'LandingComponentCDMXConstitution':
							return (
								<LandingComponentCDMXConstitution 
									key={'LandingComponent-' + index}
									collections={this.props.journalData.get('collections').toJS()}
									query={this.props.query} 
									setQueryHandler={this.props.setQueryHandler} />
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
