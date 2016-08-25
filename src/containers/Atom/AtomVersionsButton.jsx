import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

let styles;

export const AtomVersionsButton = React.createClass({
	propTypes: {
		versionsData: PropTypes.array,
		slug: PropTypes.string,
		buttonStyle: PropTypes.object,
		handlePublishVersion: PropTypes.func,
		permissionType: PropTypes.string,
	},

	onPublish: function(id) {
		this.props.handlePublishVersion(id);
	},

	render: function() {
		const versionsData = this.props.versionsData || [];

		return (
			<div className={'light-button arrow-down-button'} style={this.props.buttonStyle}>Versions
				<div className={'hoverChild arrow-down-child'} style={styles.content}>
					{versionsData.filter((item)=>{
						const permissionType = this.props.permissionType;
						if (permissionType !== 'author' && permissionType !== 'editor' && permissionType !== 'reader') {
							return item.isPublished;
						}
						return true;
					}).sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=> {
						return (
							<div className={'testing'} key={'version-' + index} style={[styles.versionItem, index === versionsData.length - 1 && styles.versionItemLast]}>

								{!item.isPublished && (this.props.permissionType === 'author' || this.props.permissionType === 'editor' || this.props.permissionType === 'reader') &&
									<div>
										<div style={styles.statusLabel}>Private</div>
										<div className={'button'} onClick={this.onPublish.bind(this, item._id)} style={styles.publishButton}>Publish Version</div>	
									</div>
								}

								{item.isPublished && (this.props.permissionType === 'author' || this.props.permissionType === 'editor' || this.props.permissionType === 'reader') &&
									<div style={styles.statusLabel}>Published</div>
								}
								<Link to={'/pub/' + this.props.slug + '?version=' + item._id} className={'underlineOnHover'} style={styles.versionDate}>{dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</Link>
								<div style={styles.versionMessage}>{item.message}</div>

								
							</div>
						);
					})}
				</div>
			</div>
		);
	}
});

export default Radium(AtomVersionsButton);

styles = {
	content: {
		minWidth: '400px',
		userSelect: 'initial',
	},
	versionItem: {
		whiteSpace: 'nowrap',
		margin: '1em 1em',
		borderBottom: '1px solid #bbbdc0',
		padding: '1em 0em',
		position: 'relative',
		minHeight: '3.5em',
	},
	versionItemLast: {
		borderBottom: '0px solid black',
	},
	versionDate: {
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '1.1em',
	},
	versionMessage: {
		padding: '.5em 0em',
	},
	publishButton: {
		padding: '0em .5em',
		fontSize: '.85em',
		position: 'absolute',
		bottom: 'calc(1em / .85)',
		right: 0,
	},
	statusLabel: {
		display: 'inline-block',
		padding: '0em .5em',
		backgroundColor: '#BBBDC0',
		color: 'white',
		fontSize: '.85em',
		position: 'absolute',
		top: 'calc(1em / .85)',
		right: 0,
	},
};
