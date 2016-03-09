import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import {LoaderIndeterminate} from '../../components';
import {complete, completeFromCache, clear} from '../../actions/autocomplete';

let styles = {};

const Autocomplete = React.createClass({
	propTypes: {
		autocompleteData: PropTypes.object,
		dispatch: PropTypes.func,

		autocompleteKey: PropTypes.string,
		resultRenderFunction: PropTypes.func,
		route: PropTypes.string,
		height: PropTypes.number,
		placeholder: PropTypes.string,
		textAlign: PropTypes.string,
		showBottomLine: PropTypes.bool,
		bottomLineColor: PropTypes.string,
		hideResultsOnClickOut: PropTypes.bool,
		padding: PropTypes.string,
		loaderOffset: PropTypes.number,
		fontColor: PropTypes.string,
		searchPlaceholderColor: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			route: '/autocompletePubs',
			height: 30,
			loaderOffset: 0,
			padding: '0px',
			placeholder: 'Placeholder',
			textAlign: 'left',
			showBottomLine: true,
			hideResultsOnClickOut: true,
		};
	},

	getInitialState: function() {
		return {
			inputString: '',
			showMenu: true,

		};
	},

	componentDidMount: function() {
		// If we want to hideResultsOnClickOut,
		// Attach a listener so we can tell when we're clicking inside the autocomplete menu and outside
		if (this.props.hideResultsOnClickOut === true) {
			document.documentElement.addEventListener('click', this.handleClicks);
		}
		
	},

	componentWillUnmount: function() {
		// On unmount, clear autocomplete results, remove listener in case we attached one.
		this.props.dispatch(clear(this.props.autocompleteKey));
		document.documentElement.removeEventListener('click', this.handleClicks);
	},

	handleClicks: function(event) {
		if (document.getElementById('autocompleteMenu').contains(event.target)) {
			this.setState({showMenu: true});
		} else {
			this.setState({showMenu: false});
		}
	},

	handleOnChange: function(event) {
		this.setState({inputString: event.target.value});
		
		const cachePath = [this.props.autocompleteKey, 'cache', event.target.value];
		return this.props.autocompleteData.hasIn(cachePath) === true
			? this.props.dispatch(completeFromCache(this.props.autocompleteKey, event.target.value, this.props.autocompleteData.getIn(cachePath)))
			: this.props.dispatch(complete(this.props.autocompleteKey, this.props.route, event.target.value));
		
	},

	containerStyle: function() {
		return {
			padding: this.props.padding,
		};
	},

	inputStyle: function() {
		const borderColor = this.props.bottomLineColor ? this.props.bottomLineColor : '#aaa';
		return {
			textAlign: this.props.textAlign,
			height: (this.props.height - 3),
			fontSize: (this.props.height - 10),
			borderColor: this.props.showBottomLine ? borderColor : 'transparent',
			color: this.props.fontColor,
		};
	},

	loaderStyle: function() {
		return {
			top: this.props.height - 1 - this.props.loaderOffset,
		};
	},

	render: function() {
		let resultData = {};
		if (this.props.autocompleteData && this.props.autocompleteData.get(this.props.autocompleteKey) !== undefined) {
			resultData = this.props.autocompleteData.get(this.props.autocompleteKey).toJS();
		}
		return (
			<div style={[styles.container, this.containerStyle()]} id="autocompleteMenu">

				<Style rules={{
					'#autocomplete-input::-webkit-input-placeholder': {
						color: this.props.searchPlaceholderColor
					},
					'#autocomplete-input:-moz-placeholder': {
						color: this.props.searchPlaceholderColor
					},
					'#autocomplete-input::-moz-placeholder': {
						color: this.props.searchPlaceholderColor
					},
					'#autocomplete-input:-ms-input-placeholder': {
						color: this.props.searchPlaceholderColor
					},
				}} />

				<input id={'autocomplete-input'} type="text" 
					placeholder={this.props.placeholder} 
					style={[styles.input, this.inputStyle()]} 
					onChange={this.handleOnChange} 
					value={this.state.inputString}/>

				<div style={[styles.loader, this.loaderStyle()]}>
					{resultData.loading
						? <LoaderIndeterminate color={'#000'}/>
						: null
					}
				</div>

				<div className="resultsWrapper">
					{resultData.data && this.state.showMenu
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
		fontFamily: 'Lato',
		width: 'calc(100% - 2px)',
		borderWidth: '0px 0px 1px 0px',
		outline: 'none',
		backgroundColor: 'transparent',
	},
	loader: {
		position: 'absolute',
		width: '100%',
	},

};
