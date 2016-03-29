import {migrateAllPubText} from './migrateMarkdown';
import {migrateDiscussions} from './migrateDiscussions';
import {migrateJournals} from './migrateJournals';

// migrateJournals();
//migrateDiscussions(1000000);

// const PUBS_TO_MIGRATE = 4;
migrateAllPubText(1000000);
