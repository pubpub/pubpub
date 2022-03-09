import React from 'react';

import { PubPageData, DefinitelyHas } from 'types';

import { usePageContext } from 'utils/hooks';
import { PubThemePicker, PopoverButton } from 'components';
import SmallHeaderButton from '../../PubHeader/SmallHeaderButton';

require('./spubSettings.scss');

type Props = {
	pubData: DefinitelyHas<PubPageData, 'submission'>;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
};

const SpubSettings = (props: Props) => {
	const { communityData } = usePageContext();
	const renderHeaderAndBackgroundSetting = () => {
		return (
			<div className="submission-tab-prompt">
				<div className="submission-tab-prompt-text">
					<h2>Header Background & Theme</h2>
					<p>
						You can pick a background image and a custom visual theme for the header of
						your submission pub.
					</p>
					<p>
						Once you've made your changes, use the Preview tab to see the updated header
						of your submission pub.
					</p>
				</div>
				<div>
					&nbsp;
					<PopoverButton
						component={PubThemePicker}
						className="pub-header-popover"
						updatePubData={props.onUpdatePub}
						pubData={props.pubData}
						communityData={communityData}
						aria-label="Pub header theme options"
					>
						<SmallHeaderButton
							label="EDIT PUB THEME"
							labelPosition="right"
							icon="clean"
							className="label"
						/>
					</PopoverButton>
				</div>
			</div>
		);
	};

	return <div className="submission-tab-tabs">{renderHeaderAndBackgroundSetting()}</div>;
};

export default SpubSettings;
