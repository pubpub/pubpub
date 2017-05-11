import JournalEditor from './storybookJournalEditor';
import LayoutEditor from './storybookLayoutEditor';
import React from 'react';

export default (storyChain) => {
  storyChain.add('Layout Editor', () => (
    <LayoutEditor />
  )).add('Journal Editor', () => (
    <JournalEditor />
  ))
}
