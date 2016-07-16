import ReactDOM from 'react-dom';
import React, {PropTypes} from 'react';
import Radium from 'radium';
import Portal from 'react-portal';

import DiscussionsInput from './DiscussionsInput';

const BioWindow = React.createClass({
	propTypes: {
        modifyBio: PropTypes.func,
        showPopup: PropTypes.func,
    
	},
	getInitialState: function() {
		return ({newBio:''});
	},
	componentDidMount: function() {
	},
    doneButton: function(){
        
        this.props.modifyBio(this.state.newBio)
        this.props.showPopup()
    }, 
    
     handleChange: function(event) {
        
         const newState={newBio: event.target.value}
            this.setState(newState)
        
    },
    cancelButton: function(){
       
        this.props.showPopup()
        
    },
	render: function() {

		const dynamicPosition = {
			top: 150,
			left: 200,
		};
    

		return (
         <div style={[styles.popoverStyle, dynamicPosition]}>
            <h2>Edit your Bio for this Pub</h2>
            <p>
            <input type="text" onChange={this.handleChange}></input>
            </p>
            <p>
            <button style={styles.buttonMedium} onClick={this.cancelButton}>Cancel</button>
            <button style={styles.buttonMedium} onClick={this.doneButton}>Done</button>
            </p>
         </div>
		);
	}
});

const popUpward = Radium.keyframes({
  '0%': {
		transform: 'matrix(0.97,0,0,1,0,12)',
		opacity: 0,
	},
	'20%': {
		transform: 'matrix(0.99,0,0,1,0,2)',
		opacity: 0.7,
	},
	'40%': {
		transform: 'matrix(1,0,0,1,0,-1)',
		opacity: 1,
	},
	'70%': {
		transform: 'matrix(1,0,0,1,0,0)',
		opacity: 1,
	},
	'100%': {
		transform: 'matrix(1,0,0,1,0,0)',
		opacity: 1,
	},
}, 'popupwards');


const styles = {
	popoverStyle: {
		position: 'absolute',
		backgroundColor: '#BBBDC0',
		zIndex: 100,
		animation: 'x 180ms forwards linear',
		animationName: popUpward,
		padding: '5px 10px',
		borderRadius: '2px',
        width: '500px',
        height: '300px'
	},
	buttonMedium: {
    padding: '.45em .9em .6em .9em',
    borderRadius: '.1rem',
    }
};


export default Radium(BioWindow);
