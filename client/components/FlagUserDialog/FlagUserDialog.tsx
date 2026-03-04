import type { UserCommunityFlagReason } from 'types';

import React, { useCallback, useState } from 'react';

import { Button, Classes, Dialog, HTMLSelect, Intent, TextArea } from '@blueprintjs/core';

import { apiFetch } from 'client/utils/apiFetch';

const reasons: { value: UserCommunityFlagReason; label: string }[] = [
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
	discussionId?: string | null;
	userName?: string;
	onFlagged?: () => void;
};

const FlagUserDialog = (props: Props) => {
	const { isOpen, onClose, userId, communityId, discussionId, userName, onFlagged } = props;
	const [reason, setReason] = useState<UserCommunityFlagReason>('spam-content');
	const [reasonText, setReasonText] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			await apiFetch.post('/api/userCommunityFlags', {
				userId,
				communityId,
				reason,
				reasonText: reasonText.trim() || null,
				sourceDiscussionId: discussionId ?? null,
			});
			onFlagged?.();
			onClose();
		} catch (err: any) {
			setError(err?.message ?? 'Failed to flag user');
		} finally {
			setIsLoading(false);
		}
	}, [userId, communityId, reason, reasonText, discussionId, onFlagged, onClose]);

	return (
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			title={`Flag user${userName ? `: ${userName}` : ''}`}
		>
			<div className={Classes.DIALOG_BODY}>
				<label htmlFor="flag-reason">
					Reason
					<HTMLSelect
						id="flag-reason"
						value={reason}
						onChange={(e) => setReason(e.target.value as UserCommunityFlagReason)}
						fill
					>
						{reasons.map((r) => (
							<option key={r.value} value={r.value}>
								{r.label}
							</option>
						))}
					</HTMLSelect>
				</label>
				<div style={{ marginTop: 10 }}>
					<label htmlFor="flag-reason-text">
						Details (optional)
						<TextArea
							id="flag-reason-text"
							value={reasonText}
							onChange={(e) => setReasonText(e.target.value)}
							fill
							rows={3}
							placeholder="Provide additional context..."
						/>
					</label>
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
						intent={Intent.DANGER}
						onClick={handleSubmit}
						loading={isLoading}
					/>
				</div>
			</div>
		</Dialog>
	);
};

export default FlagUserDialog;
