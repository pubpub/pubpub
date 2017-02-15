import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedRouterLink } from 'react-router';
const RouterLink = Radium(UnwrappedRouterLink);

export const Link = React.createClass({
	propTypes: {
		to: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
		customDomain: PropTypes.string,

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
		
		const pathString = typeof this.props.to === 'string' ? this.props.to : this.props.to.pathname;
		const pathStringReduced = '/' + pathString.split('/').filter((item, index)=> { return index > 1; }).join('/');

		const fullPath = `${pathString}${queryString}`;
		const fullPathReduced = `${pathStringReduced}${queryString}`;
		
		const toJournal = !!this.props.customDomain;
		// Pubpub -> Pubpub
		// Journal (internal) -> pubpub
		// PubPub -> Journal (internal)
		// Journal (internal) -> journal
		if ((!toJournal && !isJournal) ||
			(toJournal && !isJournal && !this.props.customDomain)) {
			return <RouterLink to={this.props.to} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</RouterLink>;
		}

		// Journal (external) -> journal
		if (toJournal && isJournal) {
			return <RouterLink to={fullPathReduced} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</RouterLink>;
		}

		// Journal (external) -> pubpub
		if (!toJournal && isJournal) {
			return <a href={`https://www.pubpub.org${fullPath}`} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</a>;
		}

		// PubPub -> Journal (external)
		if (toJournal && !isJournal && this.props.customDomain) {
			return <a href={`${this.props.customDomain}${fullPathReduced}`} className={this.props.className} style={this.props.style} role={this.props.role}>{this.props.children}</a>;
		}
		return <div />;

	}

});

export default Radium(Link);

