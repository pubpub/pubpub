import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileAbout = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
	},

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};
		const adminsData = safeGetInToJS(this.props.jrnlData, ['adminsData']) || [];

		return (
			<div>
				<a className={'underlineOnHover'} style={[styles.link, styles.firstLink, !jrnlData.website && styles.hide]} href={jrnlData.website}>{jrnlData.website}</a>
				<a className={'underlineOnHover'} style={[styles.link, !jrnlData.twitter && styles.hide]} href={'https://twitter.com/' + jrnlData.twitter}>@{jrnlData.twitter}</a>
				<a className={'underlineOnHover'} style={[styles.link, !jrnlData.facebook && styles.hide]} href={'https://facebook.com/' + jrnlData.facebook}>facebook.com/{jrnlData.facebook}</a>
				
				<h3 style={[!jrnlData.about && styles.hide]}>About</h3>
				{jrnlData.about}


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

export default Radium(JrnlProfileAbout);

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
