import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import isUrl from 'is-url';
import { Button, AnchorButton, InputGroup, Checkbox, Icon } from '@blueprintjs/core';

import { moveToEndOfSelection } from 'components/Editor';
import { usePubContext } from 'containers/Pub/pubHooks';
import { pubUrl } from 'utils/canonicalUrls';
import { isDoi } from 'utils/crossref/parseDoi';
import { usePageContext, usePendingChanges } from 'utils/hooks';
import { ExternalPublication, InboundEdge, OutboundEdge, Pub, PubEdge } from 'types';
import { apiFetch } from 'client/utils/apiFetch';
import { useDashboardEdges } from 'client/containers/DashboardEdges/useDashboardEdges';
import { RelationType } from 'utils/pubEdge';
import { assert } from 'utils/assert';

type Props = {
	editorChangeObject: {
		activeLink?: any;
		view?: any;
	};
	onClose: (...args: any[]) => any;
};

type SuggestedItem =
	| {
			targetPub?: Pub;
			externalPublication?: ExternalPublication;
	  }
	| { indeterminate: true }
	| { createNewFromUrl: string };

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
	const [newEdge, setNewEdge] = useState<PubEdge | null>(null);
	const [exisitingEdge, setExisitingEdgeEdge] = useState<OutboundEdge | null>(null);
	const [checkedCreateConnection, setCheckedCreateConnection] = useState<boolean>();
	const [proposedItem, setProposedItem] = useState<null | SuggestedItem>(null);

	const { pendingPromise } = usePendingChanges();

	const [debouncedHref] = useDebounce(href, 250);
	const inputRef = useRef();

	const { addCreatedOutboundEdge, outboundEdges, removeOutboundEdge } = useDashboardEdges(
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

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => activeLink.updateAttrs({ href: debouncedHref }), [debouncedHref]);

	useEffect(() => {
		// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
		if (inputRef.current && typeof inputRef.current.focus === 'function' && !href) {
			// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
			inputRef.current.focus();
		}
	}, [href]);

	useEffect(() => {
		// sets true if href is a url on connection
		const isExistingEdge = outboundEdges.some((obj) => obj.externalPublication?.url === href);
		const obj = outboundEdges.find((outboundEdge) => {
			return outboundEdge.externalPublication?.url === href;
		});
		if (isExistingEdge && obj) {
			setExisitingEdgeEdge(obj);
			setCheckedCreateConnection(true);
		}
	}, [outboundEdges, href]);

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

	const createCandidateEdge = (resource, relationType = RelationType.Reply) => {
		return {
			relationType,
			pubIsParent: true,
			...resource,
		};
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
			.then((createdEdge: PubEdge) => {
				setProposedItem(null);
				setIsCreatingEdge(false);
				addCreatedOutboundEdge(createdEdge);
			})
			.catch((err: Error) => {
				setProposedItem(null);
				setIsCreatingEdge(false);
				setErrorCreatingEdge(err.message);
			});
	};

	const handleCreateEdge = () => {
		assert(newEdge !== null);
		createConnection(newEdge);
	};

	const stripMarkupFromString = (string) => {
		if (string) {
			const div = document.createElement('div');
			div.innerHTML = string;
			return div.innerText;
		}
		return string;
	};

	const setConnectionToCreate = (item: SuggestedItem) => {
		if (
			'externalPublication' in item &&
			item.externalPublication &&
			item.externalPublication.title
		) {
			const { externalPublication } = item;
			setNewEdge(
				createCandidateEdge({
					externalPublication: {
						...externalPublication,
						description: stripMarkupFromString(externalPublication.description),
					},
				}),
			);
		} else if ('createNewFromUrl' in item && item.createNewFromUrl) {
			const { createNewFromUrl } = item;
			setNewEdge(
				createCandidateEdge({
					externalPublication: {
						url: createNewFromUrl,
						contributors: [],
					},
				}),
			);
		}
	};

	// two ways of getting known link
	// rn we only are handling urls
	// if the link is already a connection: we check for obj with val === href
	// if so we delete it be grabbing the entire obj matching href and passingh to removeconnection

	// if we want to delete the link we just made, simply call delete on newEdge

	const handleConnection = () => {
		if (checkedCreateConnection) {
			removeOutboundEdge(exisitingEdge || newEdge);
			setProposedItem(null);
			setCheckedCreateConnection(false);
		} else if (isUrl(href) || isDoi(href)) {
			setProposedItem({ indeterminate: true });
			apiFetch
				.get(`/api/pubEdgeProposal?object=${encodeURIComponent(href)}`)
				.then((res) => {
					if (res) {
						setProposedItem(res);
					} else {
						setProposedItem({ createNewFromUrl: href });
					}
				})
				.then(() => {
					console.log(proposedItem);
					if (proposedItem) setConnectionToCreate(proposedItem);
				});
			setCheckedCreateConnection(true);
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
					checked={checkedCreateConnection}
					disabled={isCreatingEdge}
				/>
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
