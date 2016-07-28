/* eslint no-new: 0 */

import {ModCollabDocChanges} from './doc-changes';
// import {ModCollabChat} from './chat';
import {ModCollabCarets} from './carets';
// import {ModCollabColors} from './colors';
export class ModCollab {
	constructor(editor) {
		editor.mod.collab = this;
		this.editor = editor;
		this.participants = [];
		this.colorIds = {};
		this.sessionIds = [];
		this.newColor = 0;
		this.collaborativeMode = false;
		new ModCollabDocChanges(this);
		new ModCollabCarets(this);
		// ModCollabChat(this);
		// ModCollabColors(this);
	}

	updateParticipantList(participants) {
		// const that = this;
		const user_divs = document.getElementsByClassName('menuitem-connected-user');
		const menubar = document.getElementsByClassName('ProseMirror-menubar')[0];

		for (let i = user_divs.length-1; i >=0; i--){
			user_divs[i].parentNode.removeChild(user_divs[i]);
		}

		for (let i = 0; i < participants.length; i++){
			let appendStr = '<span class="ProseMirror-menuitem menuitem-connected-user" style="height:36px">';
			appendStr += '<div class="ProseMirror-icon-connected-user" title="' + participants[i].name +'"><span>';
			appendStr += '<img style="vertical-align: text-top;" src="https://jake.pubpub.org/unsafe/fit-in/25x25/'+ participants[i].avatar_url+ '">';
			appendStr +='</span></div></span>';
			menubar.innerHTML = menubar.innerHTML +  appendStr;
		}

		const allSessionIds = [];
		this.participants = _.map(_.groupBy(participants,
			'id'), function(entries) {
			const sessionIds = [];
			// Collect all Session IDs.
			entries.forEach(function(entry) {
				sessionIds.push(entry.session_id);
				allSessionIds.push(entry.session_id);
				delete entry.session_id;
			});
			entries[0].sessionIds = sessionIds;
			return entries[0];
		});
		// Check if each of the old session IDs is still present in last update.
		// If not, remove the corresponding marked range, if any.
		// this.sessionIds.forEach(function(sessionId) {
		//     if (allSessionIds.indexOf(sessionId) === -1) {
		//         that.carets.removeSelection(sessionId)
		//     }
		// })
		this.sessionIds = allSessionIds;
		if (participants.length > 1) {
			this.collaborativeMode = true;
		} else if (participants.length === 1) {
			this.collaborativeMode = false;
		}
		// this.participants.forEach(function(participant) {
		//     /* We assign a color to each user. This color stays even if the user
		//     * disconnects or the participant list is being updated.
		//     */
		//     if (!(participant.id in that.colorIds)) {
		//         that.colorIds[participant.id] = that.newColor
		//         that.newColor++
		//     }
		//     participant.colorId = that.colorIds[participant.id]
		// })
		// this.colors.provideUserColorStyles(this.newColor)
		// this.chat.updateParticipantList(participants)
	}
}
