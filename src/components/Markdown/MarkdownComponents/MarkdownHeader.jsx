import React, {PropTypes} from 'react';

const Header = React.createClass({
  propTypes: {
    footnotes: PropTypes.array,
  },
  render: function() {

    console.log(this.props.children);
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
