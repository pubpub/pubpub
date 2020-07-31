import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { InputField } from 'components';
import {
	getDepositRecordContentVersion,
	setDepositRecordContentVersion,
	isPreprint,
} from 'utils/crossref/parseDeposit';
import { apiFetch } from 'client/utils/apiFetch';

import AssignDoiPreview from './AssignDoiPreview';

require('./assignDoi.scss');

const noop = () => {};

const propTypes = {
	communityData: PropTypes.object.isRequired,
	disabled: PropTypes.bool,
	onDeposit: PropTypes.func,
	onError: PropTypes.func,
	onPreview: PropTypes.func,
	pubData: PropTypes.object.isRequired,
	target: PropTypes.string.isRequired,
};

const defaultProps = {
	disabled: false,
	onDeposit: noop,
	onError: noop,
	onPreview: noop,
};

const AssignDoiState = {
	Initial: 'initial',
	Previewing: 'previewing',
	Previewed: 'previewed',
	Depositing: 'depositing',
	Deposited: 'deposited',
};

const AssignDoiActionType = {
	FetchPreview: 'fetch_preview',
	FetchPreviewSuccess: 'fetch_preview_success',
	UpdateContentVersion: 'update_content_version',
	FetchDeposit: 'fetch_deposit',
	FetchDepositSuccess: 'fetch_deposit_success',
	Error: 'error',
};

const buttonTextByState = {
	[AssignDoiState.Initial]: 'Preview Deposit',
	[AssignDoiState.Previewing]: 'Getting Preview',
	[AssignDoiState.Previewed]: 'Submit Deposit',
	[AssignDoiState.Depositing]: 'Depositing',
	[AssignDoiState.Deposited]: 'DOI Deposited',
};

const getButtonText = (state, deposit) => {
	if (state === AssignDoiState.Initial && deposit) {
		return 'Resubmit DOI deposit';
	}

	return buttonTextByState[state];
};

export function reducer(state, action) {
	switch (action.type) {
		case AssignDoiActionType.FetchPreview:
			if (
				!(
					state.state === AssignDoiState.Initial ||
					state.state === AssignDoiState.Error ||
					// re-fetch preview
					state.state === AssignDoiState.Previewed
				)
			) {
				return state;
			}

			return {
				state: AssignDoiState.Previewing,
				result: null,
				error: null,
			};
		case AssignDoiActionType.FetchPreviewSuccess:
			if (state.state !== AssignDoiState.Previewing) {
				return state;
			}

			return {
				state: AssignDoiState.Previewed,
				result: action.payload,
				error: null,
			};
		case AssignDoiActionType.UpdateContentVersion:
			if (state.state !== AssignDoiState.Previewed) {
				return state;
			}

			return {
				...state,
				state: AssignDoiState.Previewed,
				// Not totally necessary here to create a full deep copy of the
				// object since we're not using a change detection algorithm
				// like `react-redux`, but this is technically a "Bad Practice":
				result: {
					...setDepositRecordContentVersion(
						state.result,
						action.payload === 'none' ? null : action.payload,
					),
				},
			};
		case AssignDoiActionType.FetchDeposit:
			if (state.state !== AssignDoiState.Previewed) {
				return state;
			}

			return {
				state: AssignDoiState.Depositing,
				error: null,
			};
		case AssignDoiActionType.FetchDepositSuccess:
			if (state.state !== AssignDoiState.Depositing) {
				return state;
			}

			return {
				state: AssignDoiState.Deposited,
				result: action.payload,
				error: null,
			};
		case AssignDoiActionType.Error:
			return {
				state: AssignDoiState.Initial,
				error: action.payload,
			};
		default:
			return state;
	}
}

const initialState = {
	state: AssignDoiState.Initial,
	preview: null,
	result: null,
	error: null,
};

function AssignDoi(props) {
	const { communityData, disabled, pubData, onPreview, onDeposit, onError, target } = props;
	const [{ state, result, error }, dispatch] = useReducer(reducer, initialState);
	const contentVersionItems = [
		{ title: '(None)', key: 'none' },
		{ title: 'Preprint', key: 'preprint' },
		{ title: 'Version of Record', key: 'vor' },
		{ title: 'Advance Manuscript', key: 'am' },
	];

	// Extract the content version from current result (i.e. preview).
	let contentVersion = getDepositRecordContentVersion(result);

	// Assume preprint if no content version is present and body consists of posted_content.
	if (
		!contentVersion &&
		(result ? isPreprint(result) : isPreprint(pubData.crossrefDepositRecord))
	) {
		contentVersion = 'preprint';
	}

	// Default to "(None)" if no content version can be inferred.
	const activeContentVersionKey = contentVersion || 'none';
	const activeContentVersionItem = contentVersionItems.find(
		(item) => item.key === activeContentVersionKey,
	);

	const fetchPreview = async (nextContentVersion = contentVersion) => {
		dispatch({ type: AssignDoiActionType.FetchPreview });

		try {
			const params = new URLSearchParams({
				target: target,
				pubId: pubData.id,
				communityId: communityData.id,
				// Ensure we don't send &contentVersion=null in the case of null or
				// undefined content version.
				...(nextContentVersion && { contentVersion: nextContentVersion }),
			});
			const preview = await apiFetch(`/api/doiPreview?${params.toString()}`);

			onPreview(preview);

			dispatch({
				type: AssignDoiActionType.FetchPreviewSuccess,
				payload: preview,
			});
		} catch (err) {
			dispatch({ type: AssignDoiActionType.Error, payload: err.message });
			onError(err);
		}
	};

	const fetchDeposit = async () => {
		dispatch({ type: AssignDoiActionType.FetchDeposit });

		try {
			const body = JSON.stringify({
				target: target,
				pubId: pubData.id,
				communityId: communityData.id,
				...(contentVersion && { contentVersion: contentVersion }),
			});
			const response = await apiFetch('/api/doi', {
				method: 'POST',
				body: body,
			});
			dispatch({
				type: AssignDoiActionType.FetchDepositSuccess,
				payload: { depositJson: response },
			});

			onDeposit(response.dois[target]);
		} catch (err) {
			dispatch({ type: AssignDoiActionType.Error, payload: err.message });
			onError(err);
		}
	};

	const handlePreviewClick = () => fetchPreview();
	const handleDepositClick = () => fetchDeposit();
	const handleItemSelect = (item) => {
		const { key: nextContentVersion } = item;

		dispatch({
			type: AssignDoiActionType.UpdateContentVersion,
			payload: nextContentVersion,
		});

		// Immediately load preview with next content version.
		fetchPreview(nextContentVersion);
	};

	let handleButtonClick;

	if (state === AssignDoiState.Initial) {
		handleButtonClick = handlePreviewClick;
	} else if (state === AssignDoiState.Previewed) {
		handleButtonClick = handleDepositClick;
	}

	return (
		<div className="assign-doi-component">
			<InputField error={error && 'There was an error depositing the work.'}>
				<Button
					disabled={disabled || !handleButtonClick}
					text={getButtonText(state, pubData.crossrefDepositRecord)}
					loading={
						state === AssignDoiState.Previewing || state === AssignDoiState.Depositing
					}
					onClick={handleButtonClick}
					icon={state === AssignDoiState.Deposited && 'tick'}
				/>
			</InputField>
			{state === AssignDoiState.Previewed && (
				<InputField label="Content Version">
					<Select
						items={contentVersionItems}
						itemRenderer={(item, { handleClick }) => (
							<MenuItem
								key={item.key}
								active={item === activeContentVersionItem}
								onClick={handleClick}
								text={<span>{item.title}</span>}
							/>
						)}
						onItemSelect={handleItemSelect}
						filterable={false}
						popoverProps={{ minimal: true }}
					>
						<Button
							text={<span>{activeContentVersionItem.title}</span>}
							rightIcon="caret-down"
						/>
					</Select>
				</InputField>
			)}
			{state === AssignDoiState.Previewed && (
				<>
					<p>
						Review the information below, then click the "Submit Deposit" button to
						submit the deposit to Crossref.
					</p>
					<AssignDoiPreview crossrefDepositRecord={result} />
				</>
			)}
		</div>
	);
}

AssignDoi.propTypes = propTypes;
AssignDoi.defaultProps = defaultProps;
export default AssignDoi;
