import React from 'react';
import { Classes } from '@blueprintjs/core';

import { Icon } from 'components';

require('./landing.scss');

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

const communities = [
	{
		name: 'Harvard Data Science Review',
		description: 'A microscopic, telescopic & kaleidoscopic view of data science.',
		logo: '/static/landing/hdsr.png',
		type: 'Journals',
		category: 'Science',
		link: 'https://hdsr.mitpress.mit.edu',
	},
	{
		name: 'Frankenbook',
		description:
			'A collaborative, multimedia reading experiment with Mary Shelley’s classic novel.',
		logo: '/static/landing/frankenbook.png',
		type: 'Books',
		category: 'Literature',
		link: 'https://frankenbook.org',
	},
	{
		name: 'Collective Wisdom',
		description: "The British Library's early access and community review site.",
		logo: '/static/landing/collective.png',
		type: 'Resources',
		category: 'Reports',
		link: 'https://britishlibrary.pubpub.org/',
	},
	{
		name: 'SERC Ethical Computing',
		description: 'A series on the social and ethical responsibilities of computing.',
		logo: '/static/landing/serc.png',
		type: 'Resources',
		category: 'Case studies',
		link: 'https://mit-serc.pubpub.org',
	},
	{
		name: 'Contours Collaborations',
		description: 'A series on the social and ethical responsibilities of computing.',
		logo: '/static/landing/contours.png',
		type: 'Exhibits',
		category: 'Arts',
		link: 'https://contours.pubpub.org',
	},
	{
		name: 'Fermentology',
		description: 'On the culture, history, and novelty of fermented things.',
		logo: '/static/landing/fermentology.png',
		type: 'Learning Series',
		category: 'Multimedia',
		link: 'https://fermentology.pubpub.org/',
	},
	{
		name: 'Grad Journal of Food Studies',
		description:
			'An international student-run and refereed platform dedicated to encouraging and promoting interdisciplinary food scholarship at the graduate level',
		logo: '/static/landing/gafs.png',
		type: 'Student Journals',
		category: 'Interdisciplinary',
		link: 'https://gradfoodstudies.pubpub.org/',
	},
	{
		name: 'Critical Distance',
		description: 'A pandemic and games essay jam.',
		logo: '/static/landing/pgej.png',
		type: 'Conferences',
		category: 'Sprint',
		link: 'https://pandemics-and-games-essay-jam.pubpub.org/',
	},
	{
		name: 'MIT Press Open Architecture',
		description: 'An open collection of out-of-print humanities books.',
		logo: '/static/landing/arch.png',
		type: 'Collections',
		category: 'Open humanities',
		link: 'https://mitp-arch.mitpress.mit.edu/',
	},
];

const Landing = () => {
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

	const communityGrid = communities.map((community) => {
		return (
			<div className="community" key={community.name}>
				<div className="type">
					<strong>{community.type}</strong> / {community.category}
				</div>
				<h4 className="name">
					<a href={community.link}>{community.name}</a>
				</h4>
				<a href={community.link}>
					<img className="logo" src={community.logo} alt={`Logo of ${community.name}`} />
				</a>
				<p className="description">{community.description}</p>
			</div>
		);
	});
	return (
		<div id="landing-container">
			<style>{`
				.header-component.${Classes.DARK} a.${Classes.BUTTON},
				.header-component.${Classes.DARK} a.${Classes.BUTTON}:hover {
					color: #111;
				}
			`}</style>
			{/* BEGIN Jumbotron */}
			<div id="jumbotron">
				{/* BEGIN Jumbotron Content */}
				<div className="container">
					<div className="row content">
						<div className="col-4">
							<h1>PubPub Legacy</h1>
							<p className="subtitle">
								PubPub is evolving. Read our announcement to learn about the new
								PubPub Platform for creating full-stack knowledge infrastructure and
								our plans for helping PubPub Legacy users transition by May 2025.
							</p>
							<div className="buttons">
								<a
									href="https://knowledgefutures.org"
									className="custom-button black"
								>
									Learn More
								</a>
							</div>
							<div className="buttons">
								<a
									href="https://knowledgefutures.org/contact/"
									className="custom-button"
								>
									Get In Touch
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* END Jumbotron */}
			{/* END Main content */}
		</div>
	);
};

export default Landing;
