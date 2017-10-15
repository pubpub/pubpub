import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./footer.scss');

const propTypes = {
	isAdmin: PropTypes.bool,
	isBasePubPub: PropTypes.bool,
};

const defaultProps = {
	isAdmin: false,
	isBasePubPub: false,
};

const Footer = function(props) {
	const links = props.isBasePubPub
		? [
			{
				id: 1,
				title: 'pubpub@media.mit.edu',
				url: 'mailto:pubpub@media.mit.edu',
			},
			{
				id: 4,
				title: 'Terms',
				url: '/terms',
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
				id: 4,
				title: 'Terms',
				url: '/terms',
			},
			{
				id: 5,
				title: 'PubPub',
				url: 'https://v4.pubpub.org',
			}
		];

	const wrapperClasses = props.isBasePubPub
		? 'base-pubpub'
		: 'accent-background accent-color';
	return (
		<div className={`footer ${wrapperClasses}`}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<ul>
							{links.filter((item)=> {
								return !item.adminOnly || props.isAdmin;
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
Footer.defaultProps = defaultProps;
export default Footer;
