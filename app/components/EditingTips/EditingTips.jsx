import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import React, { PropTypes } from 'react';

import Radium from 'radium';

let styles;

const TIPS = {
  'mentions': 'Use the @ sign to quickly include existing images, references, etc.'
};

export const EditingTips = React.createClass({
	propTypes: {
		content: PropTypes.node,
		title: PropTypes.node,
		position: PropTypes.number,
		style: PropTypes.object,
	},
  getInitialState: function() {
    return { foundTip: null };
  },
  componentDidMount: function() {
    const tips = Object.keys(TIPS);
    let foundTip;
    for (const tip of tips) {
      if (!localStorage[tip]) {
        foundTip = tip;
      }
    }
    this.setState({ foundTip });
  },

  closeTip: function(tip) {
    localStorage[tip] = true;
    this.setState({ foundTip: null });
  },

	render: function() {
    const { foundTip } = this.state;
    if (!foundTip) {
      return null;
    }
		return (
      <div className="pt-callout pt-text-muted">
        <span style={styles.icon} className="pt-icon-info-sign"></span>
        <strong>Tip: </strong>{TIPS[foundTip]}
        <button
          onClick={this.closeTip.bind(this, foundTip)}
          style={styles.close}
          type="button"
          className="pt-button pt-icon-cross pt-minimal"></button>
      </div>
		);
	}
});

export default EditingTips;

styles = {
	icon: {
		paddingRight: 10,
	},
  close: {
    float: 'right'
  },
};
