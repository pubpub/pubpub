import React, { PropTypes } from 'react';

import JournalEdit from '../../app/containers/Journal/JournalEdit';
import JournalWrapper from './storybookJournalData';

const JournalEditor = React.createClass({
	propTypes: {
    journalData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return { };
	},

	render() {
    const { journalData } = this.props;
		return (
      <div style={{margin: '0px 100px'}}>
        <JournalEdit journal={journalData.journal} />
      </div>
    );

	}
});

export default JournalWrapper(JournalEditor);
