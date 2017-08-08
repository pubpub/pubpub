import React from 'react';
import { Link } from 'react-router-dom';

require('./footer.scss');

const Footer = function(props) {
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
									return <a key={`footer-item-${link.id}`} href={link.url}><li>{link.title}</li></a>;
								}
								return (
									<Link to={link.url} key={`footer-item-${link.id}`}>
										<li>{link.title}</li>
									</Link>
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
