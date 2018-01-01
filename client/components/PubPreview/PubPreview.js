import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';
import { getResizedUrl } from 'utilities';

require('./pubPreview.scss');

const propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	slug: PropTypes.string,
	authors: PropTypes.array,
	collaborators: PropTypes.array,
	publicationDate: PropTypes.string,
	bannerImage: PropTypes.string,
	size: PropTypes.string,
	communityData: PropTypes.object,
	inputContent: PropTypes.node,
	// isLarge: PropTypes.bool,
	// isMinimal: PropTypes.bool,
};

const defaultProps = {
	title: undefined,
	slug: undefined,
	description: undefined,
	authors: [],
	collaborators: [],
	publicationDate: undefined,
	bannerImage: undefined,
	size: 'large',
	communityData: undefined,
	inputContent: null,
	// isLarge: false,
	// isMinimal: false,
};

// Have space for input
// Set title if given
const PubPreview = function(props) {
	const gradients = [
		'linear-gradient(to right, rgba(116, 235, 213, 0.5), rgba(172, 182, 229, 0.5))',
		'linear-gradient(to right, rgba(225, 238, 195, 0.5), rgba(240, 80, 83, 0.5))',
		'linear-gradient(to right, rgba(34, 193, 195, 0.5), rgba(253, 187, 45, 0.5))',
		'linear-gradient(to right, rgba(217, 167, 199, 0.5), rgba(255, 252, 220, 0.5))',
		'linear-gradient(to right, rgba(201, 214, 255, 0.5), rgba(226, 226, 226, 0.5))'
	];
	const resizedBannerImage = getResizedUrl(props.bannerImage, 'fit-in', '800x0');
	const bannerStyle = props.bannerImage || !props.slug
		? { backgroundImage: `url("${resizedBannerImage}")` }
		: { background: gradients[props.title.charCodeAt(props.title.length - 1) % 4] };

	const collaboratorsCount = props.authors.length + props.collaborators.length;
	const resizedSmallHeaderLogo = props.communityData && getResizedUrl(props.communityData.smallHeaderLogo, 'fit-in', '125x35');
	const communityHostname = props.communityData && (props.communityData.domain || `${props.communityData.subdomain}.pubpub.org`);
	const communityUrl = props.communityData && (props.communityData.domain ? `https://${props.communityData.domain}` : `https://${props.communityData.subdomain}.pubpub.org`);
	const pubLink = props.communityData ? `https://${communityHostname}/pub/${props.slug}` : `/pub/${props.slug}`;

	return (
		<div className={`pub-preview-component ${props.size}-preview`}>
			{props.size !== 'small' &&
				<a href={pubLink}>
					<div className="banner-image" style={bannerStyle} />
				</a>
			}
			<div className="content">
				<div className="content-text">
					{props.communityData &&
						<a href={communityUrl} className="community-banner" style={{ backgroundColor: props.communityData.accentColor }}>
							<img
								alt={`${props.communityData.title} logo`}
								src={resizedSmallHeaderLogo}
							/>
						</a>
					}
					<a href={pubLink}><h3 className="title">{props.title}</h3></a>
					{props.description &&
						<div className="description">{props.description}</div>
					}
				</div>

				<div className="collaborators">
					{!!props.authors.length &&
						<div className="avatars">
							{props.authors.map((author, index)=> {
								return (
									<Avatar
										key={`author-${author.id}`}
										width={35}
										doesOverlap={index !== props.authors.length - 1}
										borderColor="#FFF"
										userAvatar={author.avatar}
										userInitials={author.initials}
									/>
								);
							})}
						</div>
					}
					<div className="details">
						<div className="subtext">{collaboratorsCount} collaborator{collaboratorsCount === 1 ? '' : 's'}</div>
						<div className="subtext">{dateFormat(props.publicationDate, 'mmm dd, yyyy')}</div>
					</div>
				</div>
			</div>

		</div>
	);
};

PubPreview.defaultProps = defaultProps;
PubPreview.propTypes = propTypes;
export default PubPreview;
