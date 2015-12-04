import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
import PubModalTOCRow from './PubModalTOCRow';
// import {globalStyles} from '../../utils/styleConstants';

// let styles = {};

const PubModalTOC = React.createClass({
	propTypes: {
		tocData: PropTypes.array,
		closeModalAndMenuHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			tocData: [],
		};
	},

	onRowClick: function(index) {
		return ()=>{
			this.props.closeModalAndMenuHandler(1)();
			
			setTimeout(()=>{ // Route changes seem to jank up the scroll on mobile.
				document.getElementById(this.props.tocData[index].id).scrollIntoView();
			}, 200);
			
		};
		
	},

	render: function() {
		return (
			<div style={baseStyles.pubModalContainer}>

				<div style={baseStyles.pubModalTitle}>Table of Contents</div>
				<div style={baseStyles.pubModalContentWrapper}>
					{()=>{

						const defaultValues = [0, 0, 0, 0, 0, 0];
						let headerValues = [0, 0, 0, 0, 0, 0]; // Support six-depths of header

						return this.props.tocData.map((contentItem, index)=>{
							headerValues[contentItem.level - 1] += 1; // Increment the counter for the currentLevel
							headerValues = headerValues.slice(0, contentItem.level).concat(defaultValues.slice(contentItem.level, 6)); // Clear all values after the currentLevel
							const tocIndex = headerValues.slice(0, contentItem.level).join('.'); // Slice an array that is only as long as currentLevel and join them into a string with separating periods
							return <PubModalTOCRow key={'pubModalRow-' + index} content={contentItem} dataIndex={index} tocIndex={tocIndex} onRowClickHandler={this.onRowClick}/>;
						});

					}()}
				</div>
				

			</div>
		);
	}
});

export default Radium(PubModalTOC);

// styles = {
	
// };
