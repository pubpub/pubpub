import React, { PropTypes } from 'react';

import { StyleRoot } from 'radium';
import { connect } from 'react-redux';
import { getJournalData } from '../../app/containers/Journal/actions';
import { getPubData } from '../../app/containers/Pub/actions';

require('../../static/blueprint.scss');
require('../../static/style.scss');
require('../../static/pubBody.scss');
require('../../static/markdown.scss');

function mapStateToProps(state) {
  return {
    journalData: state.journal.toJS(),
  };
}

function Wrapped(Component) {

  const JournalData = React.createClass({
  	propTypes: {
  		journalData: PropTypes.object,
  		dispatch: PropTypes.func,
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
  		return (
        <div>
          <StyleRoot>
            <Component journal={this.props.journalData} {...this.props}/>
          </StyleRoot>
        </div>
      );

  	}
  });

  return connect(mapStateToProps)(JournalData);


}

export default Wrapped;
