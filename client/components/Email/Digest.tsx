import React from 'react';
import { RenderedActivityItem } from 'client/utils/activity/types';
import { formatDate } from 'utils/dates';
import dateFormat from 'dateformat';
import { Icon } from 'client/components';
import { Section, Wrapper, Button } from '.';

const now = new Date();

export const Digest = (props: Props) => {
	return (
		<Wrapper>
			<Section alignment="left">
				<Section
					color={props.accentColorLight}
					backgroundColor={props.accentColorDark}
					backgroundImage={props.headerLogo || ''}
					alignment="left"
				>
					<h1>Activity Digest</h1>
					<h3>{dateFormat(now, 'mmmm yyyy')}</h3>
					<div>
						<p>
							This digest is a compilation of activity in the{' '}
							<a href={props.communityUrl}>{props.communityTitle}</a> community during
							the week of{' '}
							{dateFormat(now.setDate(now.getDate() - now.getDay()), 'dd mmmm yyyy')}.
						</p>
						<Button linkUrl="" width="160">
							<span style={{ color: props.accentColorLight }}>
								<Icon icon="pulse" />
							</span>
							<span>View latest activity</span>
						</Button>
					</div>
				</Section>
				<div>
					<span style={{ color: props.accentColorLight }}>
						<Icon icon="office" />
					</span>
					<h2>Community News</h2>
					{props.communityItems.map((item) => (
						<div key={item.id}>
							<span>
								<Icon icon={item.icon} />
							</span>
							<span>{item.message}</span>
							<div>
								{item.excerpt && <span>{item.excerpt}</span>}
								<span>{formatDate(item.timestamp, { includeTime: false })}</span>
							</div>
						</div>
					))}
					<span style={{ color: props.accentColorLight }}>
						<Icon icon="document-share" />
					</span>
					<h2>Pub News</h2>
					{props.pubItems.map((item) => {
						return (
							<div key={item.id}>
								<span style={{ color: props.accentColorLight }}>
									<Icon icon={item.icon} />
								</span>
								<span>{item.message}</span>
								{item.excerpt && <div>{item.excerpt}</div>}
								<div>{formatDate(item.timestamp, { includeTime: false })}</div>
							</div>
						);
					})}
				</div>
			</Section>
		</Wrapper>
	);
};

type Props = {
	communityTitle: string;
	communityUrl: string;
	headerLogo?: string;
	pubItems: RenderedActivityItem[];
	communityItems: RenderedActivityItem[];
	accentColorDark: string;
	accentColorLight: string;
};
