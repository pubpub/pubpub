import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

// import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const JournalProfileSubmitted = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
	},

	render: function() {
		const journalData = safeGetInToJS(this.props.journalData, ['journalData']) || {};
		const followersData = safeGetInToJS(this.props.journalData, ['followersData']) || [];
		const metaData = {
			title: <FormattedMessage {...globalMessages.Followers}/> + ' · ' + journalData.journalName,
		};

		return (
			<div className={'firstChildNoTopMargin'}>
				<Helmet {...metaData} />

				{
					followersData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						if (!item.source) { return null; }
						return (<PreviewCard
							key={'featured-' + index}
							type={'user'}
							image={item.source.image}
							title={item.source.name}
							slug={item.source.username}
							description={item.source.bio} />
						);
					})
				}
			</div>
		);
	}
});

export default Radium(JournalProfileSubmitted);
