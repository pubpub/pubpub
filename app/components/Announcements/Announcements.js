import React, { PropTypes } from 'react';
import Radium from 'radium';

let styles;

export const Announcements = React.createClass({
	propTypes: {
		data: PropTypes.object,
	},

	getInitialState() {
		return {
			clearedBeta: undefined,
		};
	},

	componentWillMount() {
		this.setState({
			beta_v3: localStorage.getItem('beta_v3'),
		});
	},
	
	clearItem: function(item) {
		const clearTime = new Date().getTime();
		localStorage.setItem(item, clearTime);
		this.setState({ [item]: clearTime });
	},


	render() {
		return (
			<div style={styles.container}>
				{!this.state.beta_v3 &&
					<div className={'pt-card pt-elevation-4'} style={styles.announcement}>
						<div style={styles.announcementContent}>Welcome to the PubPub_v3 beta. We're gradually rolling out major updates. <a target={'_blank'} href={'mailto:pubpub@media.mit.edu'}>Contact us</a> with any questions or bug reports.</div>
						<div style={styles.announcementButtonWrapper}>
							<button className={'pt-button pt-minimal'} onClick={this.clearItem.bind(this, 'beta_v3')} style={styles.announcementButton}>
								<span className={'pt-icon-large pt-icon-delete'} style={styles.closeButton} />
							</button>
						</div>
					</div>
				}
				
			</div>
		);
	}

});

export default Radium(Announcements);

styles = {
	container: {
		position: 'absolute',
		top: 75,
		right: 10,
		zIndex: 100,
	},
	announcement: {
		maxWidth: '400px',
		display: 'table',
		marginBottom: '1em',
		padding: 0
	},
	announcementContent: {
		display: 'table-cell',
		padding: '1em',
	},
	announcementButtonWrapper: {
		display: 'table-cell',
		width: '1%',
	},
	announcementButton: {
		padding: '1em'
	},
	closeButton: {
		margin: 0,
		opacity: 0.75,
	},
};
