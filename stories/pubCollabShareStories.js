import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollabShare from 'components/PubCollabShare/PubCollabShare';
import AccentStyle from 'components/AccentStyle/AccentStyle';
import { accentDataDark } from './_data';

const handleDetailsSave = (details)=> {
	console.log(details);
};
const wrapperStyle = { margin: '1em' };

storiesOf('PubCollabShare', module)
.add('Default', () => (
	<div>
		<div className={'pt-card pt-elevation-2'} style={wrapperStyle}>
			<AccentStyle {...accentDataDark} />
			<PubCollabShare
				pubData={{
					id: '1d463b1a-95f9-4dcf-bedc-785f9b1e4728',
					editHash: '7tojd6d7',
					suggestHash: '9x33d2l9',
					slug: 'article-slug',
					contributors: [
						{
							id: '105dd033-446a-4abe-9243-d1289b944af6',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/antonyzotov/128.jpg',
							initials: 'KH',
							fullName: 'Keyon Haag',
							slug: 'keyon-haag8383',
							Contributor: {
								id: '9a50f2a8-e873-472f-876d-166ba68b5e5a',
								name: null,
								order: null,
								permissions: 'edit',
								isAuthor: true,
								userId: '105dd033-446a-4abe-9243-d1289b944af6',
								pubId: '1d463b1a-95f9-4dcf-bedc-785f9b1e4728'
							}
						},
						{
							id: 'fa83ebb9-ca46-4dab-8d98-ddc7591e1ca8',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/manigm/128.jpg',
							initials: 'AK',
							fullName: 'Alize Kozey',
							slug: 'alize-kozey8728',
							Contributor: {
								id: 'e0675e78-c00c-44de-b2bc-0989de2d451a',
								name: null,
								order: null,
								permissions: 'edit',
								isAuthor: true,
								userId: 'fa83ebb9-ca46-4dab-8d98-ddc7591e1ca8',
								pubId: '1d463b1a-95f9-4dcf-bedc-785f9b1e4728'
							}
						},
						{
							id: 'a86c75df-88ff-4587-85df-ebb4fdd0268e',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/oaktreemedia/128.jpg',
							initials: 'PS',
							fullName: 'Payton Stanton',
							slug: 'payton-stanton1847',
							Contributor: {
								id: '474853c6-e6e5-4575-a417-5f085a808f70',
								name: null,
								order: null,
								permissions: 'edit',
								isAuthor: false,
								userId: 'a86c75df-88ff-4587-85df-ebb4fdd0268e',
								pubId: '1d463b1a-95f9-4dcf-bedc-785f9b1e4728'
							}
						},
						{
							id: '2f6915fe-1f41-4428-ba64-937db6cca033',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/akmalfikri/128.jpg',
							initials: 'LF',
							fullName: 'Lavonne Franecki',
							slug: 'lavonne-franecki5766',
							Contributor: {
								id: 'f7c4a81c-7202-4550-8fef-46d080458c42',
								name: null,
								order: null,
								permissions: 'edit',
								isAuthor: true,
								userId: '2f6915fe-1f41-4428-ba64-937db6cca033',
								pubId: '1d463b1a-95f9-4dcf-bedc-785f9b1e4728'
							}
						},
						{
							id: '9620c6f6-eb06-4b68-a22d-cb572eedd693',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/edkf/128.jpg',
							initials: 'MW',
							fullName: 'Mozelle Walker',
							slug: 'mozelle-walker321',
							Contributor: {
								id: 'f802af73-4977-4940-9ab5-9fc1efb78261',
								name: null,
								order: null,
								permissions: 'edit',
								isAuthor: false,
								userId: '9620c6f6-eb06-4b68-a22d-cb572eedd693',
								pubId: '1d463b1a-95f9-4dcf-bedc-785f9b1e4728'
							}
						},
						{
							id: 'cdeb68a5-3410-4d47-bcf2-e2a9fe58c7f4',
							initials: 'K',
							fullName: 'Kamille McClure',
							Contributor: {
								isAuthor: true,
								permissions: 'none',
								order: null
							}
						},
						{
							id: 'fcea297d-915d-4c2b-98b0-ab3a7bc2c2db',
							initials: 'E',
							fullName: 'Elmer Collins',
							Contributor: {
								isAuthor: false,
								permissions: 'none',
								order: null
							}
						}
					],
				}}
				onSave={handleDetailsSave}
			/>
		</div>
	</div>
));
