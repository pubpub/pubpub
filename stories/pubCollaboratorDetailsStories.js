import React from 'react';
import { storiesOf } from '@storybook/react';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';

const handleSelection = (val)=> {
	console.log(val);
};
const wrapperStyle = { margin: '1em 1em 5em' };

const userData1 = {
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
};
const userData2 = {
	id: 'fcea297d-915d-4c2b-98b0-ab3a7bc2c2db',
	initials: 'E',
	fullName: 'Elmer Collins',
	Contributor: {
		isAuthor: false,
		permissions: 'none',
		order: null
	}
};

storiesOf('PubCollaboratorDetails', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<PubCollaboratorDetails
				collaboratorData={userData1}
				canAdmin={true}
			/>
			<PubCollaboratorDetails
				collaboratorData={userData2}
				canAdmin={true}
			/>
			<PubCollaboratorDetails
				collaboratorData={userData1}
				canAdmin={true}
			/>
		</div>

		<div style={wrapperStyle}>
			<PubCollaboratorDetails
				collaboratorData={userData1}
				canAdmin={true}
				isPermissionsMode={true}
			/>
			<PubCollaboratorDetails
				collaboratorData={userData2}
				canAdmin={true}
				isPermissionsMode={true}
			/>
			<PubCollaboratorDetails
				collaboratorData={userData1}
				canAdmin={true}
				isPermissionsMode={true}
			/>
		</div>
	</div>
));
