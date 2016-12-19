import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import { Spinner } from '@blueprintjs/core';
import { PreviewUser, PreviewPub, PreviewJournal, NavContentWrapper } from 'components';

// import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { getLabel } from './actions';

let styles;

export const Label = React.createClass({
	propTypes: {
		labelData: PropTypes.object,
		params: PropTypes.object,
		location: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		this.props.dispatch(getLabel(this.props.params.title));
	},

	// getInitialState() {
	// 	return {
			
	// 	};
	// },

	componentWillReceiveProps(nextProps) {
		
	},

	render() {
		const label = this.props.labelData.label || {};
		const pubs = label.pubs || [];
		
		const params = this.props.params || {};
		const query = this.props.location.query;
		const pathname = this.props.location.pathname;
		
		return (
			<div style={styles.container}>
				<Helmet title={label.title || params.title + ' · PubPub'} />
				
				{this.props.labelData.loading &&
					<div>Loading</div>
				}
				<h1>{label.title}</h1>

				{pubs.map((pub, index)=> {
					return <PreviewPub key={'labelPub-' + index} pub={pub} />;
				})}
					
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		labelData: state.label.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(Label));

styles = {
	container: {
		padding: '2em 1em',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	
};
