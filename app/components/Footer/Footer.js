import React from 'react';
import { Link } from 'react-router-dom';

require('./footer.scss');

const Footer = function() {
	const links = [
		{
			id: 1,
			title: 'Dashboard',
			url: '/dashboard'
		},
		{
			id: 2,
			title: 'Latest',
			url: '/latest'
		},
		{
			id: 3,
			title: 'Archive',
			url: '/archive'
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
							{links.map((link)=> {
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

export default Footer;
