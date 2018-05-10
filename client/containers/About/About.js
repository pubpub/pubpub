import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./about.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Terms = function(props) {
	return (
		<div id="about-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
				hideNav={props.locationData.isBasePubPub}
			>
				<div className="container narrow">
					<div className="row">
						<div className="col-12">
							<h1>About PubPub</h1>
							<h2>An Open Source Publishing Platform from the MIT Media Lab and the MIT Press</h2>
							<p>The Internet has vastly accelerated the rate at which research can be conducted and shared. It has opened new paths for bringing researchers together across disciplines, permitting synthesis and conversations not previously possible. But these breakthroughs have also brought a host of new challenges for traditional publishing. How can publishers promote the increasingly open and collaborative nature of research? How can they help to make published works accessible worldwide in a way that stimulates important cross-disciplinary, real-time discussion?</p>
							<p>PubPub, an open-authoring and publishing platform, responds to many of these challenges. Created by MIT Media Lab graduate students Travis Rich and Thariq Shihipar in 2015, PubPub is the primary open access, online publishing platform for the MIT Press. Optimized for public discussion around digital academic journals and books, PubPub socializes the process of knowledge creation. This allows for real-time collaborative editing, versioning, instant publishing, continuous review, annotation, discussion, and grassroots journalism. It is collaborative, dynamic, and open access, using an intuitive graphical format that allows both authors and readers to embed illustrations, PDFs, videos, LaTeX math, code, and citations. A key feature of PubPub is the ability for an entire team to conduct reviews—privately or publicly—either before or after publication. Given PubPub’s flexibility, it is a platform not only suited for more open academic publishing, but also for publications that range from government legislation to classroom projects.</p>
							<p>All PubPub code is open source and available to anyone. PubPub is written as a full-stack javascript website. It uses React for server-rendering and client-side interactions. The server is cloud hosted on AWS, as is the open source database which stores all PubPub content. Additionally, there are a number of separate services built for PubPub, such as an asset-hosting and a content-delivery network process, an image resizing service, and an automated backup solution. This architecture allows for additional services (e.g., a PDF rendering service or an EPUB importing service) to be created, updated, or interchanged as needed.</p>
							<p><a href="https://www.frankenbook.org">Frankenbook</a>, an interactive edition of Frankenstein: Annotated for Scientists, Engineers, and Creators of All Kinds (MIT Press, 2017) is one of the first books available through PubPub. Community contributions  live in conversation with annotations from experts, multimedia elements, and a series of essays; classrooms and reading groups are encouraged to create their own private discussion spaces.</p>
							<p>To date, the most active publication to utilize PubPub is the <a href="https://jods.mitpress.mit.edu">Journal of Design and Science</a> (JoDS), a joint effort of the MIT Media Lab and the MIT Press. JoDS seeks to publish provocative articles at the intersection of design and science, forging new connections that help to break down long-standing barriers between traditional academic disciplines. PubPub will continue to expand upon this concept, providing a new model for open access publishing that encourages cross-fertilization by catalyzing diverse conversations across disciplines and cultures.</p>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Terms.propTypes = propTypes;
export default Terms;

hydrateWrapper(Terms);
