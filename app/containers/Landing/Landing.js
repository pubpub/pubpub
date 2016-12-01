import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { postUser } from 'containers/App/actions';

let styles;

export const Landing = React.createClass({
	propTypes: {
		appData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			email: '',
			name: '',
		};
	},

	handleSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(postUser(this.state.email, this.state.name));
	},

	render() {

		return (
			<div style={styles.container}>
				<div style={styles.greyBox}>
					<Link to={'/droopyleaves'}>Droopy leaves</Link>
					<div style={styles.content}>
						<h1 style={styles.title}>PubPub for Teams</h1>
						<p style={styles.text}>
							Whether in academia, industry, or your basement - research and discovery is hard. It’s even harder without the tools to publish, find, and leverage related work from around the world or even across the building.
						</p>
						<p style={styles.text}>
							PubPub is a full-stack open source publishing platform that enables structured collaboration across individuals, teams, or countries.
						</p>

						<a href={'https://www.pubpub.org/pub/for-teams'} style={{color: 'white', textDecoration: 'none'}}><button name={'login'} className={'button'} style={styles.pubButton}>
							Go to the Discussion
						</button></a>

						
						{!this.props.appData.user.email &&
							<form onSubmit={this.handleSubmit} style={styles.form}>
								<input id={'email'} name={'email'} type="email" style={styles.input} placeholder={'Subscribe to stay updated'} value={this.state.email} onChange={(evt)=>{this.setState({email: evt.target.value});}} />
								<button name={'login'} className={'button'} style={styles.submitButton} onClick={this.handleSubmit}>
									Submit
								</button>
							</form>
						}
						{this.props.appData.user.email &&
							<h2>Email added!</h2>
						}

					</div>
				</div>

				<div style={styles.whiteBox}>
					<div style={styles.content}>
						<h2 style={styles.title2}>Open Discussion</h2>
						<p style={styles.text}>
							After focusing on scientific publishing for two years, we’re expanding our effort to build PubPub as a tool for all types of research. As part of this process we will be documenting and opening our designs to the community.
						</p>

						<img style={styles.figure} src="/static/diagram.svg"></img>
					</div>
				</div>


				{/* !this.props.appData.user.name &&
					<form onSubmit={this.handleSubmit}>

						<div>
							<label style={styles.label} htmlFor={'username'}>Name</label>
							<input id={'username'} name={'username'} type="text" style={styles.input} value={this.state.name} onChange={(evt)=>{this.setState({name: evt.target.value});}} />
						</div>

						<div>
							<label style={styles.label} htmlFor={'email'}>email</label>
							<input id={'email'} name={'email'} type="email" style={styles.input} value={this.state.email} onChange={(evt)=>{this.setState({email: evt.target.value});}} />
						</div>

						<button name={'login'} className={'button'} style={styles.submitButton} onClick={this.handleSubmit}>
							Join
						</button>
					</form>
				*/}

			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		appData: state.app,
	};
}

export default connect(mapStateToProps)(Landing);

styles = {
	text: {
		fontSize: '1.25em',
		maxWidth: '650px',
	},
	container: {
		fontFamily: '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
		fontWeight: 300,
		width: '100%',
		lineHeight: 1.53,
		// margin: '0 auto',
		// maxWidth: '800px',
	},
	greyBox: {
		backgroundColor: '#f3f3f4',
		padding: '1em',
	},
	whiteBox: {
		padding: '1em',
	},
	content: {
		maxWidth: '800px',
		margin: '0 auto',
	},
	title: {
		fontSize: '4em',
		margin: '0em',
	},
	title2: {
		fontSize: '3em',
		margin: '0em',
	},
	figure: {
		width: '100%',
		maxWidth: '650px',
		margin: '4em 0em',
	},
	form: {
		fontSize: '1.25em',
		margin: '1em 0em',
	},
	input: {
		fontSize: '1.25em',
		padding: '.25em .5em',
		verticalAlign: 'top',
		width: 'calc(100% - 1em - 2px - 100px)',
	},
	submitButton: {
		width: '300px',
		height: '44px',
		lineHeight: '44px',
		fontSize: '0.85em',
		width: '100px'
	},
	pubButton: {
		width: '300px',
		fontSize: '1em',
		display: 'block',
		margin: '2em 0em',
		padding: '1em 0em',
	},
};
