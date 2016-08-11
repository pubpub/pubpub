import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
<<<<<<< Updated upstream
import {PreviewCard} from 'components';
=======
>>>>>>> Stashed changes

import {styles} from './aboutStyles';

export const AboutJournals = React.createClass({

	render: function() {
		const metaData = {
			title: 'Journals · PubPub',
		};

<<<<<<< Updated upstream
		const featuredContent = [
			{
				slug: 'jods',
				journalName: 'Journal of Design and Science',
				icon: 'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/jodsIcon.png',
				description: ''
			},
			{
				slug: 'resci',
				journalName: 'Responsive Science',
				icon: 'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/resciIcon.png',
				description: ''
			},
			{
				slug: 'constitucioncdmx',
				journalName: 'Constitucion CDMX',
				icon: 'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/cdmxIcon.png',
				description: ''
			},
			{
				slug: 'tjoe',
				journalName: 'The Journal of Open Engineering',
				icon: 'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/tjoeIcon.png',
				description: ''
			},
		];

=======
>>>>>>> Stashed changes
		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

<<<<<<< Updated upstream
				<div className={'lightest-bg'}>
					<div className={'section'}>

						<h1>Journals</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>Tools for curation and community organization.</p>
						<Link style={globalStyles.link} to={'/journals/create'}><div className={'button'} style={styles.headerButton}>Create Journal</div></Link>
=======
				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={styles.section}>

						<h1 style={[styles.headerTitle, styles.headerTextMax]}>Journals</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.</p>
						<Link style={globalStyles.link} to={'/signup'}><div className={'button'} style={styles.headerButton}>Create Journal</div></Link>
>>>>>>> Stashed changes

					</div>
				</div>

<<<<<<< Updated upstream
				<div>
					<div className={'section'}>
						<div style={[styles.forWhoBlock]} id={'authors'}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h2 style={styles.noMargin}>Your Community</h2>
								<p>Journals can be created by anyone for any topic. Some journals aggregate work for a particular interest, while others provide a more rigorous peer-review signal.</p>
								<p>Pubs are created and owned by the author, but can be featured in as many journals as relevant. Journals act not to silo work, but to reveal the broader scope of relevance of research.</p>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451417712/outputjournal_qcdqyh.gif'} alt={'PubPub Journals'}/>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>Created on PubPub, Used wherever</h2>
						<p>The creation and management of journals occurs through PubPub, but the data (journal details, featured pubs, etc) can be exported using our API to build completely custom journal website.</p>
						<p>PubPub can either be the first destination for your readers or, alternatively, the infrastructure that enables your document creation, submission, and review process.</p>
						<p>All pub content, metadata and rendering capabilities are available through the PubPub API or embeds.</p>
						<a style={globalStyles.link}><div className={'button'} style={styles.headerButton}>API documentation <div style={{fontSize: '0.75em'}}>(coming very soon)</div></div></a>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Featured Journals</h2>

						{featuredContent.map((item, index)=>{
							return (
								<div style={{}}>
									<PreviewCard 
										type={'journal'}
										image={item.icon}
										title={item.journalName}
										slug={item.slug}
										description={item.description} />
								</div>
							);
						})}

=======
				<div style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Made with PubPub</h2>
						
>>>>>>> Stashed changes
					</div>
				</div>
				
			</div>
		);
	}

});


export default Radium(AboutJournals);
