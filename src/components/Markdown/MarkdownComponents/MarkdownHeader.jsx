import React, {PropTypes} from 'react';

const Header = React.createClass({
  propTypes: {
    mode: PropTypes.string,
  },
  render: function() {
    if (this.props.mode === 'rss') {
      return (<span></span>);
    }
    return (<div class="headerBlock">
      {this.props.children}
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


export default Header;
