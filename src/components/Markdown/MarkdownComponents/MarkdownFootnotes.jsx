import React, {PropTypes} from 'react';
import {Reference} from 'components';

const Footnotes = React.createClass({
  propTypes: {
    footnotes: PropTypes.array,
  },
  scrollToFootnote: function(index) {
    document.getElementById(`footnote-${index}`).scrollIntoView();
  },
  render: function() {

    // <h1><FormattedMessage {...globalMessages.references}/></h1>
    const footnotes = this.props.footnotes || [];
    if (!footnotes || footnotes.length === 0) {
      return (<span></span>);
    }
    return (<div id={'pub-footnotes'}>
      <h2 style={styles.footnoteHeader}>Footnotes</h2>
      {
        footnotes.map((footnote, index)=>{
          if (!footnote || !footnote.footnote) {
             return <span></span>;
          }
          const footnoteText = footnote.footnote.replace(/\\n/g, '\n');
          return (
            <div key={'footnote-' + index} onClick={this.scrollToFootnote.bind(this, index + 1)} >
              <span style={styles.footNote}>{index + 1}. {footnoteText}</span>
            </div>
          );
        })
      }
    </div>);
}
});

const styles = 	{
  footNote: {
		color: '#222',
		paddingRight: '10px',
		fontSize: '0.75em',
		cursor: 'pointer',
    whiteSpace: 'pre-wrap',
	},
	footnoteHeader: {
		marginBottom: '0px',
		paddingBottom: '0px',
	}
};


export default Footnotes;
