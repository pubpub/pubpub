import React, { useMemo } from 'react';

import { Icon, PubByline, PubTitle } from 'components';
import { LandingPageFeatures, Pub } from 'types';
import { getPrimaryCollection } from 'utils/collections/primary';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { formatDate } from 'utils/dates';
import { collectionUrl, communityUrl } from 'utils/canonicalUrls';

require('./landing.scss');

type Props = {
	featuredItems: LandingPageFeatures;
};

type FlattenedPub = {
	pub: Pub;
	title: React.ReactNode;
	community: {
		title: string;
		url: string;
	};
	primaryCollection: null | {
		title: string;
		url: string;
	};
	publishedDate: null | string;
	byline: React.ReactNode;
};

const getFlattenedPubsFromFeaturedItems = (featuredItems: LandingPageFeatures): FlattenedPub[] => {
	return featuredItems.pub.map((feature) => {
		const { pub } = feature;
		const { community } = pub;
		const primaryCollection = getPrimaryCollection(pub.collectionPubs);
		const publishedDate = getPubPublishedDate(pub);
		return {
			pub,
			publishedDate: publishedDate ? formatDate(publishedDate) : null,
			byline: <PubByline pubData={pub} />,
			title: <PubTitle pubData={pub} shouldUseHtmlTitle />,
			community: {
				title: community.title,
				url: communityUrl(community),
			},
			primaryCollection: primaryCollection
				? {
						title: primaryCollection.title,
						url: collectionUrl(community, primaryCollection),
				  }
				: null,
		};
	});
};

const features = [
	{
		icon: 'badge',
		title: 'DOI Support',
		desc: 'Generate CrossRef DOIs for your documents in one click.',
	},
	{
		icon: 'shield',
		title: 'Submissions & Review',
		desc: 'Manage submissions and peer review directly on PubPub.',
	},
	{
		icon: 'comment',
		title: 'Discussions & Annotations',
		desc: 'Host public and private discussions with your readers and community, whether in your classroom or across the world.',
	},
] as const;

const communities = [
	{
		name: 'Harvard Data Science Review',
		description: 'A microscopic, telescopic & kaleidoscopic view of data science.',
		logo: '/static/landing/hdsr.png',
		type: 'Journals',
		category: 'Science',
		link: 'https://hdsr.mitpress.mit.edu',
	},
];

const Landing = (props: Props) => {
	const { featuredItems } = props;
	const flattenedPubs = useMemo(
		() => getFlattenedPubsFromFeaturedItems(featuredItems),
		[featuredItems],
	);

	const featureGrid = features.map((feature) => {
		return (
			<div className="feature" key={feature.icon}>
				<Icon icon={feature.icon} className="icon" />
				<div className="description">
					<h4>{feature.title}</h4>
					<p>{feature.desc}</p>
				</div>
			</div>
		);
	});

	const pubList = flattenedPubs.map((flat) => {
		const { title, pub, community, primaryCollection, byline, publishedDate } = flat;
		const { description, headerBackgroundImage } = pub;
		return (
			<div className="pub" key={pub.id}>
				<div className="slab">
					{headerBackgroundImage && (
						<img className="image-bg" src={headerBackgroundImage} alt="" />
					)}
					<div className="color-overlay" />
					<div className="info">
						<div className="title-box">
							<Icon icon="pubDoc" className="icon" />
							<div className="pub-title">{title}</div>
						</div>
						{description && <div className="desc">{description}</div>}
						<div className="authors">{byline}</div>
						{publishedDate && (
							<div className="date-box">
								<Icon icon="globe" className="icon" />
								<div className="date">{publishedDate}</div>
							</div>
						)}
					</div>
				</div>
				<div className="meta">
					{primaryCollection && (
						<div className="item">
							<div className="icon-title">
								<Icon icon="collection" className="icon" />
								<div className="meta-title">Collection</div>
							</div>
							<div className="name">{primaryCollection.title}</div>
							<a className="more" href={primaryCollection.url}>
								See more from this Collection
							</a>
						</div>
					)}
					<div className="item">
						<div className="icon-title">
							<Icon icon="office" className="icon" />
							<div className="meta-title">Community</div>
						</div>
						<div className="name">{community.title}</div>
						<a className="more" href={community.url}>
							Visit Community homepage
						</a>
					</div>
				</div>
			</div>
		);
	});

	return (
		<div id="landing-container">
			<style>{`
				.header-component.bp3-dark a.bp3-button,
				.header-component.bp3-dark a.bp3-button:hover {
					color: #111;
				}
			`}</style>
			{/* BEGIN Jumbotron */}
			<div id="jumbotron">
				<div className="titles">
					<h1>PubPub</h1>
					<h2>an open-source, community-led, end-to-end</h2>
					<div className="subtitle-1">
						publishing platform <span className="smaller">for</span>
					</div>
					<div className="video-text-container">
						<video className="bg-video" autoPlay loop muted>
							<source src="/static/landing/test-vid-1.mp4" type="video/mp4" />
						</video>
						<p className="subtitle-2">knowledge communities</p>
					</div>
					<a href="/community/create" className="custom-callout-button-1">
						Create your community
					</a>
				</div>
				<div className="title-popovers">
					<div className="popover">
						<img src="/static/landing/_landing_popover1.png" />
					</div>
					<div className="popover">
						<img src="/static/landing/_landing_popover2.png" />
						<img src="/static/landing/_landing_popover3.png" />
						<img src="/static/landing/_landing_popover4.png" />
					</div>
				</div>
			</div>
			{/* END Jumbotron */}
			{/* BEGIN Main; content */}
			<div id="main">
				<div className="icon-border" />
				{/* BEGIN Callout Repeat Block */}
				<div className="callout-repeat">
					<div className="text-blocks">
						<p>create knowledge.</p>
						<p>share it with audiences who care.</p>
					</div>
					<a href="/community/create" className="custom-callout-button-2">
						Start creating now...
					</a>
				</div>
				{/* END Callout Repeat Block */}

				<div className="mission-open-box">
					<div className="container">
						<div className="box-item">
							<div className="title">mission</div>
							<p>
								As a product of the Knowledge Futures Group, PubPub is open and
								accessible to all. That means a free, robust version of PubPub will
								always be available, operating under a non-profit, sustainable
								business model.
							</p>
						</div>
						<div className="box-item">
							<div className="title">open & community led</div>
							<div className="buttons">
								<a href="" className="button">
									<Icon icon="git-repo" className="icon" />
									<p>Github</p>
								</a>
								<a href="" className="button">
									<Icon icon="map" className="icon" />
									<p>Roadmap</p>
								</a>
								<a href="" className="button">
									<Icon icon="comment" className="icon" />
									<p>Forum</p>
								</a>
								<a href="" className="button">
									<Icon icon="office" className="icon" />
									<p>KFG community</p>
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className="publist-box">
					<div className="container">
						<div className="title">featured pubs</div>
						<div className="row pub-list">{pubList}</div>
					</div>
				</div>

				<div className="communities-box">
					<div className="container">
						<div className="title">featured communities</div>
						<div className="featured-space" />
						<div className="callout-repeat">
							<div className="text-blocks">
								<p>feeling inspired?</p>
								<p>create your own community now!</p>
							</div>
							<a href="/community/create" className="custom-callout-button-2">
								Start creating now...
							</a>
						</div>
					</div>
				</div>

				<div className="trustedby-box">
					<div className="container">
						<div className="title">pubpub is trusted by</div>
						<div className="links">
							<div className="row">
								<a href="" className="logo-link">
									<img src="/static/landing/logos/apa.png" />
								</a>
								<a href="" className="logo-link">
									<img src="/static/landing/logos/arcadia.png" />
								</a>
								<a href="" className="logo-link">
									<img src="/static/landing/logos/hdsi.png" />
								</a>
								<a href="" className="logo-link">
									<img src="/static/landing/logos/crimrxiv.png" />
								</a>
							</div>
							<div className="row">
								<a href="" className="logo-link">
									<img src="/static/landing/logos/africarxiv.png" />
								</a>
								<a href="" className="logo-link">
									<img src="/static/landing/logos/collegeofcomputing.png" />
								</a>
								<a href="" className="logo-link">
									<img src="/static/landing/logos/mediastudies.png" />
								</a>
								<div className="more">
									and <span>4000+</span> other communities all over the world
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* END Main content */}
		</div>
	);
};

export default Landing;
