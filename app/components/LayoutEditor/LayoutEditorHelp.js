import { Button, Collapse } from "@blueprintjs/core";
import React, { PropTypes } from 'react';

const LayoutEditorHelp = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false
    };
  },
  handleClick: function() {
    this.setState({isOpen: !this.state.isOpen});
  },
  render() {
    return (
      <div>
      <Button onClick={this.handleClick}>
				{this.state.isOpen ? "Hide" : "Show"} help
		</Button>
		<Collapse isOpen={this.state.isOpen}>
				<pre>
					{`<Pubs></Pubs>`}
				</pre>
		</Collapse>
  </div>
  )
  }

});

export default LayoutEditorHelp;
