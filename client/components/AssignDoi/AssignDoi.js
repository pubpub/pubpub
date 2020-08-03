import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { Button, Callout, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';

import { InputField } from 'components';
import {
	getDepositRecordContentVersion,
	setDepositRecordContentVersion,
	getDepositRecordReviewType,
	setDepositRecordReviewType,
	getDepositRecordReviewRecommendation,
	setDepositRecordReviewRecommendation,
	isPreprint,
	isReview,
	getDepositTypeTitle,
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

const AssignDoiStatus = {
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
	UpdateReviewType: 'update_review_type',
	UpdateReviewRecommendation: 'update_review_recommendation',
	FetchDeposit: 'fetch_deposit',
	FetchDepositSuccess: 'fetch_deposit_success',
	Error: 'error',
};

const buttonTextByStatus = {
	[AssignDoiStatus.Initial]: 'Preview Deposit',
	[AssignDoiStatus.Previewing]: 'Getting Preview',
	[AssignDoiStatus.Previewed]: 'Submit Deposit',
	[AssignDoiStatus.Depositing]: 'Depositing',
	[AssignDoiStatus.Deposited]: 'DOI Deposited',
};

const getButtonText = (status, deposit) => {
	if (status === AssignDoiStatus.Initial && deposit) {
		return 'Resubmit DOI deposit';
	}

	return buttonTextByStatus[status];
};

export function reducer(state, action) {
	switch (action.type) {
		case AssignDoiActionType.FetchPreview:
			if (
				!(
					state.status === AssignDoiStatus.Initial ||
					state.status === AssignDoiStatus.Error ||
					// re-fetch preview
					state.status === AssignDoiStatus.Previewed
				)
			) {
				return state;
			}

			return {
				...state,
				status: AssignDoiStatus.Previewing,
				error: null,
			};
		case AssignDoiActionType.FetchPreviewSuccess:
			if (state.status !== AssignDoiStatus.Previewing) {
				return state;
			}

			return {
				...state,
				status: AssignDoiStatus.Previewed,
				result: action.payload,
				error: null,
			};
		case AssignDoiActionType.UpdateContentVersion: {
			if (state.status !== AssignDoiStatus.Previewed) {
				return state;
			}

			const result = { ...state.result };

			// Not totally necessary here to create a full deep copy of the
			// object since we're not using a change detection algorithm
			// like `react-redux`, but this is technically a "Bad Practice":
			setDepositRecordContentVersion(
				result,
				action.payload === 'none' ? null : action.payload,
			);

			return {
				...state,
				result: result,
			};
		}
		case AssignDoiActionType.UpdateReviewType: {
			if (state.status !== AssignDoiStatus.Previewed) {
				return state;
			}

			const result = { ...state.result };

			setDepositRecordReviewType(result, action.payload === 'none' ? null : action.payload);

			return {
				...state,
				result: result,
			};
		}
		case AssignDoiActionType.UpdateReviewRecommendation: {
			if (state.status !== AssignDoiStatus.Previewed) {
				return state;
			}

			const result = { ...state.result };

			setDepositRecordReviewRecommendation(
				result,
				action.payload === 'none' ? null : action.payload,
			);

			return {
				...state,
				result: result,
			};
		}
		case AssignDoiActionType.FetchDeposit:
			if (state.status !== AssignDoiStatus.Previewed) {
				return state;
			}

			return {
				...state,
				status: AssignDoiStatus.Depositing,
				error: null,
			};
		case AssignDoiActionType.FetchDepositSuccess:
			if (state.status !== AssignDoiStatus.Depositing) {
				return state;
			}

			return {
				...state,
				status: AssignDoiStatus.Deposited,
				result: action.payload,
				error: null,
			};
		case AssignDoiActionType.Error:
			return {
				...state,
				status: AssignDoiStatus.Initial,
				error: action.payload,
			};
		default:
			return state;
	}
}

const initialState = {
	status: AssignDoiStatus.Initial,
	preview: null,
	result: null,
	error: null,
};

const contentVersionItems = [
	{ title: '(None)', key: 'none' },
	{ title: 'Preprint', key: 'preprint' },
	{ title: 'Advance Manuscript', key: 'am' },
	{ title: 'Version of Record', key: 'vor' },
];

const reviewTypeItems = [
	{ title: '(None)', key: 'none' },
	{ title: 'Referee Report', key: 'referee-report' },
	{ title: 'Editor Report', key: 'editor-report' },
	{ title: 'Author Comment', key: 'author-comment' },
	{ title: 'Community Comment', key: 'community-comment' },
	{ title: 'Manuscript', key: 'manuscript' },
	{ title: 'Aggregate', key: 'aggregate' },
	{ title: 'Recommendation', key: 'recommendation' },
];

const reviewRecommendationItems = [
	{ title: '(None)', key: 'none' },
	{ title: 'Major Revision', key: 'major-revision' },
	{ title: 'Minor Revision', key: 'minor-revision' },
	{ title: 'Reject', key: 'reject' },
	{ title: 'Reject with Resubmit', key: 'reject-with-resubmit' },
	{ title: 'Accept', key: 'accept' },
	{ title: 'Accept with Reservation', key: 'accept-with-reservation' },
];

function AssignDoi(props) {
	const { communityData, disabled, pubData, onPreview, onDeposit, onError, target } = props;
	const [state, dispatch] = useReducer(reducer, initialState);
	const { status, result, error } = state;

	const reviewType = getDepositRecordReviewType(result);
	const reviewRecommendation = getDepositRecordReviewRecommendation(result);

	// Extract the content version from current result.
	let contentVersion = getDepositRecordContentVersion(result);

	// Assume preprint if no content version is present and body consists of posted_content.
	if (!contentVersion && isPreprint(result || pubData.crossrefDepositRecord)) {
		contentVersion = 'preprint';
	}

	const activeContentVersionKey = contentVersion || 'none';
	const activeContentVersionItem = contentVersionItems.find(
		(item) => item.key === activeContentVersionKey,
	);

	const activeReviewTypeKey = reviewType || 'none';
	const activeReviewTypeItem = reviewTypeItems.find((item) => item.key === activeReviewTypeKey);

	const activeReviewRecommendationKey = reviewRecommendation || 'none';
	const activeReviewRecommendationItem = reviewRecommendationItems.find(
		(item) => item.key === activeReviewRecommendationKey,
	);

	const requestBody = {
		target: target,
		pubId: pubData.id,
		communityId: communityData.id,
	};

	if (contentVersion) requestBody.contentVersion = contentVersion;
	if (reviewType) requestBody.reviewType = reviewType;
	if (reviewRecommendation) requestBody.reviewRecommendation = reviewRecommendation;

	const fetchPreview = async (nextParams) => {
		dispatch({ type: AssignDoiActionType.FetchPreview });

		try {
			const params = new URLSearchParams({
				...requestBody,
				// Ensure we don't send &contentVersion=null in the case of null or
				// undefined content version.
				...nextParams,
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
			const body = JSON.stringify(requestBody);
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
	const handleContentVersionItemSelect = ({ key: nextContentVersion }) => {
		dispatch({
			type: AssignDoiActionType.UpdateContentVersion,
			payload: nextContentVersion,
		});

		// Immediately load preview with next content version.
		fetchPreview({ contentVersion: nextContentVersion });
	};
	const handleReviewTypeItemSelect = ({ key: nextReviewType }) => {
		dispatch({
			type: AssignDoiActionType.UpdateReviewType,
			payload: nextReviewType,
		});

		// Immediately load preview with next review type.
		fetchPreview({ reviewType: nextReviewType });
	};
	const handleReviewRecommendationItemSelect = ({ key: nextReviewRecommendation }) => {
		dispatch({
			type: AssignDoiActionType.UpdateReviewRecommendation,
			payload: nextReviewRecommendation,
		});

		// Immediately load preview with next review recommendation.
		fetchPreview({ reviewRecommendation: nextReviewRecommendation });
	};

	let handleButtonClick;

	if (status === AssignDoiStatus.Initial) {
		handleButtonClick = handlePreviewClick;
	} else if (status === AssignDoiStatus.Previewed) {
		handleButtonClick = handleDepositClick;
	}

	return (
		<div className="assign-doi-component">
			{(status === AssignDoiStatus.Previewed || status === AssignDoiStatus.Previewing) && (
				<>
					<Callout intent="primary" title="Review Deposit">
						This work is being deposited as a{' '}
						<strong>{getDepositTypeTitle(result)}</strong> based on its Connections,
						primary collection, or selected Content Version. Review the information
						below, then click the "Submit Deposit" button to submit the deposit to
						Crossref.
					</Callout>
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
							onItemSelect={handleContentVersionItemSelect}
							filterable={false}
							popoverProps={{ minimal: true }}
						>
							<Button
								text={<span>{activeContentVersionItem.title}</span>}
								rightIcon="caret-down"
							/>
						</Select>
					</InputField>

					{isReview(result) && (
						<div className="dropdowns">
							<InputField label="Review Type">
								<Select
									items={reviewTypeItems}
									itemRenderer={(item, { handleClick }) => (
										<MenuItem
											key={item.key}
											active={item === activeReviewTypeItem}
											onClick={handleClick}
											text={<span>{item.title}</span>}
										/>
									)}
									onItemSelect={handleReviewTypeItemSelect}
									filterable={false}
									popoverProps={{ minimal: true }}
								>
									<Button
										text={<span>{activeReviewTypeItem.title}</span>}
										rightIcon="caret-down"
									/>
								</Select>
							</InputField>
							<InputField label="Review Recommendation">
								<Select
									items={reviewRecommendationItems}
									itemRenderer={(item, { handleClick }) => (
										<MenuItem
											key={item.key}
											active={item === activeReviewRecommendationItem}
											onClick={handleClick}
											text={<span>{item.title}</span>}
										/>
									)}
									onItemSelect={handleReviewRecommendationItemSelect}
									filterable={false}
									popoverProps={{ minimal: true }}
								>
									<Button
										text={<span>{activeReviewRecommendationItem.title}</span>}
										rightIcon="caret-down"
									/>
								</Select>
							</InputField>
						</div>
					)}
				</>
			)}
			{status === AssignDoiStatus.Previewed && (
				<AssignDoiPreview crossrefDepositRecord={result} />
			)}
			<InputField error={error && 'There was an error depositing the work.'}>
				<Button
					disabled={disabled || !handleButtonClick}
					text={getButtonText(status, pubData.crossrefDepositRecord)}
					loading={
						status === AssignDoiStatus.Previewing ||
						status === AssignDoiStatus.Depositing
					}
					onClick={handleButtonClick}
					icon={status === AssignDoiStatus.Deposited && 'tick'}
				/>
			</InputField>
		</div>
	);
}

AssignDoi.propTypes = propTypes;
AssignDoi.defaultProps = defaultProps;
export default AssignDoi;
