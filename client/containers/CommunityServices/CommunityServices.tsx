import React, { useState } from 'react';
import { GridWrapper } from 'components';
import ServiceOption from './ServiceOption';

require('./communityServices.scss');

const CommunityServices = () => {
	const options = [
		{
			title: 'Content Production',
			options: ['None', 'Low Volume', 'Medium Volume', 'High Volume'],
			prices: ['$0', '$4,000 - $5,000', '$9,000 - $15,000', '$20,000+'],
			initOption: 2,
			description:
				'We ingest finalized, copyedited content into PubPub for you, assure its quality, implement necessary revisions, assign DOIs (if applicable), and implement any Pub design. Content on PubPub does not require typesetting and can be exported to many different file types, including PDF.',
		},
		{
			title: 'Embedded Managing Editor',
			options: ['Include', 'Do not Include'],
			prices: ['$5,000', '$0'],
			initOption: 0,
			description:
				'We assign one person from our team to work as your dedicated production point person. This work includes regular calls, communication with authors, and providing general publication strategy as well as insights. Teams who find this service most useful include those that publish on a regular basis, but do not have the internal bandwidth to manage these activities nor the budget to hire an additional full-time person to do so.',
		},
		{
			title: 'Community Structure and Design',
			options: ['Include', 'Do not Include'],
			prices: ['$2,000 - $3,000', '$0'],
			initOption: 0,
			description:
				'We work with you to understand your content and to structure your PubPub community in a way that helps you manage it and readers effectively navigate it—and understand your content.',
		},
		{
			title: 'Back File Import',
			options: ['Include', 'Do not Include'],
			prices: ['$1,000 - $5,000', '$0'],
			initOption: 0,
			description:
				'We help you migrate years of existing content into PubPub so that your journal can start its new phase on the platform without losing its history and archives. This activity often also makes past work more discoverable and navigable for readers.',
		},
		{
			title: 'Training',
			options: ['Include', 'Do not Include'],
			prices: ['$500', '$0'],
			initOption: 0,
			description:
				'We offer 2 recorded training sessions of up to 90 minutes on a one-off or ongoing (yearly) basis for your team.',
		},
		{
			title: 'Interactives',
			options: ['Include', 'Do not Include'],
			prices: ['$500/interactive', '$0'],
			initOption: 0,
			description:
				'We work with you or directly with your authors to develop media and/or interactive elements to enhance your Community. Our focus is always on more effectively communicating the message(s) of your content.',
		},
		{
			title: 'Branding',
			options: ['Include', 'Do not Include'],
			prices: ['$4,500 - $5,500', '$0'],
			initOption: 0,
			description:
				'Our design team will develop a brand and design scheme for your Community. Groups that find this most useful are those who are starting a new publication, such as a journal, and need a brand to inform the design and appearance of their PubPub Community and other possible journal elements, such as a newsletter.',
		},
		{
			title: 'Membership',
			options: ['None', 'Supporter', 'Contributor', 'Network'],
			prices: ['$0', '$60', '$1,150 - $12,500', '$25,000+'],
			initOption: 2,
			description:
				'PubPub is built and maintained by a nonprofit organization dedicated to building public knowledge infrastructure. We are supported by members. Membership allows individuals and organizations of all sizes to support open infrastructure; receive additional support on our products; meet and share ideas with other innovative knowledge communities; and join a community passionate about the future of knowledge infrastructure and its development.',
		},
	];
	const [formDetails, setFormDetails] = useState(
		options.reduce((prev, curr) => {
			return { ...prev, [curr.title]: curr.options[curr.initOption] };
		}, {}),
	);
	const setVal = (newVal) => {
		setFormDetails({ ...formDetails, ...newVal });
	};
	console.log(formDetails);
	return (
		<div id="community-services-container">
			<GridWrapper containerClassName="narrow">
				<h1>Community Services</h1>
				<p className="description top">
					PubPub is free to use. For groups that want personalized support we offer
					production, training, and strategy services for building high quality, effective
					publishing communities.
				</p>
				<div className="option-form">
					<div className="title">To get started, tell us about your project</div>
					<p className="description">
						We will work with you to identify exactly what your community needs. Below
						is our services menu along with estimated costs. As a starting point for our
						conversation, please select the options you're considering and submit the
						form. We'll then be in touch to schedule a call.
					</p>
					{options.map((option) => {
						return <ServiceOption {...option} key={option.title}  setVal={setVal} />;
					})}

					<div className="title">Additional Details</div>
					<textarea></textarea>
					<div className="title">Email</div>
				</div>
				<p>
					For publishing services such as peer-review, copyediting, and research support,
					we partner with MITops. The full list of services offered by MITops are
					available on their site. Please contact them directly to inquire about their
					offering.
				</p>
				<h2>See what we can do together!</h2>
				<p>Browse some of our previous and ongoing Community Services projects.</p>
			</GridWrapper>
		</div>
	);
};

export default CommunityServices;
