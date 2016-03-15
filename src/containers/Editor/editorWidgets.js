import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';

function posEq(a, b) {return a.line == b.line && a.ch == b.ch;}


const WidgetComponent = React.createClass({
  componentDidMount: function() {
    console.log('Mounted this!!');
  },
  componentWillUnmount: function() {
    console.log('unmounted this!!');
  },
  render: function() {
    return (<span className="ppm-widget">Test</span>);
  }
});


function Widget(cm, from, to) {
    // the subclass must define this.domNode before calling this constructor
    var _this = this;
    this.cm = cm;
    // cm.replaceSelection("\u2af7"+cm.getSelection()+"\u2af8", "around");
    // var from = cm.getCursor("from");
    // var to = cm.getCursor("to");
    this.mark = cm.markText(from, to, {replacedWith: this.domNode, clearWhenEmpty: false});

    CodeMirror.on(this.mark, "clear", function(e) {
      console.log('Cleared token!');
    });

    CodeMirror.on(this.mark, "hide", function(e) {
      console.log('Hidden token!');
    });

    if (this.enter) {

        CodeMirror.on(this.mark, "beforeCursorEnter", function(e) {
            // register the enter function
            // the actual movement happens if the cursor movement was a plain navigation
            // but not if it was a backspace or selection extension, etc.
            var direction = posEq(_this.cm.getCursor(), _this.mark.find().from) ? 'left' : 'right';
            cm.widgetEnter = _this.enterIfDefined.bind(_this, direction);
        });
    }

    cm.setCursor(to);
    cm.refresh()
}

Widget.prototype.enterIfDefined = function(direction) {
    // check to make sure the mark still exists
    if (this.mark.find()) {
        this.enter(direction);
    } else {
        // if we don't do this and do:

        // G = <integer widget>
        //
        // 3x3 table widget

        // then backspace to get rid of table widget,
        // the integer widget disappears until we type on the first
        // line again.  Calling this refresh takes care of things.
        this.cm.refresh();
    }
}

Widget.prototype.range = function() {
    var find = this.mark.find()
    find.from.ch+=1
    find.to.ch-=1
    return find;
}
Widget.prototype.setText = function(text) {
    var r = this.range()
    this.cm.replaceRange(text, r.from, r.to);
}
Widget.prototype.getText = function() {
    var r = this.range()
    return this.cm.getRange(r.from, r.to);
}

function IntegerWidget(cm, from, to) {
    this.value = 0;

    var btn = document.createElement("span");
    var element = <WidgetComponent />;


    this.domNode = btn;
    var _this = this;
    Widget.apply(this, arguments);

    var component = ReactDOM.render(element, btn);

    /*

    this.node.keydown('left', function(event) {
        if ($(event.target).getCursorPosition()===0) {
            _this.exit('left');
        }
    });
    this.node.keydown('right', function(event) {
        var t = $(event.target);
        if (t.getCursorPosition()==t.val().length) {
            _this.exit('right');
        }
    });

    */

    var t = this.getText();
    if (t !== "") {
        // this.value = parseInt(t);
        this.value = t;
    }
    // set text to the parsed or default value initially
    this.changeValue(0);
}
IntegerWidget.prototype = Object.create(Widget.prototype)
IntegerWidget.prototype.enter = function(direction) {
    /*
    var t = this.node.find('.value');
    t.focus();
    if (direction==='left') {
        t.setCursorPosition(0);
    } else {
        t.setCursorPosition(t.val().length)
    }
    */
}

IntegerWidget.prototype.exit = function(direction) {
    var range = this.mark.find();
    this.cm.focus();
    if (direction==='left') {
        this.cm.setCursor(range.from);
    } else {
        this.cm.setCursor(range.to);
    }
}

IntegerWidget.prototype.changeValue = function(inc) {
    this.setValue(this.value+inc);
}

IntegerWidget.prototype.setValue = function(val) {
    this.value = val;
    // this.setText(this.value.toString());
    // this.node.find('.value').val(this.value);
}

export default IntegerWidget;
