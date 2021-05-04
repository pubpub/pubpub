import { CommunityActivityItem } from './community';
import { CollectionActivityItem } from './collection';
import { PubActivityItem } from './pub';

export type ActivityItem = CommunityActivityItem | CollectionActivityItem | PubActivityItem;
