import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./pubOptionsSocial.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	// setPubData: PropTypes.func.isRequired,
};

class PubOptionsSocial extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}

	render() {
		const pubData = this.props.pubData;
		const communityHostname = this.props.communityData.domain || `${this.props.communityData.subdomain}.pubpub.org`;
		const pubLink = `https://${communityHostname}/pub/${pubData.slug}/${pubData.isDraft ? 'draft' : ''}`;
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
			<div className="pub-options-social-component">
				<div className="buttons">
					{links.map((link)=> {
						return (
							<a href={link.url} className={`pt-button pt-large ${link.icon}`} rel="noopener noreferrer" target="_blank" key={link.title}>
								{link.title}
							</a>
						);
					})}
				</div>
			</div>
		);
	}
}

PubOptionsSocial.propTypes = propTypes;
export default PubOptionsSocial;
