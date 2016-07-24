export class ModCollabCarets {
	constructor(mod) {
		mod.carets = this;
		this.mod = mod;
		this.caretPositions = {};
		this.caretContainer = false;
		this.caretPlacementStyle = false;
		this.setup();
		this.bindEvents();
	}

	setup() {
		console.log('setup');

		// Add one elements to hold dynamic CSS info about carets
		const styleContainers = document.createElement('temp');
		styleContainers.innerHTML = `<style type="text/css" id="caret-placement-style"></style>`;
		while (styleContainers.firstElementChild) {
			document.head.appendChild(styleContainers.firstElementChild);
		}
		this.caretPlacementStyle = document.getElementById('caret-placement-style');
		// Add one container element to hold carets
		this.caretContainer = document.createElement('div');
		this.caretContainer.id = 'caret-markers';
		document.getElementById('document-contents').appendChild(this.caretContainer);
	}

	bindEvents() {
		console.log('bindEvents');

		const that = this;
		const pm = this.mod.editor.pm;
		pm.updateScheduler([pm.on.change], () => {return that.updatePositionCSS();});
		// let fnPm = this.mod.editor.mod.footnotes.fnPm
		// fnPm.updateScheduler([fnPm.on.change], () => {return that.updatePositionCSS()})
		// Limit sending of selection to once every 250 ms. This is also important to work correctly
		// with editing, which otherwise triggers three selection changes that result in an incorrect caret placement
		const sendSelection = _.debounce(function() {
			that.sendSelectionChange();
		}, 250);
		pm.on.selectionChange.add(sendSelection);
		// fnPm.on.selectionChange.add(sendSelection)
	}

	// Create a new caret as the current user
	getCaretPosition() {
		console.log('getCaretPosition');

		return {
			id: this.mod.editor.user.id,
			sessionId: this.mod.editor.docInfo.session_id,
			from: this.mod.editor.currentPm.selection.from,
			to: this.mod.editor.currentPm.selection.to,
			head: _.isFinite(this.mod.editor.currentPm.selection.head) ?
				this.mod.editor.currentPm.selection.head : this.mod.editor.currentPm.selection.to,
			// Whether the selection is in the footnote or the main editor
			// pm: this.mod.editor.currentPm === this.mod.editor.pm ? 'pm' : 'fnPm'
			pm: 'pm'
		};
	}

	sendSelectionChange() {
		console.log('sendSelectionChange');

		const that = this;
		if (this.mod.editor.currentPm.mod.collab.unconfirmedMaps.length > 0) {
			// TODO: Positions really need to be reverse-mapped through all
			// unconfirmed maps. As long as we don't do this, we just don't send
			// anything if there are unconfirmed maps to avoid potential problems.
			window.setTimeout(function() {that.sendSelectionChange(); }, 500);
			return;
		}
		this.mod.editor.mod.serverCommunications.send({
			type: 'selection_change',
			caret_position: this.getCaretPosition(),
			diff_version: this.mod.editor.pm.mod.collab.version
		});
	}

	receiveSelectionChange(data) {
		console.log('receiveSelectionChange');

		const that = this;
		this.updateCaret(data.caret_position);
		// let pm = data.caret_position.pm === 'pm' ? this.mod.editor.pm : this.mod.editor.mod.footnotes.fnPm
		const pm = this.mod.editor.pm;
		pm.scheduleDOMUpdate(function() {return that.updatePositionCSS();});
	}

	// Update the position of a collaborator's caret
	updateCaret(caretPosition) {
		console.log('updateCaret');

		const participant = _.findWhere(this.mod.participants, {id: caretPosition.id});
		if (!participant) {
			// participant (still unknown). Ignore.
			return;
		}
		const colorId = this.mod.colorIds[caretPosition.id];
		let posFrom = caretPosition.from;
		let posTo = caretPosition.to;
		let posHead = caretPosition.head;
		// let pm = caretPosition.pm === 'pm' ? this.mod.editor.pm : this.mod.editor.mod.footnotes.fnPm
		const pm = this.mod.editor.pm;

		// Map the positions through all still unconfirmed changes
		pm.mod.collab.unconfirmedMaps.forEach(function(map) {
			posFrom = map.map(posFrom);
			posTo = map.map(posTo);
			posHead = map.map(posHead);
		});

		// Delete an old marked range for the same session, if there is one.
		this.removeSelection(caretPosition.sessionId);

		let range = false;

		if (posFrom !== posTo) {
			range = pm.markRange(
				posFrom,
				posTo,
				{
					removeWhenEmpty: true,
					className: 'user-bg-' + colorId
				}
			);
		}

		const headRange = pm.markRange(
			posHead,
			posHead,
			{
				removeWhenEmpty: false
			}
		);


		const headNode = document.createElement('div');
		const className = 'user-' + colorId;
		headNode.id = 'caret-' + caretPosition.sessionId;
		headNode.classList.add('caret');
		headNode.classList.add(className);
		headNode.innerHTML = '<div class="caret-head"></div>';
		headNode.firstChild.classList.add(className);
		const tooltip = participant.name;
		headNode.title = tooltip;
		headNode.firstChild.title = tooltip;
		this.caretContainer.appendChild(headNode);
		this.caretPositions[caretPosition.sessionId] = {pm, range, headRange, headNode};
	}

	removeSelection(sessionId) {
		if (sessionId in this.caretPositions) {
			const caretPosition = this.caretPositions[sessionId];
			if (_.isFinite(caretPosition.range.from)) {
				caretPosition.pm.removeRange(caretPosition.range);
			}
			if (_.isFinite(caretPosition.headRange.from)) {
				caretPosition.pm.removeRange(caretPosition.headRange);
			}
			caretPosition.headNode.parentNode.removeChild(caretPosition.headNode);
			delete this.caretPositions[sessionId];
		}
	}

	updatePositionCSS() {
		console.log('updatePositionCSS punk');
		// 1st write phase
		const that = this;

		return function() {
			// 1st read phase
			// This phase + next write pahse are used for footnote placement,
			// so we cannot find carets in the footnotes before the next read
			// phase
			return function() {
				// 2nd write phase
				return function() {
					// 2nd read phase
					const positionCSS = '';
					for (const sessionId in that.caretPositions) {
						if (sessionId) {
							const caretPosition = that.caretPositions[sessionId];
							const coords = caretPosition.pm.coordsAtPos(caretPosition.headRange.from);
							const offsets = that.caretContainer.getBoundingClientRect();
							const height = coords.bottom - coords.top;
							const top = coords.top - offsets.top;
							const left = coords.left - offsets.left;
							positionCSS += `#caret-${sessionId} {top: ${top}px; left: ${left}px; height: ${height}px;}`;
						}
						
					}
					return function() {
						// 3rd write phase
						if (that.caretPlacementStyle.innerHTML !== positionCSS) {
							that.caretPlacementStyle.innerHTML = positionCSS;
						}
					};
				};
			};
		};
	}
}
