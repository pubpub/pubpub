import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Button, AnchorButton, InputGroup, Checkbox, Icon, MenuItem } from '@blueprintjs/core';

import { moveToEndOfSelection } from 'components/Editor';
import { usePubContext } from 'containers/Pub/pubHooks';
import { pubUrl } from 'utils/canonicalUrls';
import { usePageContext, usePendingChanges } from 'utils/hooks';
import { InboundEdge, OutboundEdge, Pub, PubEdge } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { useDashboardEdges } from 'client/containers/DashboardEdges/useDashboardEdges';
import { createCandidateEdge } from 'containers/DashboardEdges/NewEdgeEditor';
import { assert } from 'utils/assert';
import { MenuButton } from 'client/components/Menu';
import { relationTypeDefinitions } from 'utils/pubEdge';

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
	const [target, setTarget] = useState(activeLink.attrs.target);
	const [isCreatingEdge, setIsCreatingEdge] = useState(false);
	const [errorCreatingEdge, setErrorCreatingEdge] = useState<string>();
	const [pubEdge, setPubEdge] = useState<PubEdge | null>(null);

	const { pendingPromise } = usePendingChanges();

	const [debouncedHref] = useDebounce(href, 250);
	const inputRef = useRef();

	const { addCreatedOutboundEdge, removeOutboundEdge } = useDashboardEdges(
		pubData as Pub & { outboundEdges: OutboundEdge[]; inboundEdges: InboundEdge[] },
	);

	useEffect(() => {
		if (activeLink.attrs.pubEdgeId) {
			pendingPromise(apiFetch.get(`/api/pubEdges/${activeLink.attrs.pubEdgeId}`))
				.then((res) => {
					setPubEdge(res);
				})
				.catch(() => {
					setPubEdge(null);
				});
		}
	}, [activeLink.attrs.pubEdgeId, pendingPromise]);

	const setHashOrUrl = (value: string) => {
		if (inPub) {
			const basePubUrl = pubUrl(communityData, pubData);
			const hashMatches = value.match(`^${basePubUrl}(.*)?#(.*)$`);
			setHref(hashMatches ? `#${hashMatches[2]}` : value);
		}
		setHref(value);
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => activeLink.updateAttrs({ href: debouncedHref }), [debouncedHref]);

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
		setTarget(activeLink.attrs.target === '_blank' ? '_self' : '_blank');
		activeLink.updateAttrs({ target });
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
				setPubEdge(createdEdge);
				activeLink.updateAttrs({ pubEdgeId: createdEdge.id });
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
				console.log(res);
				setPubEdge(
					createCandidateEdge({
						targetPub: res.targetPub,
						targetPubId: res.targetPub.id,
					}),
				);
			});
		}
	};

	// const renderNewEdgeControls = () => {
	// 	assert(pubEdge !== null);
	// 	const { externalPublication, targetPub } = pubEdge;
	// 	const canCreateEdge = targetPub || (externalPublication && externalPublication.title);
	// 	return (
	// 		<div className="new-edge-controls">
	// 			<div className="controls-row">
	// 				<MenuButton
	// 					aria-label="Select relationship type"
	// 					buttonProps={{
	// 						rightIcon: 'chevron-down',
	// 						// @ts-expect-error ts-migrate(2322) FIXME: Type '{ rightIcon: string; children: string; }' is... Remove this comment to see the full error message
	// 						children: `Type: ${currentRelationName}`,
	// 					}}
	// 				>
	// 					{Object.entries(relationTypeDefinitions).map(
	// 						([relationType, definition]) => {
	// 							const { name } = definition;
	// 							const selected = pubEdge.relationType === relationType;
	// 							return (
	// 								<MenuItem
	// 									text={name}
	// 									onClick={() => handleEdgeRelationTypeChange(relationType)}
	// 									key={relationType}
	// 									icon={selected ? 'tick' : 'blank'}
	// 								/>
	// 							);
	// 						},
	// 					)}
	// 				</MenuButton>
	// 				<Button icon="swap-vertical" onClick={handleEdgeDirectionSwitch}>
	// 					Switch direction
	// 				</Button>
	// 			</div>
	// 			<PubEdgeListingCard
	// 				isInboundEdge={false}
	// 				pubEdge={pubEdge}
	// 				pubEdgeDescriptionIsVisible={pubEdgeDescriptionIsVisible}
	// 				pubEdgeElement={
	// 					externalPublication && (
	// 						<PubEdgeEditor
	// 							pubEdgeDescriptionIsVisible={pubEdgeDescriptionIsVisible}
	// 							externalPublication={externalPublication}
	// 							onUpdateExternalPublication={(update) =>
	// 								onChange({
	// 									...pubEdge,
	// 									externalPublication: { ...externalPublication, ...update },
	// 								})
	// 							}
	// 						/>
	// 					)
	// 				}
	// 			/>
	// 			{error && (
	// 				<Callout intent="warning" className="error-callout">
	// 					There was an error creating this Pub connection.
	// 				</Callout>
	// 			)}
	// 			<div className="controls-row">
	// 				<Button className="cancel-button" onClick={onCancel}>
	// 					Cancel
	// 				</Button>
	// 				<Button
	// 					intent="primary"
	// 					onClick={handleCreateEdge}
	// 					loading={loading}
	// 					disabled={!canCreateEdge}
	// 				>
	// 					{saveButtonLabel ?? 'Add connection'}
	// 				</Button>
	// 			</div>
	// 		</div>
	// 	);
	// };

	function ControlsLinkPopover() {
		return (
			<div>
				<Checkbox
					label="Open in new tab"
					checked={checkedOpenInNewTab}
					onChange={handleLinkAttr}
				/>
				<Checkbox
					label={errorCreatingEdge || 'Create a pub connection for this url'}
					onChange={handleConnection}
					checked={!!pubEdge}
					disabled={isCreatingEdge}
				/>
				{pubEdge && (
					<>
						<MenuButton
							aria-label="Type: connection type dropdown"
							buttonProps={{
								rightIcon: 'chevron-down',
							}}
						>
							{Object.entries(relationTypeDefinitions).map(
								([relationType, definition]) => {
									const { name } = definition;
									const selected = pubEdge.relationType === relationType;
									return (
										<MenuItem
											text={name}
											onClick={() => {
												console.log('relationship change');
											}}
											key={relationType}
											icon={selected ? 'tick' : 'blank'}
										/>
									);
								},
							)}
						</MenuButton>
						<Button
							icon="swap-vertical"
							onClick={() => console.log('direction change')}
						>
							Direction: direction dropdown
						</Button>
					</>
				)}{' '}
				<div>Type: connection type dropdown</div>
				<div>Direction: direction dropdown</div>
				<div style={{ backgroundColor: 'orchid' }}>
					<Icon icon="info-sign" /> Preview
					<Button title="Save Connection" minimal icon="tick" onClick={handleCreateEdge}>
						Save Connection
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="controls-link-component" style={{ flexDirection: 'column' }}>
			<InputGroup
				placeholder="Enter a URL"
				value={href}
				onChange={(evt) => setHashOrUrl(evt.target.value)}
				onKeyPress={handleKeyPress}
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
				inputRef={inputRef}
			/>
			<div>
				<AnchorButton small minimal title="Visit URL" icon="chevron-up" />
				<AnchorButton
					small
					minimal
					title="Optiona"
					icon="share"
					href={href}
					target="_blank"
				/>
				<Button
					small
					minimal
					title="Remove"
					icon="disable"
					onClick={activeLink.removeLink}
				/>
			</div>
			<ControlsLinkPopover />
		</div>
	);
};

export default ControlsLink;
