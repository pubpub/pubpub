import React, { useMemo, useState } from 'react';

import { Icon, PubByline, PubTitle } from 'components';
import { LandingPageFeatures, Community, Pub, DocJson } from 'types';
import { getPrimaryCollection } from 'utils/collections/primary';
import { getPubPublishedDate } from 'utils/pub/pubDates';
import { formatDate } from 'utils/dates';
import { collectionUrl, communityUrl, pubUrl } from 'utils/canonicalUrls';
import { Tab, Tabs, TabId } from "@blueprintjs/core";
import { getTextFromDoc, jsonToNode } from 'components/Editor';


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
		accentColorDark: string;
		accentColorLight: string;
	};
	primaryCollection: null | {
		title: string;
		url: string;
	};
	publishedDate: null | string;
	byline: React.ReactNode;
};

type FlattenedCommunity = {
	community: Community;
	title: string;
	since: string;
	url: string;
	meta: {
		backgroundColor: string | undefined;
		imageUrl: string;
		highlights: DocJson;
		quote: DocJson;
	}
};

const getFlattedCommunitiesFromFeaturedItems = (featuredItems: LandingPageFeatures): FlattenedCommunity[] => {
	return featuredItems.community.map((feature) => {
		const { community } = feature;
		return {
			community,
			title: community.title,
			since: 'June 2022',
			url: communityUrl(community),
			meta: {
				backgroundColor: feature.payload.backgroundColor,
				imageUrl: feature.payload.imageUrl,
				highlights: feature.payload.highlights,
				quote: feature.payload.quote,
			}
		}
	});
}

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
				accentColorDark: community.accentColorDark,
				accentColorLight: community.accentColorLight
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
	{
		icon: 'page-layout',
		title: 'Easily Customizable Layouts',
		desc: 'Create your custom site without writing a line of code.',
	},
	{
		icon: 'book',
		title: 'Collection Metadata',
		desc: 'Include article & collection-level metadata for easier organization of content and improved discovery.',
	},
	{
		icon: 'people',
		title: 'Access Control',
		desc: 'Allow anyone to access your content, or just the people you choose.',
	},
	{
		icon: 'grouped-bar-chart',
		title: 'Impact Measurement',
		desc: 'Learn about the people visiting your community with a full suite of privacy-respecting analytics.',
	},
	{
		icon: 'graph',
		title: 'Content Connections',
		desc: 'Add typed relationships — reviews, commentary, supplement, etc. — to your content and deposit them to Crossref.',
	},
	{
		icon: 'export',
		title: 'Document Export',
		desc: 'Export your work to PDF, Word, Markdown, LaTeX, JATS XML, and more.',
	},
] as const;

const Landing = (props: Props) => {
	const { featuredItems } = props;
	const flattenedPubs = useMemo(
		() => getFlattenedPubsFromFeaturedItems(featuredItems),
		[featuredItems],
	);

	const flattenedCommunities = useMemo(
		() => getFlattedCommunitiesFromFeaturedItems(featuredItems),
		[featuredItems],
	);
	const [communityTabId, setTabId] = useState<number>(1);
	const [featuredCommunityColor, setFeaturedCommunityColor] = useState<string   |undefined>(flattenedCommunities[0].meta.backgroundColor);

	const handleCommunityTabChange = (communityTabId:number, targetColor:string) => {
		setTabId(communityTabId);
		setFeaturedCommunityColor(flattenedCommunities[communityTabId-1].meta.backgroundColor);
	}

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

	const communitiesBlock = () => {
		const communityTabs = () => flattenedCommunities.map((flat, index) => {
			const highlightsList = () => {
				return (
					<ul>
						{getTextFromDoc(jsonToNode(flat.meta.highlights)).split("#").map((highlight) => {
							return <li>{highlight}</li>
						})}
					</ul>
				);
			};
			const panel = () => {
				return (
					<div className="panel-inner">
						<div className="img-highlights">
							<img className="community-image" src={flat.meta.imageUrl} alt={"Community Image"} />
							<div className="highlights">
								<div className="header">
									<Icon icon="badge" className="icon" />
									<span>Highlights</span>
								</div>
								{highlightsList()}
							</div>
						</div>
						<div className="quote">
							<Icon icon="citation" className="icon" />
							<div className="text">{getTextFromDoc(jsonToNode(flat.meta.quote))}</div>
						</div>
						<div className="info">
							<Icon icon="link" className="icon" />
							<div className="text">
								<a href={flat.url}>{flat.url}</a>
								<p>on PubPub since {flat.since}</p>
							</div>
						</div>
					</div>
				)
			}
			const tabtitle = () => {
				return (
					<div className="tab-title">
							<Icon icon="office" className="icon" />
							<div className="name">{flat.title}</div>
							<Icon icon="chevron-right" className="icon arrow" />
					</div>
				)
			}
			return (
				<Tab id={index+1} title={tabtitle()} panel={panel()} panelClassName="panel" />
			)
		});

		return (
			<Tabs className="community-block" defaultSelectedTabId={communityTabId} vertical large onChange={handleCommunityTabChange}>
				{communityTabs()}
			</Tabs>
		)
	}

	const pubList = flattenedPubs.map((flat) => {
		const { title, pub, community, primaryCollection, byline, publishedDate } = flat;
		const { description, headerBackgroundImage } = pub;
		return (
			<div className="pub" key={pub.id}>
				<div className="slab">
					{headerBackgroundImage && (
						<div>
							<img className="image-bg" src={headerBackgroundImage} alt="" />
							<div className="color-overlay" />
						</div>
					)}
					{!headerBackgroundImage && <div className="color-bg" style={{backgroundColor: community.accentColorDark}} />}
					<div className="info">
						<div className="title-box">
							<Icon icon="pubDoc" className="icon pub-icon" />
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

				<div className="featurelist-box">
					<div className="container">
						<div className="title">features of pubpub</div>
						<div className="feature-grid">{featureGrid}</div>
					</div>
				</div>

				<div className="communities-box" style={{backgroundColor: featuredCommunityColor}}>
					<div className="container">
						<div className="title">featured communities</div>
						<div className="featured-space">
								{communitiesBlock()}
						</div>
						<div className="callout-repeat">
							<div className="text-blocks">
								<p>feeling inspired?</p>
								<p>create your own community now!</p>
							</div>
							<a href="/community/create" className="custom-callout-button-2">
								Start here...
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
