import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

require('./footer.scss');

const propTypes = {
	isAdmin: PropTypes.bool,
};

const defaultProps = {
	isAdmin: false,
};

const Footer = function(props) {
	const links = [
		{
			id: 1,
			title: 'Dashboard',
			url: '/dashboard',
			adminOnly: true,
		},
		{
			id: 4,
			title: 'Terms',
			url: 'https://www.pubpub.org/terms',
		},
		{
			id: 5,
			title: 'PubPub',
			url: 'https://www.pubpub.org',
		}
	];

	return (
		<div className={'footer accent-background accent-color'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<ul>
							{links.filter((item)=> {
								return !item.adminOnly || props.isAdmin;
							}).map((link)=> {
								if (link.url.indexOf('https:') > -1) {
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
