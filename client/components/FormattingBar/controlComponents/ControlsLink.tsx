import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
	Button,
	AnchorButton,
	InputGroup,
	Checkbox,
	Icon,
	MenuItem,
	Collapse,
} from '@blueprintjs/core';
import { useUpdateEffect } from 'react-use';

import { moveToEndOfSelection } from 'components/Editor';
import { usePubContext } from 'containers/Pub/pubHooks';
import { pubUrl } from 'utils/canonicalUrls';
import { usePageContext, usePendingChanges } from 'utils/hooks';
import { InboundEdge, OutboundEdge, Pub, PubEdge } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { useDashboardEdges } from 'client/containers/DashboardEdges/useDashboardEdges';
import { createCandidateEdge } from 'containers/DashboardEdges/NewEdgeEditor';
import { assert } from 'utils/assert';
import { relationTypeDefinitions } from 'utils/pubEdge';
import { MenuButton } from 'client/components/Menu';
import { PubEdgeListingCard } from 'components';

require('./controlsLink.scss');

type Props = {
	editorChangeObject: {
		activeLink?: any;
		view?: any;
	};
	onClose: (...args: any[]) => any;
};

const ControlsLink = (props: Props) => {
	const {
		editorChangeObject: { activeLink, view },
		onClose,
	} = props;

	const { communityData } = usePageContext();
	const { inPub, pubData } = usePubContext();

	const [href, setHref] = useState(activeLink.attrs.href);
	const [isCreatingEdge, setIsCreatingEdge] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [errorCreatingEdge, setErrorCreatingEdge] = useState<string>();
	const [pubEdge, setPubEdge] = useState<PubEdge | null>(null);
	const [isLoadingAttr, setIsLoadingAttr] = useState(false);
	const { pendingPromise } = usePendingChanges();

	const [debouncedHref] = useDebounce(href, 250);
	const inputRef = useRef();

	const { addCreatedOutboundEdge, removeOutboundEdge, updateOutboundEdge } = useDashboardEdges(
		pubData as Pub & { outboundEdges: OutboundEdge[]; inboundEdges: InboundEdge[] },
	);

	const setHashOrUrl = (value: string) => {
		if (inPub) {
			const basePubUrl = pubUrl(communityData, pubData);
			const hashMatches = value.match(`^${basePubUrl}(.*)?#(.*)$`);
			setHref(hashMatches ? `#${hashMatches[2]}` : value);
		}
		setHref(value);
	};

	useEffect(() => {
		if (activeLink.attrs.pubEdgeId) {
			pendingPromise(apiFetch.get(`/api/pubEdges/${activeLink.attrs.pubEdgeId}`))
				.then((res) => {
					setPubEdge(res);
				})
				.catch(() => {
					setPubEdge(null);
					activeLink.updateAttrs({ pubEdgeId: null });
				});
		}
	}, [activeLink, pendingPromise]);

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useUpdateEffect(() => activeLink.updateAttrs({ href: debouncedHref }), [debouncedHref]);

	useEffect(() => {
		// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
		if (inputRef.current && typeof inputRef.current.focus === 'function' && !href) {
			// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
			inputRef.current.focus();
		}
	}, [href]);

	const restoreSelection = useCallback(() => {
		view.focus();
		moveToEndOfSelection(view);
	}, [view]);

	const handleKeyPress = (evt) => {
		if (evt.key === 'Enter') {
			activeLink.updateAttrs({ href });
			onClose();
			setTimeout(restoreSelection, 0);
		}
	};

	const checkedOpenInNewTab = activeLink.attrs.target === '_blank';

	const handleLinkAttr = () => {
		setIsLoadingAttr(true);
		activeLink.updateAttrs({
			target: activeLink.attrs.target === '_blank' ? '_self' : '_blank',
		});
		setIsLoadingAttr(false);
	};

	const createConnection = (edge: PubEdge) => {
		setIsCreatingEdge(true);
		pendingPromise(
			apiFetch.post('/api/pubEdges', {
				...edge,
				pubId: pubData.id,
				// Don't send the whole Pub, just the ID
				targetPub: undefined,
			}),
		)
			.then((createdEdge: OutboundEdge) => {
				addCreatedOutboundEdge(createdEdge);

				activeLink.updateAttrs({ pubEdgeId: createdEdge.id });
				setPubEdge(createdEdge);
				setIsCreatingEdge(false);
			})
			.catch((err: Error) => {
				setIsCreatingEdge(false);
				setErrorCreatingEdge(err.message);
			});
	};

	const handleCreateEdge = () => {
		assert(pubEdge !== null);
		createConnection(pubEdge);
	};

	const handleConnection = () => {
		if (pubEdge) {
			removeOutboundEdge(pubEdge);
			setPubEdge(null);
			activeLink.updateAttrs({ pubEdgeId: null });
		} else {
			pendingPromise(
				apiFetch.get(`/api/pubEdgeProposal?object=${encodeURIComponent(href)}`),
			).then((res) => {
				setPubEdge(
					createCandidateEdge({
						targetPub: res.targetPub,
						targetPubId: res.targetPub.id,
					}),
				);
			});
		}
	};

	const handleDirection = () => {
		assert(pubEdge != null);
		if (activeLink.attrs.pubEdgeId) {
			updateOutboundEdge({
				...pubEdge,
				pubIsParent: !pubEdge.pubIsParent,
			});
		} else {
			setPubEdge({
				...pubEdge,
				pubIsParent: !pubEdge.pubIsParent,
			});
		}
	};

	const handleEdgeRelationTypeChange = (relationType: string) => {
		assert(pubEdge != null);
		if (activeLink.attrs.pubEdgeId) {
			updateOutboundEdge({
				...pubEdge,
				relationType,
			});
		} else {
			setPubEdge({
				...pubEdge,
				relationType,
			});
		}
	};

	const currentRelationName =
		pubEdge &&
		relationTypeDefinitions[pubEdge.relationType] &&
		relationTypeDefinitions[pubEdge.relationType].name;

	const renderRelationshipButton = () => (
		<MenuButton
			aria-label="Select relationship type"
			buttonProps={{
				rightIcon: 'chevron-down',
				// @ts-expect-error ts-migrate(2322) FIXME: Type '{ rightIcon: string; children: string; }' is... Remove this comment to see the full error message
				children: `Type: ${currentRelationName}`,
			}}
			className="buttons"
		>
			{Object.entries(relationTypeDefinitions).map(([relationType, definition]) => {
				const { name } = definition;
				assert(pubEdge != null);
				const selected = pubEdge.relationType === relationType;
				return (
					<MenuItem
						text={name}
						onClick={() => handleEdgeRelationTypeChange(relationType)}
						key={relationType}
						icon={selected ? 'tick' : 'blank'}
					/>
				);
			})}
		</MenuButton>
	);

	function ControlsLinkOptions() {
		return (
			<div className="connection">
				<Checkbox
					label="Open in new tab"
					checked={checkedOpenInNewTab}
					onChange={handleLinkAttr}
					disabled={isLoadingAttr}
				/>
				<Checkbox
					label={errorCreatingEdge || 'Create a pub connection for this url'}
					onChange={handleConnection}
					checked={!!pubEdge}
					disabled={isCreatingEdge}
				/>
				{pubEdge && (
					<>
						<div className="controls-col">
							<div className="control-row">
								<div>Type: {renderRelationshipButton()}</div>
								<div>
									Direction:{' '}
									<Button
										className="buttons"
										icon="swap-vertical"
										onClick={handleDirection}
									>
										Switch direction
									</Button>
								</div>
							</div>
							<div className="control-row">
								<div>
									<Button
										className="buttons"
										title="Save Connection"
										minimal
										icon="tick"
										onClick={handleCreateEdge}
									>
										Save Connection
									</Button>
								</div>
							</div>

							<div>
								<Icon icon="info-sign" /> Preview &nbsp;
							</div>
						</div>
						<div className="pub-edge">
							<PubEdgeListingCard
								inPubBody={true}
								isInboundEdge={false}
								pubEdge={pubEdge}
								pubEdgeDescriptionIsVisible={false}
							/>
						</div>
					</>
				)}
			</div>
		);
	}

	return (
		<div className="controls-link-component">
			<InputGroup
				placeholder="Enter a URL"
				value={href}
				onChange={(evt) => setHashOrUrl(evt.target.value)}
				onKeyPress={handleKeyPress}
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
				inputRef={inputRef}
			/>
			<div>
				<AnchorButton
					small
					minimal
					title="Options"
					icon="chevron-down"
					onClick={() => setIsOpen(!isOpen)}
				/>
				<Button
					small
					minimal
					title="Remove"
					icon="disable"
					onClick={activeLink.removeLink}
				/>
				<AnchorButton
					small
					minimal
					title="Visit URL"
					icon="share"
					href={href}
					target="_blank"
				/>
			</div>
			<Collapse isOpen={isOpen} keepChildrenMounted={true}>
				<ControlsLinkOptions />
			</Collapse>
		</div>
	);
};

export default ControlsLink;
