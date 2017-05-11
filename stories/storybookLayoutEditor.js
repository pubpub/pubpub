import React, { PropTypes } from 'react';

import LayoutEditor from '../app/components/LayoutEditor/LayoutEditor';
import { SampleLayout } from './sampledata';
import { connect } from 'react-redux';
import { getJournalData } from '../app/containers/Journal/actions';
import { getPubData } from '../app/containers/Pub/actions';

require('../static/blueprint.scss');
require('../static/style.scss');
require('../static/pubBody.scss');
require('../static/markdown.scss');

const Layout = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		userData: PropTypes.object,
		params: PropTypes.object,
		dispatch: PropTypes.func,
	},

	componentWillMount() {
		// this.props.dispatch(getUserData(params.username));
	},

  componentDidMount() {
    this.getAJournal();
  },

  getAJournal() {
    this.props.dispatch(getJournalData('jods'));
  },

	getInitialState() {
		return { };
	},

	render() {
    const { journalData } = this.props;
		return (
      <LayoutEditor journalData={journalData} initialContent={SampleLayout} />
    );

	}
});

function mapStateToProps(state) {
	return {
    journalData: state.journal.toJS(),
	};
}

export default connect(mapStateToProps)(Layout);
