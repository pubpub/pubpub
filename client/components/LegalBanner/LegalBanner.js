import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce } from 'react-use';
import { Button } from '@blueprintjs/core';

import { shouldShowTosUpdate, markTosUpdateSeen } from 'utils/legal/tosUpdate';
import { shouldShowGdprBanner, updateGdprConsent } from 'utils/legal/gdprConsent';

require('./legalBanner.scss');

const propTypes = {
	loginData: PropTypes.shape({
		id: PropTypes.string,
		gdprConsent: PropTypes.bool,
	}).isRequired,
};

const banners = [
	{
		shouldShow: ({ loginData }) => shouldShowGdprBanner(loginData),
		notice: () => {
			return (
				<p>
					PubPub uses third-party cookies to help our team and our communities understand
					which features and content on PubPub are receiving traffic.{' '}
					<b>We don't sell this data or share it with anyone else</b>, and we don't use
					third-party processors who aggregate and sell data. Visit your{' '}
					<a href="/privacy/settings">privacy settings</a> to learn more.
				</p>
			);
		},
		// eslint-disable-next-line react/prop-types
		buttons: ({ loginData }, next) => {
			const closeWithConsent = (doesConsent) => {
				updateGdprConsent(loginData, doesConsent);
				next();
			};
			return (
				<>
					<Button onClick={() => closeWithConsent(true)} intent="success">
						Accept
					</Button>
					<Button onClick={() => closeWithConsent(false)}>Disable</Button>
				</>
			);
		},
	},
	{
		shouldShow: () => shouldShowTosUpdate(),
		notice: () => {
			return (
				<p>
					We've updated PubPub's Terms of Service to clarify the relationship between
					PubPub, third-party publishers, and users, and to further underscore our
					commitment to the highest standards of user privacy.
				</p>
			);
		},
		buttons: (_, next) => {
			return (
				<>
					<Button
						onClick={() => {
							markTosUpdateSeen();
							next();
						}}
						intent="success"
					>
						Accept
					</Button>
					<Button
						onClick={() => {
							window.open('https://www.pubpub.org/tos', '_blank');
							next();
						}}
					>
						See terms
					</Button>
				</>
			);
		},
	},
];

const LegalBanner = (props) => {
	const [bannerIndex, setBannerIndex] = useState(-1);
	const bannerToShow = banners[bannerIndex];

	const findNextBannerToShow = () => {
		let index = bannerIndex;
		do {
			++index;
		} while (banners[index] && !banners[index].shouldShow(props));
		setBannerIndex(index);
	};

	// After the component mounts on the client, check to see whether it should be shown.
	// (it uses cookies, so it causes SSR problems if we try to do this at first render)
	useEffectOnce(findNextBannerToShow);

	if (!bannerToShow) {
		return null;
	}

	return (
		<div className="legal-banner-component bp3-dark bp3-elevation-1">
			<div className="logo">
				<img src="/static/logoWhite.png" alt="" />
			</div>
			<div className="notice">{bannerToShow.notice()}</div>
			<div className="legal-buttons">{bannerToShow.buttons(props, findNextBannerToShow)}</div>
		</div>
	);
};

LegalBanner.propTypes = propTypes;
export default LegalBanner;
