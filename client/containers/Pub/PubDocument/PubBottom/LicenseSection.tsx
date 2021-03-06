import React from 'react';

import { LicenseSelect } from 'components';
import { usePageContext } from 'utils/hooks';
import { getLicenseBySlug } from 'utils/licenses';
import { getPubCopyrightYear } from 'utils/pub/pubDates';
import { Pub } from 'utils/types';

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
	let pubPublisher = communityData.title;
	if (communityData.id === '78810858-8c4a-4435-a669-6bb176b61d40') {
		pubPublisher = 'Massachusetts Institute of Technology';
	}

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
								Copyright © {pubCopyrightYear} {pubPublisher}. (All rights
								reserved.)
							</span>
						</SectionBullets>
					)}
					{slug !== 'copyright' && (
						<SectionBullets>
							<a target="_blank" rel="license noopener noreferrer" href={link!}>
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
