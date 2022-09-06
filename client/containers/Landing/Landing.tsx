import React from 'react';
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
	}
] as const;

const pubs = [
	{
		title: 'Nonverbal Overload: A Theoretical Argument for the Causes of Zoom Fatigue',
		date: 'Feb 24, 2021',
		authors: 'Jeremy N. Bailenson',
		image: '/static/landing/_landing_pub1.png',
		url: 'https://doi.org/10.1037/tmb0000030',
		desc: '',
		doi: 'https://doi.org/10.1037/tmb0000030',
		collection: 'Volume 2, Issue 1',
		community: 'Technology, Mind & Behaviour'
	},
	{
		title: 'Tasting the History of Wine',
		date: 'Dec 03, 2021',
		authors: 'Charles Ludington and Ann-Sophie Barwich',
		image: '/static/landing/_landing_pub2.png',
		url: 'https://doi.org/10.52750/673571',
		desc: 'A long description about wines from all over the world, to test the rendering of such a very long sentence which is not the best way to write sentences.',
		doi: 'https://doi.org/10.1037/tmb0000030',
		collection: '',
		community: 'Fermentology'
	},
	{
		title: 'Science for the Post-Normal Age',
		date: 'May 14, 2020',
		authors: 'Silvio O. Funtowicz and Jerome R. Ravetz ',
		image: '/static/landing/_landing_pub3.png',
		url: 'https://doi.org/10.52750/673571',
		desc: 'Republished with a new foreword',
		doi: 'https://doi.org/10.1037/tmb0000030',
		collection: 'Duly Noted',
		community: 'Common Place'
	},
	{
		title: 'Yeezy Taught Me',
		date: 'Nov 09, 2021',
		authors: 'Arthur Boston',
		image: '/static/landing/_landing_pub4.png',
		url: 'https://doi.org/10.52750/673571',
		desc: '',
		doi: 'https://doi.org/10.1037/tmb0000030',
		collection: 'Dialogues',
		community: 'Common Place'
	},
	{
		title: 'A Seat at the Table: Special Considerations for Women and Underrepresented Groups in Academic Entrepreneurship',
		date: 'Feb 25, 2022',
		authors: 'Linda Fleisher and Alexandra Marquez',
		image: '/static/landing/_landing_pub1.png',
		url: 'https://doi.org/10.21428/b2e239dc.618b909b',
		desc: '',
		doi: 'https://doi.org/10.21428/b2e239dc.618b909b',
		collection: 'Academic Entrepreneurship for Medical & Health Sciences',
		community: 'Academic Entrepreneurship'
	},
	{
		title: 'Women of the Beat Generation',
		date: 'Dec 14, 2021',
		authors: 'Mary Paniccia Carden and Robert F. Barsky',
		image: '/static/landing/_landing_pub2.png',
		url: 'https://bandy-collection.pubpub.org/pub/o9gbzhf1/release/1',
		desc: '',
		doi: '',
		collection: 'Collection Conversations',
		community: 'W.T. Bandy Center for Baudelaire and Modern French Studies'
	},
	{
		title: 'Differential Privacy and the 2020 US Census',
		date: 'Jan 24, 2022',
		authors: 'Simson Garfinkle',
		image: '/static/landing/_landing_pub7.png',
		url: 'https://doi.org/10.21428/2c646de5.7ec6ab93',
		desc: '',
		doi: 'https://doi.org/10.21428/2c646de5.7ec6ab93',
		collection: 'Winter 2022',
		community: 'MIT Case Studies in Social and Ethical Responsibilities of Computing'
	},
	{
		title: 'Quare(-in) the Mainstream: Deconstructing New Media in Lil Nas X’s MONTERO',
		date: 'Jul 12, 2022',
		authors: 'Emily Thomas',
		image: '/static/landing/_landing_pub8.png',
		url: 'https://doi.org/10.21428/66f840a4.75cc622c',
		desc: '',
		doi: 'https://doi.org/10.21428/66f840a4.75cc622c',
		collection: 'New Queer Cinema',
		community: 'Sonic Scope'
	}
];

const communities = [
	{
		name: 'Harvard Data Science Review',
		description: 'A microscopic, telescopic & kaleidoscopic view of data science.',
		logo: '/static/landing/hdsr.png',
		type: 'Journals',
		category: 'Science',
		link: 'https://hdsr.mitpress.mit.edu',
	}
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

	const pubList = pubs.map((pub) => {
		return (
			<div className="pub" key={pub.url}>
				<div className="slab">
					<img className="image-bg" src={pub.image}/>
					<div className="color-overlay"></div>
					<div className="info">
						<div className="title-box">
							<Icon icon="pubDoc" className="icon"/>
							<div className="pub-title">{pub.title}</div>
						</div>
						<div className="desc">{pub.desc}</div>
						<div className="authors">{'by ' + pub.authors}</div>
						<div className="date-box">
							<Icon icon="globe" className="icon"/>
							<div className="date">{pub.date}</div>
						</div>
					</div>
				</div>
				<div className="meta">
					<div className="item">
						<div className="icon-title">
							<Icon icon="collection" className="icon"/>
							<div className="meta-title">collection</div>
						</div>
						<div className="name">{pub.collection}</div>
						<a className="more" href="">See more from this collection</a>
					</div>
					<div className="item">
						<div className="icon-title">
							<Icon icon="office" className="icon"/>
							<div className="meta-title">community</div>
						</div>
						<div className="name">{pub.community}</div>
						<a className="more" href="">Visit community homepage</a>
					</div>
				</div>
			</div>
		)
	})

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
					<div className="subtitle-1">publishing platform <span className="smaller">for</span></div>
					<div className="video-text-container">
						<video className="bg-video" autoPlay loop muted>
							<source src="/static/landing/test-vid-1.mp4" type="video/mp4"/>
						</video>
						<p className="subtitle-2">knowledge communities</p>
					</div>
					<a href="/community/create" className="custom-callout-button-1">
						Create your community
					</a>
				</div>
				<div className="title-popovers">
					<div className="popover" >
						<img
							src="/static/landing/_landing_popover1.png"
						/>
					</div>
					<div className="popover" >
						<img
							src="/static/landing/_landing_popover2.png"
						/>
						<img
							src="/static/landing/_landing_popover3.png"
						/>
						<img
							src="/static/landing/_landing_popover4.png"
						/>
					</div>
				</div>
			</div>
			{/* END Jumbotron */}
			{/* BEGIN Main; content */}
			<div id="main">

				<div className="icon-border">
				</div>
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
							<p>As a product of the Knowledge Futures Group, PubPub is open and accessible to all. That means a free, robust version of PubPub will always be available, operating under a non-profit, sustainable business model.</p>
						</div>
						<div className="box-item">
							<div className="title">open & community led</div>
							<div className="buttons">
								<a href="" className="button">
									<Icon icon="git-repo" className="icon"/>
									<p>Github</p>
								</a>
								<a href="" className="button">
									<Icon icon="map" className="icon"/>
									<p>Roadmap</p>
								</a>
								<a href="" className="button">
									<Icon icon="comment" className="icon"/>
									<p>Forum</p>
								</a>
								<a href="" className="button">
									<Icon icon="office" className="icon"/>
									<p>KFG community</p>
								</a>
							</div>
						</div>
					</div>
				</div>

				<div className="publist-box">
					<div className="container">
						<div className="title">featured pubs</div>
						<div className="row pub-list">
							{pubList}
						</div>
					</div>
				</div>

				<div className="communities-box">
					<div className="container">
						<div className="title">featured communities</div>
						<div className="featured-space">
						</div>
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
