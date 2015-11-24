import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import {LoaderIndeterminate} from '../../components';
import {complete} from '../../actions/autocomplete';
// import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';


let styles = {};

const Autocomplete = React.createClass({
	propTypes: {
		autocompleteData: PropTypes.object,
		dispatch: PropTypes.func,

		autocompleteKey: PropTypes.string,
		resultRenderFunction: PropTypes.func,
		route: PropTypes.string,
		height: PropTypes.string,
		placeholder: PropTypes.string,
		textAlign: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			route: '/autocompletePubs',
			height: '30px',
			placeholder: 'Placeholder',
			textAlign: 'left',
		};
	},

	getInitialState: function() {
		return {
			inputString: '',
		};
	},

	handleOnChange: function(event) {
		this.setState({inputString: event.target.value});
		this.props.dispatch(complete(this.props.autocompleteKey, this.props.route, event.target.value));
	},

	render: function() {
		let resultData = {};
		if (this.props.autocompleteData.get(this.props.autocompleteKey) !== undefined) {
			resultData = this.props.autocompleteData.get(this.props.autocompleteKey).toJS();
		}

		return (
			<div style={styles.container}>

				<input type="text" 
					placeholder={this.props.placeholder} 
					style={[styles.input, styles.align[this.props.textAlign]]} 
					onChange={this.handleOnChange} 
					value={this.state.inputString}/>

				<div style={styles.loader}>
					{resultData.loading
						? <LoaderIndeterminate color={'#000'}/>
						: null
					}
				</div>

				<div className="resultsWrapper">
					{resultData.data
						? this.props.resultRenderFunction(resultData.data)
						: null
					}
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {autocompleteData: state.autocomplete};
})( Radium(Autocomplete) );

styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		position: 'relative',
	},
	input: {
		fontSize: 20,
		fontFamily: 'Lato',
		width: 'calc(100% - 2px)',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#aaa',
		outline: 'none',
	},
	align: {
		left: {
			textAlign: 'left',
		},
		right: {
			textAlign: 'right',
		}
	},
	loader: {
		position: 'absolute',
		top: 26,
		width: '100%',
	},

};
