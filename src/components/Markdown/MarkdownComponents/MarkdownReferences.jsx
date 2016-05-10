import React, {PropTypes} from 'react';
import {Reference} from 'components';

const References = React.createClass({
  propTypes: {
    references: PropTypes.array,
  },
  render: function() {

    // <h1><FormattedMessage {...globalMessages.references}/></h1>
    const references = this.props.references || [];
    if (!references || references.length === 0) {
      return (<span></span>);
    }
    return (<div id={'pub-references'}>
          <h1>References</h1>
          {
            references.map((reference, index)=>{
              return (
                <div key={'pubReference-' + index} className={'reference'}>
                  <span className={'reference-number'}>[{index + 1}]</span>
                  <span className={'reference-content'}>
                    <Reference citationObject={reference} mode={'mla'} />
                  </span>
                </div>
              );
            })
          }
        </div>);
  }
});

export default References;
