import LayoutEditor from '../app/components/LayoutEditor/LayoutEditor';
import React from 'react';

require('../static/blueprint.scss');
require('../static/style.scss');
require('../static/pubBody.scss');
require('../static/markdown.scss');

const Layout = ({ children, onClick }) => (
  <LayoutEditor />
);

export default Layout;
