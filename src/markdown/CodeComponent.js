var React = require('react');
// var hljs = require('highlight.js');

var CodeComponent = React.createClass({
  componentDidMount: function () {
    this.refs.code.innerHTML = hljs.highlight(this.props.language, this.props.code).value;
  },
  componentDidUpdate: function () {
    this.refs.code.innerHTML = hljs.highlight(this.props.language, this.props.code).value;
  },
  render: function () {
    return React.createElement('pre', {key: this.props.key, className: 'codeBlockPre'},
      React.createElement('code', {
          ref: 'code',
          className: 'codeBlock'
        }, this.props.code)
    );
  }
});

module.exports = CodeComponent;