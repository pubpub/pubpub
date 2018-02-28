import React from 'react';
import PropTypes from 'prop-types';

require('./pubPresShare.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
};

const PubPresShare = function(props) {
	const pubData = props.pubData;
	const communityHostname = props.communityData.domain || `${props.communityData.subdomain}.pubpub.org`;
	const pubLink = `https://${communityHostname}/pub/${pubData.slug}`;
	const pubTitle = pubData.title;
	const links = [
		{
			title: 'Twitter',
			icon: 'pt-icon-twitter',
			url: `https://twitter.com/intent/tweet?url=${pubLink}&text=${pubTitle}`,
		},
		{
			title: 'Reddit',
			icon: 'pt-icon-reddit',
			url: `https://reddit.com/submit?url=${pubLink}&title=${pubTitle}`,
		},
		{
			title: 'Facebook',
			icon: 'pt-icon-facebook',
			url: `https://www.facebook.com/sharer.php?u=${pubLink}`,
		},
		{
			title: 'Google+',
			icon: 'pt-icon-google-plus',
			url: `https://plus.google.com/share?url=${pubLink}`,
		},
		{
			title: 'LinkedIn',
			icon: 'pt-icon-linkedin',
			url: `https://www.linkedin.com/shareArticle?url=${pubLink}&title=${pubTitle}`,
		},
		{
			title: 'Email',
			icon: 'pt-icon-envelope',
			url: `mailto:?subject=${pubTitle}&body=${pubLink}`,
		},
	];
	return (
		<div className="pub-pres-share-component">
			<h5>Share</h5>
			<div className="buttons">
				{links.map((link)=> {
					return (
						<a href={link.url} className={`pt-button pt-large ${link.icon}`} target="_blank" key={link.title}>
							{link.title}
						</a>
					);
				})}
			</div>
		</div>
	);
};

PubPresShare.propTypes = propTypes;
export default PubPresShare;
