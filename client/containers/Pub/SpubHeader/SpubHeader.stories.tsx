import React from 'react';
import { storiesOf } from '@storybook/react';

import { SubmissionWorkflow, Submission, DefinitelyHas, PubPageData } from 'types';
import { getEmptyDoc } from 'client/components/Editor';
import { initialHistoryData } from 'client/components/PubHistoryViewer/PubHistoryViewer.stories';

import SpubHeader from './SpubHeader';
import './SpubHeader.stories.scss';

const workflow: SubmissionWorkflow = {
	id: '12089e31h3f23bf-f23f23f23f2-f23f32bu234v23-f2323f',
	createdAt: '',
	updatedAt: '',
	enabled: true,
	title: 'A Submission Work-work-work-work-work-work-flow',
	collectionId: '',
	targetEmailAddress: '',
	acceptedText: getEmptyDoc(),
	declinedText: getEmptyDoc(),
	emailText: getEmptyDoc(),
	introText: getEmptyDoc(),
	instructionsText: {
		type: 'doc',
		attrs: {
			meta: {},
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'You gotta do a little dance to get into a pocket dimension. You know, like in Fringe. First go to the building from the tape, go to apartment 413, itsdangerous though. careful footing. In the middle of the room walk three steps forwad, step to the left. step to the right, walk backwards three steps, step	left, turn left 270 degrees. step forward',
					},
				],
			},
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'If you have any questions, you can email the community admin at hello@institution.com, and could even contain a story about civiizations that have come and gone in the time it takes for a species to evolve past its own technological limtations. Do we really know what exists around us? There are phenomena that exists outside the visible spectrum which we may have no clear perception of.',
					},
				],
			},
		],
	},
};

const submission: Submission = {
	id: '12089e31h3f23bf-f23f23f23f2-f23f32bu234v23-f2323g',
	pubId: '1',
	status: 'incomplete',
	submittedAt: 'noon',
	abstract: {
		type: 'doc',
		attrs: {
			meta: {},
		},
		content: [
			{
				type: 'paragraph',
				content: [
					{
						type: 'text',
						text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate sapien nec. Nulla porttitor massa id neque aliquam vestibulum morbi blandit. Sed adipiscing diam donec adipiscing tristique. Aliquet eget sit amet tellus cras adipiscing enim. Urna condimentum mattis pellentesque id. Sed arcu non odio euismod lacinia at. Velit egestas dui id ornare. Enim diam vulputate ut pharetra sit amet aliquam id diam. Amet consectetur adipiscing elit pellentesque habitant morbi tristique senectus. Placerat duis ultricies lacus sed turpis tincidunt. Netus et malesuada fames ac turpis egestas sed tempus. Sit amet commodo nulla facilisi nullam vehicula ipsum a arcu. Nam at lectus urna duis convallis convallis tellus. Id aliquet risus feugiat in ante metus. Duis tristique sollicitudin nibh sit amet. Sed adipiscing diam donec adipiscing tristique risus. Fringilla est ullamcorper eget nulla facilisi. Mi eget mauris pharetra et. Vel orci porta non pulvinar neque laoreet suspendisse interdum consectetur. Commodo ullamcorper a lacus vestibulum sed arcu non odio euismod. Posuere sollicitudin aliquam ultrices sagittis orci a. Enim nulla aliquet porttitor lacus luctus accumsan. Nibh venenatis cras sed felis eget. Tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Arcu non odio euismod lacinia at quis risus sed vulputate. Habitant morbi tristique senectus et netus et malesuada. A cras semper auctor neque vitae.',
					},
				],
			},
		],
	},
	submissionWorkflowId: '12089e31h3f23bf-f23f23f23f2-f23f32bu234v23-f2323f',
	submissionWorkflow: workflow,
};

const pubData: DefinitelyHas<PubPageData, 'submission'> = {
	submission,
};

storiesOf('containers/Pub/SpubHeader', module).add('default', () => (
	<SpubHeader
		pubData={pubData as DefinitelyHas<PubPageData, 'submission'>}
		historyData={initialHistoryData}
		updateLocalData={() => {}}
	/>
));
