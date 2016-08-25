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
				<div className={'hoverChild arrow-down-child'}>
					{versionsData.sort((foo, bar)=>{
						// Sort so that most recent is first in array
						if (foo.createDate > bar.createDate) { return -1; }
						if (foo.createDate < bar.createDate) { return 1; }
						return 0;
					}).map((item, index)=> {
						return (
							<div className={'testing'} key={'version-' + index} style={[styles.versionItem, index === versionsData.length - 1 && styles.versionItemLast]}>
								<Link to={'/pub/' + this.props.slug + '?version=' + item._id} className={'underlineOnHover'} style={styles.versionDate}>{dateFormat(item.createDate, 'mmm dd, yyyy h:MM TT')}</Link>
								<div style={styles.versionMessage}>{item.message}</div>
								
								{!item.isPublished && this.props.permissionType === 'author' &&
									<div className={'button'} onClick={this.onPublish.bind(this, item._id)}>Publish Version</div>
								}

								{item.isPublished &&
									<div>Published</div>
								}

								
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
	versionItem: {
		whiteSpace: 'nowrap',
		margin: '.5em 1em',
		borderBottom: '1px solid #bbbdc0',
		padding: '.5em 0em',
	},
	versionItemLast: {
		borderBottom: '0px solid black',
	},
	versionDate: {
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '1.1em',
	},
};
