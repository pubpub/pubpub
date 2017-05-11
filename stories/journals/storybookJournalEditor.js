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
      <JournalEdit journal={journalData.journal} />
    );

	}
});

export default JournalWrapper(JournalEditor);
