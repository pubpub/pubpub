import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
const HoverLink = Radium(Link);
import dateFormat from 'dateformat';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubPreview = React.createClass({
	propTypes: {
		pubData: PropTypes.object,
		displayType: PropTypes.string, // 'line' or 'block'
		canEdit: PropTypes.bool,
		headerFontSize: PropTypes.string,
		textFontSize: PropTypes.string,
		hideBottomLine: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			displayType: 'line' 
		};
	},

	render: function() {
		const pub = this.props.pubData;
		return (
			<div style={[styles.container, this.props.hideBottomLine && styles.containerNoLine]} >

				<div style={[styles.detailsWrapper, !this.props.canEdit && styles.detailsWrapperNoEdit]} key={'detailsWrapper-' + pub._id}>
					<Link to={'/pub/' + pub.slug} style={globalStyles.link}>
							<div style={[styles.pubTitle, this.props.headerFontSize && {fontSize: this.props.headerFontSize}]}>{pub.title}</div>
							
							<div style={[styles.pubDate, this.props.textFontSize && {fontSize: this.props.textFontSize}]}>
								{pub.createDate
									? <span>Created: {dateFormat(pub.createDate, 'mmm dd, yyyy')}</span>
									: null
								}

								{pub.lastUpdated
									? <span> | Last Updated: {dateFormat(pub.lastUpdated, 'mmm dd, yyyy')}</span>
									: null
								}
								<div>
									{pub.discussions && pub.discussions.length
										? <span>{pub.discussions.length} Discussions</span>
										: null
									}
								</div>
							</div>

							<div style={[styles.pubAbstract, this.props.textFontSize && {fontSize: this.props.textFontSize}]}>{pub.abstract}</div>
					</Link>
				</div>

				
				{
					this.props.canEdit
						? <HoverLink to={'/pub/' + pub.slug + '/draft'} key={'profilePubEdit-' + pub._id} style={[globalStyles.link, styles.editWrapper]}>
							<FormattedMessage {...globalMessages.edit}/>
						</HoverLink>
						: null
				}
				
				<div style={globalStyles.clearFix}></div>
				
			</div>
		);
	}
});

export default Radium(PubPreview);

styles = {
	container: {
		padding: '10px 0px',
		// margin: '10px',
		// height: '50px',
		// borderBottom: '1px solid #F0F0F0',
		// backgroundColor: 'rgba(0,200,0,0.1)',
		display: 'table',
		width: 'calc(100% - 0px)',
		
	},
	containerNoLine: {
		borderBottom: '0px solid black',
	},
	detailsWrapper: {
		// backgroundColor: 'rgba(200,0,0,0.1)',
		width: 'calc(100% - 75px - 10px)',
		padding: '10px 5px',
		// float: 'left',
		color: '#666',
		display: 'table-cell',
		':hover': {
			color: 'black',
			// backgroundColor: '#F5F5F5',
		}
	},
	detailsWrapperNoEdit: {
		width: 'calc(100% - 10px)',
	},
	editWrapper: {
		width: 'calc(75px - 1px)',
		// float: 'left',
		display: 'table-cell',
		borderLeft: '1px solid #aaa',
		// backgroundColor: 'rgba(0,0,200,0.1)',
		verticalAlign: 'middle',
		userSelect: 'none',
		textAlign: 'center',
		fontSize: '16px',
		':hover': {
			// backgroundColor: '#AAA',
			color: 'black',
		}
	},
	pubTitle: {
		fontSize: '22px',
		width: 'calc(100% - 0px)',
		// whiteSpace: 'nowrap',
		// overflow: 'hidden',
		// textOverflow: 'ellipsis',
	},
	pubAbstract: {
		fontSize: '16px',
		// color: '#999',
		fontFamily: 'Lora',
		// paddingLeft: '10px',
		width: 'calc(100% - 0px)',
		// whiteSpace: 'nowrap',
		// overflow: 'hidden',
		// textOverflow: 'ellipsis',
	},
	pubDate: {
		fontSize: '13px',
		padding: '5px 0px 5px 0px',
		color: '#888'

	},
};


