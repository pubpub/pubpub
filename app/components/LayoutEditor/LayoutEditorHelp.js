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
      <Button style={{marginBottom: '10px'}} onClick={this.handleClick}>
				{this.state.isOpen ? "Hide" : "Show"} Documentation
		</Button>
		<Collapse isOpen={this.state.isOpen}>
				<pre>
					{`
The front page can be styled using JSX (see: http://buildwithreact.com/tutorial/jsx),
but with a few options to display pubs inside them:

Single Pub: Displays a single (featured) pub by name with some styling options
  parameters:
    - slug: the slug of the pub
    - pubStyle: the default styling of the pub, current options are: 'preview' or 'magazine'
    - showPreview: true or false, if false does not show the avatar of the pub/preview image
    - size: an integer (defaults to 150) that describes the size of the preview, used especially in the 'magazine styling'
    - showFeatureDate: whether the date each pub was featured is shown

  usage:
    <Pub slug='designandscience' pubStyle='magazine' showPreview={true} />

Pubs List: Displays a list of Pubs
  arguments:
    n - Number of pubs to show
    order - The order in which you want the pubs to appear, pubs not in this list are placed at the bototm
    of the sort
    label - Only show pubs with this label
    pubStyle, showPreview, size, showFeatureDate - as described in the "Single Pub"

  usage: <PubsList showPreview={true} n={2} order={['ageofentanglement','designandscience']} />

            `}
				</pre>
		</Collapse>
  </div>
  )
  }

});

export default LayoutEditorHelp;
