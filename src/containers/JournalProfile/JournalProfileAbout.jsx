import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JournalProfileAbout = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
	},

	render: function() {
		const journalData = safeGetInToJS(this.props.journalData, ['journalData']) || {};
		const adminsData = safeGetInToJS(this.props.journalData, ['adminsData']) || [];

		return (
			<div>
				<a className={'underlineOnHover'} style={[styles.link, styles.firstLink, !journalData.website && styles.hide]} href={journalData.website}>{journalData.website}</a>
				<a className={'underlineOnHover'} style={[styles.link, !journalData.twitter && styles.hide]} href={'https://twitter.com/' + journalData.twitter}>@{journalData.twitter}</a>
				<a className={'underlineOnHover'} style={[styles.link, !journalData.facebook && styles.hide]} href={'https://facebook.com/' + journalData.facebook}>facebook.com/{journalData.facebook}</a>
				
				<h3 style={[!journalData.about && styles.hide]}>About</h3>
				{journalData.about}


				<h3>Admins</h3>
				{
					adminsData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=>{
						return (
							<PreviewCard 
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

export default Radium(JournalProfileAbout);

styles = {
	link: {
		paddingLeft: '1em',
		marginLeft: '1em',
		borderLeft: '1px solid #BBBDC0',
		textDecoration: 'none',
		color: 'inherit',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingLeft: 'auto',
			marginLeft: 'auto',
			borderLeft: '0px solid #BBBDC0',
		},
	},
	firstLink: {
		borderLeft: '0px solid #BBBDC0',
		paddingLeft: '0em',
		marginLeft: '0em',
	},
	hide: {
		display: 'none',
	},
};
