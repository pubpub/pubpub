import type { ModerationReportReason } from 'types';

import React, { useCallback, useState } from 'react';

import { Button, ControlGroup, Intent, Tab, Tabs } from '@blueprintjs/core';

import { apiFetch } from 'client/utils/apiFetch';
import { useMembersState } from 'client/utils/members/useMembers';
import {
	Avatar,
	DashboardFrame,
	InheritedMembersBlock,
	MemberRow,
	SettingsSection,
	UserAutocomplete,
} from 'components';
import { usePageContext } from 'utils/hooks';
import { getReasonLabel } from 'utils/moderationReasons';

import './dashboardMembers.scss';

type BannedUserReport = {
	id: string;
	reason: string;
	reasonText?: string | null;
	createdAt: string;
	user: { id: string; fullName: string; slug: string; avatar?: string | null; initials: string };
	actor: { id: string; fullName: string; slug: string };
};

type Props = {
	membersData: any;
	bannedUsersData: BannedUserReport[];
};

const BannedUsersTab = (props: { reports: BannedUserReport[] }) => {
	const [reports, setReports] = useState(props.reports);
	const [retractingIds, setRetractingIds] = useState<Set<string>>(new Set());

	const handleUnban = useCallback(async (reportId: string) => {
		setRetractingIds((prev) => new Set(prev).add(reportId));
		try {
			await apiFetch.put(`/api/communityModerationReports/${reportId}`, {
				status: 'retracted',
			});
			setReports((prev) => prev.filter((r) => r.id !== reportId));
		} finally {
			setRetractingIds((prev) => {
				const next = new Set(prev);
				next.delete(reportId);
				return next;
			});
		}
	}, []);

	if (!reports.length) {
		return <i>No banned users.</i>;
	}

	return (
		<div className="banned-users-list">
			{reports.map((report) => (
				<div key={report.id} className="banned-user-row">
					<Avatar
						width={30}
						initials={report.user.initials}
						avatar={report.user.avatar}
					/>
					<div className="banned-user-info">
						<span className="banned-user-name">{report.user.fullName}</span>
						<span className="banned-user-detail">
							Banned by {report.actor.fullName}
							{report.reason
								? ` (${getReasonLabel(report.reason as ModerationReportReason)})`
								: ''}
						</span>
					</div>
					<Button
						small
						intent={Intent.WARNING}
						text="Unban"
						loading={retractingIds.has(report.id)}
						onClick={() => handleUnban(report.id)}
					/>
				</div>
			))}
		</div>
	);
};

const DashboardMembers = (props: Props) => {
	const { membersData, bannedUsersData } = props;
	const { membersByType, addMember, updateMember, removeMember } = useMembersState({
		initialMembers: membersData.members,
	});
	const { scopeData } = usePageContext();
	const {
		elements: { activeTargetType, activeTargetName },
		activePermissions: { canManage, canAdminCommunity },
	} = scopeData;

	const localMembers = membersByType[activeTargetType];
	const showLocalEmptyState = !localMembers.length && !membersData.invitations.length;
	const showBannedTab =
		activeTargetType === 'community' && canAdminCommunity && bannedUsersData.length > 0;

	const hasInheritedMembers =
		(membersByType.collection.length && activeTargetType !== 'collection') ||
		(membersByType.community.length && activeTargetType !== 'community') ||
		// @ts-expect-error FIXME: Organization aren't really a thing anymore
		(membersByType.organization.length && activeTargetType !== 'organization');

	const membersContent = (
		<>
			{canManage && (
				<SettingsSection title="Add Member">
					<ControlGroup className="add-member-controls">
						<UserAutocomplete
							// @ts-expect-error ts-migrate(2322) FIXME: Type '(user: any) => any' is not assignable to typ... Remove this comment to see the full error message
							onSelect={addMember}
							usedUserIds={localMembers.map((member) => member.userId)}
						/>
						<Button large text="Add" intent={Intent.PRIMARY} />
					</ControlGroup>
				</SettingsSection>
			)}

			<SettingsSection title={`Members (${localMembers.length})`}>
				{showLocalEmptyState && <i>No members yet.</i>}
				{membersData.invitations.map((invitation) => {
					return (
						<MemberRow
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
							isInvitation={true}
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
							memberData={invitation}
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
							key={invitation.id}
						/>
					);
				})}
				{membersByType[activeTargetType].map((member) => {
					return (
						<MemberRow
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
							memberData={member}
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
							isReadOnly={!canManage}
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
							isOnlyMemberInScope={membersByType[activeTargetType].length === 1}
							// @ts-expect-error ts-migrate(2322) FIXME: Type '(member: any, update: any) => any' is not as... Remove this comment to see the full error message
							onUpdate={updateMember}
							// @ts-expect-error ts-migrate(2322) FIXME: Type '(member: any) => Promise<any>' is not assign... Remove this comment to see the full error message
							onDelete={removeMember}
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
							key={member.id}
						/>
					);
				})}
			</SettingsSection>

			{!!hasInheritedMembers && (
				<SettingsSection title="Inherited Members">
					{!!membersByType.collection.length && activeTargetType !== 'collection' && (
						<InheritedMembersBlock
							members={membersByType.collection}
							scope="Collection"
						/>
					)}
					{!!membersByType.community.length && activeTargetType !== 'community' && (
						<InheritedMembersBlock
							members={membersByType.community}
							scope="Community"
						/>
					)}
					{!!membersByType.organization.length &&
						// @ts-expect-error FIXME: Organization aren't really a thing anymore
						activeTargetType !== 'organization' && (
							<InheritedMembersBlock
								members={membersByType.organization}
								scope="Organization"
							/>
						)}
				</SettingsSection>
			)}
		</>
	);

	return (
		<DashboardFrame
			className="dashboard-members-container"
			title="Members"
			details={`Invite and manage collaborators on this ${activeTargetName}.`}
		>
			{showBannedTab ? (
				<Tabs id="dashboard-members-tabs">
					<Tab id="members" title="Members" panel={membersContent} />
					<Tab
						id="banned"
						title={`Banned Users (${bannedUsersData.length})`}
						panel={<BannedUsersTab reports={bannedUsersData} />}
					/>
				</Tabs>
			) : (
				membersContent
			)}
		</DashboardFrame>
	);
};
export default DashboardMembers;
