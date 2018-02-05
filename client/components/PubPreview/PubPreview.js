import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';
import { getResizedUrl, generatePubBackground } from 'utilities';

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
	isPlaceholder: PropTypes.bool,
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
	isPlaceholder: false,
};

const PubPreview = function(props) {
	const resizedBannerImage = getResizedUrl(props.bannerImage, 'fit-in', '800x0');
	const bannerStyle = props.bannerImage || !props.slug
		? { backgroundImage: `url("${resizedBannerImage}")` }
		: { background: generatePubBackground(props.title) };

	// const collaboratorsCount = props.authors.length + props.collaborators.length;
	const resizedSmallHeaderLogo = props.communityData && getResizedUrl(props.communityData.smallHeaderLogo, 'fit-in', '125x35');
	const communityHostname = props.communityData && (props.communityData.domain || `${props.communityData.subdomain}.pubpub.org`);
	const communityUrl = props.communityData && (props.communityData.domain ? `https://${props.communityData.domain}` : `https://${props.communityData.subdomain}.pubpub.org`);
	const pubLink = props.communityData ? `https://${communityHostname}/pub/${props.slug}` : `/pub/${props.slug}`;

	/* Placeholder state */
	if (!props.slug) {
		return (
			<div className={`pub-preview-component skeleton ${props.size}-preview ${props.isPlaceholder ? 'placeholder' : ''}`}>
				<div className="pt-skeleton banner-image" />
				<div className="content">
					{props.title
						? <h3 className="title">{props.title}</h3>
						: <h3 className="pt-skeleton title">-</h3>
					}
					<div className="pt-skeleton description" />
					<div className="pt-skeleton description" />
					<div className="input-wrapper">
						{props.inputContent}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`pub-preview-component ${props.size}-preview`}>
			{props.size !== 'small' &&
				<a href={pubLink} alt={props.title}>
					<div className="banner-image" style={bannerStyle} />
				</a>
			}
			<div className="content">
				<div className="title-wrapper">
					{props.communityData &&
						<a href={communityUrl} alt={props.communityData.title} className="community-banner" style={{ backgroundColor: props.communityData.accentColor }}>
							<img
								alt={`${props.communityData.title} logo`}
								src={resizedSmallHeaderLogo}
							/>
						</a>
					}
					<a href={pubLink} alt={props.title}><h3 className="title">{props.title}</h3></a>
				</div>

				{!!props.authors.length &&
					<div className="authors">
						<span>by </span>
						{props.authors.sort((foo, bar)=> {
							if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
							if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
							if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
							if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
							return 0;
						}).map((author, index)=> {
							const separator = index === props.authors.length - 1 || props.authors.length === 2 ? '' : ', ';
							const prefix = index === props.authors.length - 1 && index !== 0 ? ' and ' : '';
							if (author.slug) {
								return (
									<span key={`author-${author.id}`}>
										{prefix}
										<a href={`/user/${author.slug}`}>{author.fullName}</a>
										{separator}
									</span>
								);
							}
							return <span key={`author-${author.id}`}>{prefix}{author.fullName}{separator}</span>;
						})}
					</div>
				}

				<div className="date-details">
					<span className="date">{dateFormat(props.publicationDate, 'mmm dd, yyyy')}</span>
					{[...props.authors, ...props.collaborators].sort((foo, bar)=> {
						if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
						if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
						if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
						if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
						return 0;
					}).map((collaborator, index)=> {
						return (
							<Avatar
								key={`avatar-${collaborator.id}`}
								instanceNumber={index}
								userInitials={collaborator.initials}
								userAvatar={collaborator.avatar}
								borderColor="rgba(255, 255, 255, 1.0)"
								width={20}
								doesOverlap={true}
							/>
						);
					})}
				</div>

				{props.description &&
					<div className="description">{props.description}</div>
				}

				{/* -------------- */}
				{/*<div className="content-text">
					{props.communityData &&
						<a href={communityUrl} alt={props.communityData.title} className="community-banner" style={{ backgroundColor: props.communityData.accentColor }}>
							<img
								alt={`${props.communityData.title} logo`}
								src={resizedSmallHeaderLogo}
							/>
						</a>
					}
					<a href={pubLink} alt={props.title}><h3 className="title">{props.title}</h3></a>
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
				</div>*/}
			</div>

		</div>
	);
};

PubPreview.defaultProps = defaultProps;
PubPreview.propTypes = propTypes;
export default PubPreview;
