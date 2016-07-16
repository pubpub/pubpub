import React, {PropTypes} from 'react';
//Uses react to render circles
//Takes data set (array of pairs) and generates circle for each pair
//Inherits scaling functions that take data and return the position of the circles

const renderCircles = (props) => {
	return (coords, index) => {
		const circleProps = {
			cx: props.xScale(coords[0]),
			cy: props.yScale(coords[1]),
			r: 1.5,
			key: index
		};
		return <circle {...circleProps} />;
	};
};

export default (props) => {
	return <g>{ props.data.map(renderCircles(props)) }</g>
}