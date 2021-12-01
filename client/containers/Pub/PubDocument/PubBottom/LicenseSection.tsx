import React from 'react';

import { LicenseSelect } from 'components';
import { usePageContext } from 'utils/hooks';
import { getLicenseBySlug } from 'utils/licenses';
import { getPubCopyrightYear } from 'utils/pub/pubDates';
import { Pub } from 'types';

import PubBottomSection, { SectionBullets, AccentedIconButton } from './PubBottomSection';

type Props = {
	pubData: Pub;
	updateLocalData: (...args: any[]) => any;
};

const LicenseSection = (props: Props) => {
	const { pubData, updateLocalData } = props;
	const { communityData, scopeData } = usePageContext();
	const { link, full, short, version, slug } = getLicenseBySlug(pubData.licenseSlug)!;
	const pubCopyrightYear = getPubCopyrightYear(pubData as any);
	const pubPublisher = communityData.publishAs || communityData.title;

	return (
		<PubBottomSection
			accentColor={communityData.accentColorDark}
			isExpandable={false}
			className="pub-bottom-license"
			title="License"
			centerItems={
				<React.Fragment>
					{slug === 'copyright' && (
						<SectionBullets>
							<span>
								Copyright © {pubCopyrightYear} {pubPublisher}. All rights reserved.
							</span>
						</SectionBullets>
					)}
					{slug !== 'copyright' && (
						<SectionBullets>
							<a
								target="_blank"
								rel="license noopener noreferrer"
								className="license-link"
								href={link!}
							>
								<img
									width={75}
									alt=""
									src={`/static/license/${slug}.svg`}
									className="license-image"
								/>
								{`${full} (${short} ${version})`}
							</a>
						</SectionBullets>
					)}
				</React.Fragment>
			}
			iconItems={({ iconColor }) => {
				if (scopeData.activePermissions.canManage) {
					return (
						<LicenseSelect pubData={pubData as any} updateLocalData={updateLocalData}>
							{({ isPersisting }) => (
								<AccentedIconButton
									accentColor={iconColor}
									icon="edit"
									title="Select Pub license"
									loading={isPersisting}
								/>
							)}
						</LicenseSelect>
					);
				}
				return null;
			}}
		/>
	);
};
export default LicenseSection;
