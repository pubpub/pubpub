import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

let styles;

export const AtomVersionsButton = React.createClass({
	propTypes: {
		versionsData: PropTypes.object,
		slug: PropTypes.object,
		buttonStyle: PropTypes.object,
		
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
							<div className={'testing'} key={'version-' + index} style={styles.versionItem}>
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
	versionItem: {
		whiteSpace: 'nowrap',
		margin: '.5em 1em',
		borderBottom: '1px solid #bbbdc0',
		padding: '.5em 0em',
	},
	versionDate: {
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '1.1em',
	},
};
