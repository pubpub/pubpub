import React, { PropTypes } from 'react';

import JournalWrapper from './storybookJournalData';
import LayoutEditor from '../../app/components/LayoutEditor/LayoutEditor';
import { SampleLayout } from '../sampledata';

const Layout = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		journalData: PropTypes.object,
		dispatch: PropTypes.func,
	},
	getInitialState() {
		return { };
	},
	render() {
    const { journalData } = this.props;
		return (
      <LayoutEditor journal={journalData.journal} initialContent={SampleLayout} />
    );

	}
});

export default JournalWrapper(Layout);
