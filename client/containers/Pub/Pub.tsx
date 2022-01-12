import React, { useEffect } from 'react';

import { usePageContext } from 'utils/hooks';
import { SubmissionWorkflow } from 'types';

import PubSyncManager from './PubSyncManager';
import PubHeader from './PubHeader';
import SubmissionPubHeader from './SubmissionPubHeader';
import PubDocument from './PubDocument';
import { PubSuspendWhileTypingProvider, PubSuspendWhileTyping } from './PubSuspendWhileTyping';

require('./pub.scss');

const workflow: SubmissionWorkflow = {
	id: '12089e31h3f23bf-f23f23f23f2-f23f32bu234v23-f2323f',
	createdAt: '',
	updatedAt: '',
	enabled: true,
	title: 'A Submission Work-work-work-work-work-work-flow',
	collectionId: '',
	targetEmailAddress: '',
	emailText: {
		type: 'doc',
		attrs: {
			meta: {},
		},
		content: [],
	},
	introText: {
		type: 'doc',
		attrs: {
			meta: {},
		},
		content: [],
	},
	instructionsText: {
		type: 'doc',
		attrs: {
			meta: {},
		},
		content: [
			{
				type: 'heading',
				attrs: {
					level: 1,
				},
				content: [
					{
						type: 'text',
						text: 'Cartographie 2022: Call for Proposals',
					},
				],
			},
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

type Props = {
	pubData: any;
};

const isInViewport = (rect: DOMRect, offsets: { top?: number; left?: number } = {}) => {
	const { top, left, bottom, right } = rect;
	const { innerWidth, innerHeight } = window;
	const { clientWidth, clientHeight } = document.documentElement;
	const { top: offsetTop, left: offsetLeft } = { top: 0, left: 0, ...offsets };

	return (
		top >= offsetTop &&
		left >= offsetLeft &&
		bottom <= (innerHeight || clientHeight) &&
		right <= (innerWidth || clientWidth)
	);
};

const scrollToElementTop = (hash: string, delay = 0) => {
	let element: HTMLElement | null;

	try {
		element = document.getElementById(hash.replace('#', ''));
	} catch {
		return;
	}

	if (!element) {
		return;
	}

	setTimeout(() => {
		const rect = (element as HTMLElement).getBoundingClientRect();

		if (!isInViewport(rect, { top: 50 })) {
			document.body.scrollTop += rect.top - 80;
		}
	}, delay);
};

const Pub = (props: Props) => {
	const { loginData, locationData, communityData } = usePageContext();
	const hasSubmission =
		'submission' in props.pubData && props.pubData.submission?.status === 'incomplete';

	console.log(props.pubData, { hasSubmission });

	useEffect(() => {
		const { hash } = window.location;

		if (hash) {
			scrollToElementTop(hash, 500);
		}

		const onClick = (event: MouseEvent) => {
			const { target, metaKey } = event;

			if (target instanceof HTMLAnchorElement && !metaKey) {
				const href = target.getAttribute('href');

				if (href && href.indexOf('#') === 0) {
					event.preventDefault();
					window.location.hash = href;
					scrollToElementTop(href);
				}
			}
		};

		if (props.pubData.isReadOnly) {
			document.addEventListener('click', onClick);
			return () => document.removeEventListener('click', onClick);
		}

		return () => {};
	}, [props.pubData]);

	return (
		<PubSuspendWhileTypingProvider>
			<div id="pub-container">
				<PubSyncManager
					pubData={props.pubData}
					locationData={locationData}
					communityData={communityData}
					loginData={loginData}
				>
					{({ pubData, collabData, firebaseDraftRef, updateLocalData, historyData }) => {
						const modeProps = {
							pubData,
							collabData,
							historyData,
							firebaseDraftRef,
							updateLocalData,
						};
						return hasSubmission ? (
							<React.Fragment>
								<PubSuspendWhileTyping delay={1000}>
									{() => <SubmissionPubHeader workflow={workflow} />}
								</PubSuspendWhileTyping>
								<PubDocument {...modeProps} />
							</React.Fragment>
						) : (
							<React.Fragment>
								<PubSuspendWhileTyping delay={1000}>
									{() => <PubHeader {...modeProps} />}
								</PubSuspendWhileTyping>

								<PubDocument {...modeProps} />
							</React.Fragment>
						);
					}}
				</PubSyncManager>
			</div>
		</PubSuspendWhileTypingProvider>
	);
};
export default Pub;
