import WidgetComponent from './BaseEditorWidgetComponent';
import ReactDOM from 'react-dom';

function posEq(a, b) {return a.line == b.line && a.ch == b.ch;}


function Widget(cm, from, to, pluginType, info, clickHandler) {
		// the subclass must define this.domNode before calling this constructor

		this.openPopup = clickHandler;
		const btn = document.createElement("span");
		const element = <WidgetComponent openPopup={this.onClick.bind(this)} pluginType={pluginType} {...info} />;
		this.domNode = btn;

		const component = ReactDOM.render(element, btn);

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
			// console.log('Hidden token!');
			// console.log(arguments);
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

Widget.prototype.onClick = function() {
	const range = this.range();
	this.openPopup(range.from, range.to, this);
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
				// line again.	Calling this refresh takes care of things.
				this.cm.refresh();
		}
}

Widget.prototype.range = function() {
		var find = this.mark.find();
		// find.from.ch+=1
		// find.to.ch-=1
		return find;
}
Widget.prototype.setText = function(text) {
		var r = this.range();
		this.cm.replaceRange(text, r.from, r.to);
		const newFrom = r.from;
		const newTo = {line: r.to.line, ch: r.from.ch + text.length};
		this.mark = this.cm.markText(newFrom, newTo, {replacedWith: this.domNode, clearWhenEmpty: false});
}
Widget.prototype.getText = function() {
		var r = this.range()
		return this.cm.getRange(r.from, r.to);
}

Widget.prototype.enter = function(direction) {
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

Widget.prototype.exit = function(direction) {
		var range = this.mark.find();
		this.cm.focus();
		if (direction==='left') {
				this.cm.setCursor(range.from);
		} else {
				this.cm.setCursor(range.to);
		}
}


export default Widget;
