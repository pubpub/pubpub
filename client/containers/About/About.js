import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import Header from 'components/Header/Header';
import { hydrateWrapper } from 'utilities';

require('./about.scss');

const propTypes = {
	text: PropTypes.string.isRequired,
};

class About extends Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
		};
	}
	componentDidMount() {
		console.log('Hydration of About succeeded');
	}
	render() {
		const x = [];
		for (let index = 0; index < 100; index++) {
			x.push(<div key={index}>Hello, this is some text that I hope to write.</div>);
		}

		return (
			<div id="about-container">
				<Header />
				<div className="page-content">
					<h2>About Page*!69!?</h2>
					<h4>{this.props.text}</h4>
					<p><a href={'/about?cat=0'}>cat</a></p>
					<p><a href={'/about?dog=1'}>dog</a></p>
					<noscript>Buttons will not work without javascript</noscript>
					<Button
						onClick={()=> { this.setState({ active: !this.state.active }); }}
						text={this.state.active ? 'Whatever' : 'Fine'}
						iconName="error"
					/>
					<ul>
						<li><a href="/">Home</a></li>
						<li><a href="/about">About</a></li>
					</ul>
					{x}
				</div>
			</div>
		);
	}
}

About.propTypes = propTypes;
export default About;

hydrateWrapper(About);
