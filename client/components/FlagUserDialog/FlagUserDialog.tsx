import type { ModerationReportReason } from 'types';

import React, { useCallback, useState } from 'react';

import { Button, Callout, Classes, Dialog, HTMLSelect, Intent, TextArea } from '@blueprintjs/core';

import { apiFetch } from 'client/utils/apiFetch';

const reasons: { value: ModerationReportReason; label: string }[] = [
	{ value: 'spam-content', label: 'Spam content' },
	{ value: 'hateful-language', label: 'Hateful language' },
	{ value: 'harassment', label: 'Harassment' },
	{ value: 'impersonation', label: 'Impersonation' },
	{ value: 'other', label: 'Other' },
];

type Props = {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
	communityId: string;
	threadCommentId?: string | null;
	userName?: string;
	onFlagged?: () => void;
};

const FlagUserDialog = (props: Props) => {
	const { isOpen, onClose, userId, communityId, threadCommentId, userName, onFlagged } = props;
	const [reason, setReason] = useState<ModerationReportReason>('spam-content');
	const [reasonText, setReasonText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			await apiFetch.post('/api/communityModerationReports', {
				userId,
				communityId,
				reason,
				reasonText: reasonText.trim() || null,
				sourceThreadCommentId: threadCommentId ?? null,
			});
			onFlagged?.();
			onClose();
		} catch (err: any) {
			setError(err?.message ?? 'Failed to flag user');
		} finally {
			setIsLoading(false);
		}
	}, [userId, communityId, reason, reasonText, threadCommentId, onFlagged, onClose]);

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			title={`Flag user${userName ? `: ${userName}` : ''}`}
			style={{ width: 480 }}
		>
			<div className={Classes.DIALOG_BODY}>
				<Callout intent={Intent.WARNING} style={{ marginBottom: 16 }}>
					Flagging this user will hide all of their discussions and comments in your
					community. They will not be able to create any new Pubs or discussions. They may
					still be able to perform other actions if you have given them permissions
					through memberships.
					<br />
					We aim to evaluate flagged users and will send you a follow-up via email to let
					you know what actions we've taken.
				</Callout>
				<div style={{ marginBottom: 12 }}>
					<label htmlFor="flag-reason" style={{ fontWeight: 500, fontSize: 14 }}>
						Reason
					</label>
					<HTMLSelect
						id="flag-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value as ModerationReportReason)}
						fill
						style={{ marginTop: 4 }}
					>
						{reasons.map((r) => (
							<option key={r.value} value={r.value}>
								{r.label}
							</option>
						))}
					</HTMLSelect>
				</div>
				<div>
					<label htmlFor="flag-reason-text" style={{ fontWeight: 500, fontSize: 14 }}>
						Details (optional)
					</label>
					<TextArea
						id="flag-reason-text"
						value={reasonText}
						onChange={(e) => setReasonText(e.target.value)}
						fill
						rows={3}
						placeholder="Provide additional context..."
						style={{ marginTop: 4 }}
					/>
				</div>
				{error && (
					<div style={{ color: 'var(--pt-intent-danger)', marginTop: 8, fontSize: 13 }}>
						{error}
					</div>
				)}
			</div>
			<div className={Classes.DIALOG_FOOTER}>
				<div className={Classes.DIALOG_FOOTER_ACTIONS}>
					<Button text="Cancel" onClick={onClose} disabled={isLoading} />
					<Button
						text="Flag user"
						intent={Intent.WARNING}
						onClick={handleSubmit}
						loading={isLoading}
					/>
				</div>
			</div>
		</Dialog>
	);
};

export default FlagUserDialog;
