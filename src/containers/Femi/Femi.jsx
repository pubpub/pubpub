import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {funk} from './actions';
import {Link} from 'react-router';
import {Loader} from 'components';

import {globalStyles} from 'utils/styleConstants'; //These are global styles, accessed from utilities.
import {globalMessages} from 'utils/globalMessages'; //These are global messages, accessed from utilities.
import {FormattedMessage} from 'react-intl'; //Used for international language functionality.

let styles = {};

export const Femi = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
		output: PropTypes.string,
	},

	handleFemiSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(funk(this.refs.input.value));
	},

	render: function() {
		const metaData = {
			title: 'Femi Function',
		};
		const isOutput = this.props.output && this.props.output != '';
		return (
			<div className={'login-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1>Femi</h1>

				<form onSubmit={this.handleFemiSubmit}>
					<div>
						<label style={styles.label} htmlFor={'input'}>
							Input
						</label>
						<input ref={'input'} id={'input'} name={'input'} type="text" style={styles.input}/>
					</div>
					{isOutput && <div>
						<label style={styles.label} htmlFor={'output'}>
							Output
						</label>
						<label style={styles.input} htmlFor={'output'}>
							{this.props.output}
						</label>
					</div>}

					<button className={'button'} onClick={this.handleFemiSubmit}>
						Submit
					</button>

				</form>
				
			</div>
		);
	}

});

export default connect( state => {
	return {
		output: state.femi.get('output')
	};
})( Radium(Femi) );

styles = {
	container: {
		width: '500px',
		padding: '0px 15px',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
		color: 'black'
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		...globalStyles.link,
		display: 'block',
		margin: '3em 0em'
	}
};