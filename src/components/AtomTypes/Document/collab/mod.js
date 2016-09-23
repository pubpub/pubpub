/* eslint no-new: 0 */

import groupBy from 'lodash/groupBy';
import mapObject from 'lodash/map';

import {ModCollabCarets} from './carets';
import {ModCollabDocChanges} from './doc-changes';

// import {ModCollabChat} from './chat';
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

		this.editor.setParticipants(participants);
		const titleUserDivs = document.getElementsByClassName('title-connected-user');
		const menubar = document.getElementsByClassName('editor-participants')[0];

		if (!menubar) {
			console.log('No menu bar'); // This error should not happen, this is a hack to stop it
			return;
		}

		for (let index = titleUserDivs.length - 1; index >= 0; index--) {
			titleUserDivs[index].parentNode.removeChild(titleUserDivs[index]);
		}

		/*
		for (let index = 0; index < participants.length; index++) {
			const appendStr = '<div><img class="title-connected-user" style="display: inline-block; padding: 2px 2px;" title="' + participants[index].name + '" src="https://jake.pubpub.org/unsafe/fit-in/25x25/' + participants[index].avatar_url + '"></div>';
			menubar.innerHTML = menubar.innerHTML + appendStr;
		}
		*/

		const allSessionIds = [];
		const that = this;

		const grouped = groupBy(participants, 'id');
		this.participants = mapObject(grouped, function(entries) {
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
		this.sessionIds.forEach(function(sessionId) {
			if (allSessionIds.indexOf(sessionId) === -1) {
				that.carets.removeSelection(sessionId);
			}
		});

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
