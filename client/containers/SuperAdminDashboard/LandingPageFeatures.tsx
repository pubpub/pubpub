import React from 'react';

import { SettingsSection } from 'components';
import { pubUrl, communityUrl } from 'utils/canonicalUrls';
import { LandingPageFeatures as LandingPageFeaturesType } from 'types';

import LandingPageFeatureManager, { RenderFeatureProps } from './LandingPageFeatureManager';
import FeaturedCommunityItem from './FeaturedCommunityItem';

type Props = {
	features: LandingPageFeaturesType<false>;
};

const LandingPageFeatures = (props: Props) => {
	const { features } = props;

	const renderPubFeature = ({ feature }: RenderFeatureProps<'pub'>) => {
		const { pub } = feature;
		const { community } = pub;
		return (
			<div className="landing-page-pub-feature">
				<div className="title">
					<a href={pubUrl(community, pub)}>{pub.title}</a>
				</div>
				<div className="community">
					in <a href={communityUrl(community)}>{community.title}</a>
				</div>
			</div>
		);
	};

	const renderCommunityFeature = ({
		feature,
		onUpdateFeature,
	}: RenderFeatureProps<'community'>) => {
		return <FeaturedCommunityItem feature={feature} onUpdateFeature={onUpdateFeature} />;
	};

	return (
		<>
			<SettingsSection title="Pubs">
				<LandingPageFeatureManager
					kind="pub"
					placeholder="Enter a Pub slug or URL"
					initialFeatures={features.pub}
					renderFeature={renderPubFeature}
				/>
			</SettingsSection>
			<SettingsSection title="Communities">
				<LandingPageFeatureManager
					kind="community"
					placeholder="Enter a Community subdomain or URL"
					initialFeatures={features.community}
					renderFeature={renderCommunityFeature}
				/>
			</SettingsSection>
		</>
	);
};

export default LandingPageFeatures;
