import { action, linkTo, storiesOf } from '@kadira/storybook';

import LayoutEditor from './storybookLayoutEditor';
import React from 'react';

storiesOf('Layout Editor', module)
  .add('Basic', () => (
    <LayoutEditor/>
  ));
