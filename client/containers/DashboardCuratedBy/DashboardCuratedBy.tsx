import React, { useCallback, useState } from 'react';

import { Button, Card, Tag } from '@blueprintjs/core';

import { DashboardFrame } from 'client/components';
import { apiFetch } from 'client/utils/apiFetch';
import { usePageContext } from 'utils/hooks';

import './dashboardCuratedBy.scss';

type CuratingOrg = {
	id: string;
	slug: string;
	title: string;
	subtitle: string | null;
	avatar: string | null;
	website: string | null;
	accentColorDark: string | null;
	rejected: boolean;
	dataAccess: 'none' | 'requested' | 'granted';
};

type Props = {
	curatingOrgs: CuratingOrg[];
	scopeType?: 'community' | 'pub';
};

const DashboardCuratedBy = (props: Props) => {
	const { communityData, scopeData } = usePageContext();
	const scopeType = props.scopeType ?? 'community';
	const pubId = scopeData.elements.activePub?.id;
	const [orgs, setOrgs] = useState<CuratingOrg[]>(props.curatingOrgs);
	const [togglingId, setTogglingId] = useState<string | null>(null);

	const scopeLabel = scopeType === 'pub' ? 'pub' : 'community';

	// Community-scope: reject (opt-out)
	const handleReject = useCallback(
		async (orgId: string) => {
			setTogglingId(orgId);
			try {
				await apiFetch.post(`/api/communities/${communityData.id}/org-opt-out`, {
					orgId: orgId,
				});
				setOrgs((prev) => prev.map((o) => (o.id === orgId ? { ...o, rejected: true } : o)));
			} finally {
				setTogglingId(null);
			}
		},
		[communityData.id],
	);

	// Community-scope: un-reject
	const handleAllow = useCallback(
		async (orgId: string) => {
			setTogglingId(orgId);
			try {
				await apiFetch.delete(`/api/communities/${communityData.id}/org-opt-out/${orgId}`);
				setOrgs((prev) =>
					prev.map((o) => (o.id === orgId ? { ...o, rejected: false } : o)),
				);
			} finally {
				setTogglingId(null);
			}
		},
		[communityData.id],
	);

	// Pub-scope: remove from org entirely
	const handleRemove = useCallback(
		async (orgId: string) => {
			if (!pubId) return;
			setTogglingId(orgId);
			try {
				await apiFetch.delete(`/api/pubs/${pubId}/curating-orgs/${orgId}`);
				setOrgs((prev) => prev.filter((o) => o.id !== orgId));
			} finally {
				setTogglingId(null);
			}
		},
		[pubId],
	);

	const handleDataAccess = useCallback(
		async (orgId: string, grant: boolean) => {
			setTogglingId(orgId);
			try {
				const basePath =
					scopeType === 'pub'
						? `/api/pubs/${pubId}/curating-orgs/${orgId}/data-access`
						: `/api/communities/${communityData.id}/curating-orgs/${orgId}/data-access`;
				await apiFetch.put(basePath, {
					dataAccess: grant ? 'granted' : 'none',
				});
				setOrgs((prev) =>
					prev.map((o) =>
						o.id === orgId ? { ...o, dataAccess: grant ? 'granted' : 'none' } : o,
					),
				);
			} finally {
				setTogglingId(null);
			}
		},
		[communityData.id, pubId, scopeType],
	);

	const activeOrgs = orgs.filter((o) => !o.rejected);
	const rejectedOrgs = orgs.filter((o) => o.rejected);

	return (
		<DashboardFrame
			title="Curated By"
			className="dashboard-curated-by-component"
			details={`Manage which orgs can include this ${scopeLabel} in their curated collections.`}
		>
			<div className="curated-by-content">
				<p className="curated-by-intro">
					{scopeType === 'pub' ? (
						<>
							Orgs listed here have added this pub to their curated collection. You
							can remove this pub from an org or manage analytics access.
						</>
					) : (
						<>
							Orgs listed here have added this community to their curated collection.
							You can reject specific orgs to remove this community from their landing
							pages, data dashboards, and suggested community lists.
						</>
					)}
				</p>

				{orgs.length === 0 ? (
					<div className="curated-by-empty">
						No orgs are currently curating this {scopeLabel}.
					</div>
				) : (
					<>
						{/* Active curators */}
						{activeOrgs.length > 0 && (
							<>
								<h3 className="curated-by-heading">
									Active Curators
									<Tag minimal round className="curated-by-count">
										{activeOrgs.length}
									</Tag>
								</h3>
								<div className="curated-by-list">
									{activeOrgs.map((org) => (
										<Card key={org.id} className="curated-by-org-card">
											<div className="curated-by-org-row">
												<a
													href={`/org/${org.slug}`}
													className="curated-by-org-link"
													target="_blank"
													rel="noopener noreferrer"
												>
													<div className="curated-by-org-inner">
														{org.avatar && (
															<img
																className="curated-by-org-avatar"
																src={org.avatar}
																alt=""
															/>
														)}
														<div className="curated-by-org-info">
															<span className="curated-by-org-title">
																{org.title}
															</span>
															{org.subtitle && (
																<span className="curated-by-org-subtitle">
																	{org.subtitle}
																</span>
															)}
														</div>
													</div>
												</a>
												<div className="curated-by-org-actions">
													{org.dataAccess === 'requested' && (
														<>
															<Tag
																minimal
																intent="warning"
																className="curated-by-data-tag"
															>
																Data access requested
															</Tag>
															<Button
																small
																outlined
																intent="success"
																text="Grant"
																icon="tick"
																loading={togglingId === org.id}
																onClick={() =>
																	handleDataAccess(org.id, true)
																}
															/>
															<Button
																small
																outlined
																intent="none"
																text="Deny"
																icon="cross"
																loading={togglingId === org.id}
																onClick={() =>
																	handleDataAccess(org.id, false)
																}
															/>
														</>
													)}
													{org.dataAccess === 'granted' && (
														<>
															<Tag
																minimal
																intent="success"
																className="curated-by-data-tag"
															>
																Data access granted
															</Tag>
															<Button
																small
																minimal
																intent="danger"
																text="Revoke"
																icon="lock"
																loading={togglingId === org.id}
																onClick={() =>
																	handleDataAccess(org.id, false)
																}
															/>
														</>
													)}
													{scopeType === 'pub' ? (
														<Button
															small
															outlined
															intent="danger"
															text="Remove"
															icon="cross"
															loading={togglingId === org.id}
															onClick={() => handleRemove(org.id)}
														/>
													) : (
														<Button
															small
															outlined
															intent="danger"
															text="Reject"
															icon="disable"
															loading={togglingId === org.id}
															onClick={() => handleReject(org.id)}
														/>
													)}
												</div>
											</div>
										</Card>
									))}
								</div>
							</>
						)}

						{/* Rejected curators (community-scope only) */}
						{scopeType === 'community' && rejectedOrgs.length > 0 && (
							<>
								<h3 className="curated-by-heading curated-by-heading-rejected">
									Rejected
									<Tag minimal round intent="danger" className="curated-by-count">
										{rejectedOrgs.length}
									</Tag>
								</h3>
								<div className="curated-by-list">
									{rejectedOrgs.map((org) => (
										<Card
											key={org.id}
											className="curated-by-org-card curated-by-org-rejected"
										>
											<div className="curated-by-org-row">
												<a
													href={`/org/${org.slug}`}
													className="curated-by-org-link"
													target="_blank"
													rel="noopener noreferrer"
												>
													<div className="curated-by-org-inner">
														{org.avatar && (
															<img
																className="curated-by-org-avatar"
																src={org.avatar}
																alt=""
															/>
														)}
														<div className="curated-by-org-info">
															<span className="curated-by-org-title">
																{org.title}
															</span>
															{org.subtitle && (
																<span className="curated-by-org-subtitle">
																	{org.subtitle}
																</span>
															)}
														</div>
													</div>
												</a>
												<Button
													small
													outlined
													intent="success"
													text="Allow"
													icon="tick"
													loading={togglingId === org.id}
													onClick={() => handleAllow(org.id)}
												/>
											</div>
										</Card>
									))}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</DashboardFrame>
	);
};

export default DashboardCuratedBy;
