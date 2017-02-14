import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as RouterLink } from 'react-router';
let styles;

export const Link = React.createClass({
	propTypes: {
		to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		customDomain: PropTypes.string,
		toJournal: PropTypes.bool,

		className: PropTypes.string,
		style: PropTypes.object,
		role: PropTypes.string,
		children: PropTypes.node,
	},

	render() {
		const isJournal = window.isJournal; // This is set in Routes.js
		const toIsObject = typeof this.props.to === 'object';
		const queryObject = toIsObject ? this.props.to.query || {} : {};
		const queryString = !toIsObject ? '' : Object.keys(queryObject).filter((key)=> {
			return !!queryObject[key];
		}).reduce((previous, current, index)=> {
			return `${index === 0 ? '?' : ''}${previous}${index > 0 ? '&' : ''}${current}=${queryObject[current]}`;
		}, '');
		const fullPathString = typeof this.props.to === 'string' ? this.props.to : `${this.props.to.pathname}${queryString}`

		// Pubpub -> Pubpub
		// Journal (internal) -> pubpub
		// PubPub -> Journal (internal)
		// Journal (internal) -> journal
		if ((!this.props.toJournal && !isJournal) ||
			(this.props.toJournal && !isJournal && !this.props.customDomain)) {
			return <RouterLink to={this.props.to} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</RouterLink>
		}

		// Journal (external) -> journal
		if (this.props.toJournal && isJournal) {
			const reducedPath = '/' + fullPathString.split('/').filter((item, index)=> { return index > 1; }).join('/');
			return <RouterLink to={reducedPath} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</RouterLink>
		}

		// Journal (external) -> pubpub
		if (!this.props.toJournal && isJournal) {
			return <a href={`https://www.pubpub.org${fullPathString}`} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</a>
		}

		// PubPub -> Journal (external)
		if (this.props.toJournal && !isJournal && this.props.customDomain) {
			return <a href={`${this.props.customDomain}${fullPathString}`} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</a>
		}

	}

});

export default Radium(Link);

