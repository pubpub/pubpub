import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'components/Link/Link';

require('./footer.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
};

/* This is a rare case of a connected component that isn't a route container. */
/* It is used in too many places where passing props becomes cumbersome */
const Footer = function(props) {
	const appData = props.appData.data || {};
	const loginData = props.loginData.data || {};
	const subdomain = appData.subdomain;
	// const isBasePubPub = window.location.origin === 'https://v4.pubpub.org' || window.location.origin === 'https://www.pubpub.org';
	const isBasePubPub = true;
	const isAdmin = loginData.isAdmin;
	const links = isBasePubPub
		? [
			{
				id: 1,
				title: 'pubpub@media.mit.edu',
				url: 'mailto:pubpub@media.mit.edu',
			},
			{
				id: 2,
				title: 'Code',
				url: 'https://github.com/pubpub',
			},
			{
				id: 4,
				title: 'Terms',
				url: '/tos',
			},

		]
		: [
			{
				id: 1,
				title: 'Dashboard',
				url: '/dashboard',
				adminOnly: true,
			},
			{
				id: 2,
				title: 'RSS',
				url: `https://v4.pubpub.org/rss/${subdomain}.xml`
			},
			{
				id: 4,
				title: 'Terms',
				url: '/tos',
			},
			{
				id: 5,
				title: 'PubPub',
				url: 'https://v4.pubpub.org',
			}
		];

	const wrapperClasses = isBasePubPub
		? 'base-pubpub'
		: 'accent-background accent-color';
	return (
		<div className={`footer ${wrapperClasses}`}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<ul>
							{links.filter((item)=> {
								return !item.adminOnly || isAdmin;
							}).map((link)=> {
								if (link.url.indexOf('https:') > -1 || link.url.indexOf('mailto:') > -1) {
									return <li key={`footer-item-${link.id}`}><a href={link.url}>{link.title}</a></li>;
								}
								return (
									<li key={`footer-item-${link.id}`}>
										<Link to={link.url}>
											{link.title}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

Footer.propTypes = propTypes;
export default connect(state => ({
	appData: state.app,
	loginData: state.login,
}))(Footer);
