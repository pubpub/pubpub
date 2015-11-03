import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';

let styles = {};

const App = React.createClass({
	propTypes: {
		children: PropTypes.object.isRequired,
		pushState: PropTypes.func
	},

	render: function() {

		return (
			<div style={styles.body}>
				<div className="header-bar" style={styles.headerBar}>
					<Link to={`/edit`}><h1 style={[styles.headerText, styles.headerLogo]}>PubPub</h1></Link>
					<p style={[styles.headerText, styles.headerLogin]}>Login</p>
				</div>
				<div className="content" style={styles.content}>
					{this.props.children}
				</div>

				
			</div>
		);
	}

});

export default Radium(App);


styles = {
	body: {
		height: '100vh',
		width: '100vw'
	},
	headerBar: {
		width: '100%',
		height: 30,
		backgroundColor: '#222',
		margin: 0,
	},

	headerText: {
		lineHeight: '30px',
		color: 'white',
		textDecoration: 'none',
	},

	headerLogo: {
		margin: 0,
		fontSize: '1em',
		color: '#ddd',
		float: 'left',
		width: '50%',
	},

	headerLogin: {
		margin: 0,
		fontSize: '0.9em',
		color: '#ddd',
		float: 'left',
		width: '50%',
		textAlign: 'right',
	},

	content: {
		width: '100%',
		height: 'calc(100% - 30px)',
		overflow: 'hidden',
		position: 'relative',
		// backgroundColor: 'red',
	},

	base: {
		color: '#f09',
		// transition: '.2s ease-in-out transform, 1s linear opacity',
		':hover': {
			// color: '#0074d9'
			transform: 'translateX(100px)'
		}
	},

	primary: {
		background: '#0074D9'
	},

	warning: {
		background: '#FF4136'
	}
};


// export default connect( state => {
//     return {pushState}
//   })( Radium(Editor) );
