import {
	Collection,
	Community,
	InitialNotificationsData,
	LocationData,
	LoginData,
	Maybe,
	Page,
	PatchFn,
	ScopeData,
} from 'types';
import { NoteManager } from 'client/utils/notes';

export type PageContext = {
	scopeData: ScopeData;
	loginData: LoginData;
	locationData: LocationData;
	pageData: Maybe<Page>;
	communityData: Community;
	updateCommunity: PatchFn<Community>;
	updateCollection: PatchFn<Collection>;
	featureFlags: Record<string, boolean>;
	noteManager: NoteManager;
	initialNotificationsData: InitialNotificationsData;
};
