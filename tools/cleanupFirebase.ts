/**
 * Firebase Cleanup Tool
 *
 * Reduces Firebase storage costs by:
 * 1. Fast-forwarding outdated discussions to the safe prune threshold
 * 2. Pruning changes/merges/checkpoints before the safe prune threshold
 * 3. Removing orphaned drafts (drafts without an associated Pub)
 * 4. Removing orphaned Firebase paths (paths not referenced in Postgres)
 *
 * IMPORTANT: The safe prune threshold is min(latestCheckpointKey, latestReleaseKey).
 * - We must preserve changes from latestCheckpointKey onwards to reconstruct the doc
 * - We must preserve changes from latestReleaseKey onwards for discussion migration during release
 *
 * Usage:
 *   pnpm run tools cleanupFirebase                    # Dry run, all drafts
 *   pnpm run tools cleanupFirebase --execute          # Actually delete data
 *   pnpm run tools cleanupFirebase --pubId=<uuid>     # Test on single pub
 *   pnpm run tools cleanupFirebase --pubId=<uuid> --execute
 */

import type firebase from 'firebase';

import type { DiscussionInfo } from 'components/Editor/plugins/discussions/types';

import firebaseAdmin from 'firebase-admin';
import { compressSelectionJSON, uncompressSelectionJSON } from 'prosemirror-compress-pubpub';
import { QueryTypes } from 'sequelize';

import { editorSchema, getFirebaseDoc } from 'components/Editor';
import { createFastForwarder } from 'components/Editor/plugins/discussions/fastForward';
import { Draft, Pub, Release } from 'server/models';
import { sequelize } from 'server/sequelize';
import { getDatabaseRef } from 'server/utils/firebaseAdmin';
import { postToSlack } from 'server/utils/slack';
import { getFirebaseConfig } from 'utils/editor/firebaseConfig';

const {
	argv: { execute, pubId, draftId, batchSize = 100, verbose: verboseFlag, scanFirebase = true },
} = require('yargs');

const isDryRun = !execute;
const isVerbose = verboseFlag;

// biome-ignore lint/suspicious/noConsole: CLI tool output
const log = (msg: string) => console.log(`[cleanup] ${new Date().toISOString()} ${msg}`);
const verbose = (msg: string) => isVerbose && log(msg);

/**
 * Fetch only the keys at a Firebase path using REST API with shallow=true
 * This avoids loading potentially huge amounts of data
 */
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

const getAccessToken = async (): Promise<string> => {
	const now = Date.now();
	if (cachedAccessToken && cachedAccessToken.expiresAt > now + 60000) {
		return cachedAccessToken.token;
	}

	const credential = firebaseAdmin.credential.cert(
		JSON.parse(
			Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 as string, 'base64').toString(),
		),
	);
	const tokenResult = await credential.getAccessToken();
	cachedAccessToken = {
		token: tokenResult.access_token,
		expiresAt: now + (tokenResult.expires_in ?? 3600) * 1000,
	};
	return cachedAccessToken.token;
};

const getShallowKeys = async (path: string): Promise<string[]> => {
	const databaseURL = getFirebaseConfig().databaseURL;
	const accessToken = await getAccessToken();

	const url = `${databaseURL}/${path}.json?shallow=true&access_token=${accessToken}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Firebase REST API error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	if (!data || typeof data !== 'object') {
		return [];
	}
	return Object.keys(data);
};

/**
 * Run async tasks with limited concurrency (worker pool pattern)
 */
const runWithConcurrency = async <T>(
	tasks: (() => Promise<T>)[],
	concurrency: number,
): Promise<T[]> => {
	const results: T[] = [];
	let index = 0;

	const worker = async (): Promise<void> => {
		while (index < tasks.length) {
			const currentIndex = index++;
			// biome-ignore lint/performance/noAwaitInLoops: worker pool pattern requires sequential processing
			results[currentIndex] = await tasks[currentIndex]();
		}
	};

	const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
	await Promise.all(workers);
	return results;
};

interface CleanupStats {
	draftsProcessed: number;
	draftsSkipped: number;
	orphanedDraftsFound: number;
	orphanedDraftsDeleted: number;
	orphanedFirebasePathsFound: number;
	orphanedFirebasePathsDeleted: number;
	discussionsUpdated: number;
	changesDeleted: number;
	mergesDeleted: number;
	checkpointsDeleted: number;
	errorsEncountered: number;
}

const stats: CleanupStats = {
	draftsProcessed: 0,
	draftsSkipped: 0,
	orphanedDraftsFound: 0,
	orphanedDraftsDeleted: 0,
	orphanedFirebasePathsFound: 0,
	orphanedFirebasePathsDeleted: 0,
	discussionsUpdated: 0,
	changesDeleted: 0,
	mergesDeleted: 0,
	checkpointsDeleted: 0,
	errorsEncountered: 0,
};

/**
 * Get the highest checkpoint key for a draft
 */
const getLatestCheckpointKey = async (
	draftRef: firebase.database.Reference,
): Promise<number | null> => {
	const checkpointMapSnapshot = await draftRef.child('checkpointMap').once('value');
	const checkpointMap = checkpointMapSnapshot.val();

	if (!checkpointMap) {
		// Try the deprecated singular checkpoint
		const checkpointSnapshot = await draftRef.child('checkpoint').once('value');
		const checkpoint = checkpointSnapshot.val();
		if (checkpoint?.k) {
			return parseInt(checkpoint.k, 10);
		}
		return null;
	}

	const keys = Object.keys(checkpointMap).map((k) => parseInt(k, 10));
	if (keys.length === 0) return null;

	return Math.max(...keys);
};

/**
 * Get the latest release history key for a pub
 */
const getLatestReleaseHistoryKey = async (pubId: string): Promise<number | null> => {
	const release = await Release.findOne({
		where: { pubId },
		attributes: ['historyKey'],
		order: [['historyKey', 'DESC']],
	});
	return release?.historyKey ?? null;
};

/**
 * Get discussions from Firebase and uncompress them
 */
const getFirebaseDiscussions = async (
	draftRef: firebase.database.Reference,
): Promise<Record<string, DiscussionInfo>> => {
	const discussionsSnapshot = await draftRef.child('discussions').once('value');
	const discussionsData = discussionsSnapshot.val();

	if (!discussionsData) {
		return {};
	}

	const discussions: Record<string, DiscussionInfo> = {};
	for (const [id, compressed] of Object.entries(discussionsData as Record<string, any>)) {
		const selection = compressed.selection
			? uncompressSelectionJSON(compressed.selection)
			: null;
		discussions[id] = {
			...compressed,
			selection,
		};
	}
	return discussions;
};

/**
 * Update a discussion in Firebase with a new currentKey
 */
const updateFirebaseDiscussion = async (
	draftRef: firebase.database.Reference,
	discussionId: string,
	discussion: DiscussionInfo,
): Promise<void> => {
	const compressed = {
		...discussion,
		selection: discussion.selection ? compressSelectionJSON(discussion.selection) : null,
	};
	await draftRef.child('discussions').child(discussionId).set(compressed);
};

/**
 * Fast-forward all outdated discussions to the target key
 */
const fastForwardDiscussions = async (
	draftRef: firebase.database.Reference,
	targetKey: number,
): Promise<number> => {
	const discussions = await getFirebaseDiscussions(draftRef);
	const outdatedDiscussions = Object.entries(discussions).filter(
		([_, d]) => d && d.currentKey < targetKey,
	);

	if (outdatedDiscussions.length === 0) {
		return 0;
	}

	verbose(`  Found ${outdatedDiscussions.length} outdated discussions`);

	// Get the current doc at targetKey to use for fast-forwarding
	const { doc } = await getFirebaseDoc(draftRef, editorSchema, targetKey);
	const fastForward = createFastForwarder(draftRef);

	const discussionsById: Record<string, DiscussionInfo> = {};
	for (const [id, discussion] of outdatedDiscussions) {
		discussionsById[id] = discussion;
	}

	const fastForwardedDiscussions = await fastForward(discussionsById, doc, targetKey);

	let updatedCount = 0;
	for (const [id, updatedDiscussion] of Object.entries(fastForwardedDiscussions)) {
		if (updatedDiscussion) {
			verbose(
				`  Fast-forwarding discussion ${id} from ${discussions[id].currentKey} to ${targetKey}`,
			);
			if (!isDryRun) {
				// biome-ignore lint/performance/noAwaitInLoops: sequential updates to Firebase
				await updateFirebaseDiscussion(draftRef, id, updatedDiscussion);
			}
			updatedCount++;
		}
	}

	return updatedCount;
};

/**
 * Count and optionally delete keys before a threshold in a Firebase child.
 * Uses shallow key listing to avoid loading content into memory.
 */
const pruneKeysBefore = async (
	parentRef: firebase.database.Reference,
	childName: string,
	thresholdKey: number,
): Promise<number> => {
	// Get parent path and use shallow key listing
	const parentPath = parentRef.toString().replace(/^https:\/\/[^/]+\//, '');
	const childPath = parentPath ? `${parentPath}/${childName}` : childName;

	const allKeys = await getShallowKeys(childPath);
	const keysToDelete = allKeys
		.map((k) => parseInt(k, 10))
		.filter((k) => !Number.isNaN(k) && k < thresholdKey)
		.map((k) => String(k));

	if (keysToDelete.length === 0) {
		return 0;
	}

	verbose(`  Found ${keysToDelete.length} ${childName} entries before key ${thresholdKey}`);

	if (!isDryRun) {
		const childRef = parentRef.child(childName);
		// Delete with limited concurrency to avoid overwhelming Firebase
		const CONCURRENCY = 10;
		const deleteTasks = keysToDelete.map((key) => () => childRef.child(key).remove());
		await runWithConcurrency(deleteTasks, CONCURRENCY);
		verbose(`  Deleted ${keysToDelete.length} ${childName} entries`);
	}

	return keysToDelete.length;
};

/**
 * Prune old data from a single draft
 */
const pruneDraft = async (firebasePath: string, pubId: string | null = null): Promise<void> => {
	const draftRef = getDatabaseRef(firebasePath);

	const latestCheckpointKey = await getLatestCheckpointKey(draftRef);

	if (latestCheckpointKey === null) {
		verbose(`  No checkpoint found for ${firebasePath}, skipping pruning`);
		stats.draftsSkipped++;
		return;
	}

	verbose(`  Latest checkpoint key: ${latestCheckpointKey}`);

	// Determine safe prune threshold: min(latestCheckpointKey, latestReleaseHistoryKey)
	// - We need changes from latestCheckpointKey onwards to reconstruct the doc
	// - We need changes from latestReleaseKey onwards to migrate discussions during release
	let pruneThreshold = latestCheckpointKey;
	if (pubId) {
		const latestReleaseKey = await getLatestReleaseHistoryKey(pubId);
		if (latestReleaseKey !== null && latestReleaseKey < pruneThreshold) {
			verbose(
				`  Using release history key ${latestReleaseKey} (lower than checkpoint ${latestCheckpointKey})`,
			);
			pruneThreshold = latestReleaseKey;
		}
	}

	verbose(`  Safe prune threshold: ${pruneThreshold}`);

	// First, fast-forward any outdated discussions to the prune threshold
	const discussionsUpdated = await fastForwardDiscussions(draftRef, pruneThreshold);
	stats.discussionsUpdated += discussionsUpdated;

	// Prune changes before the safe threshold
	stats.changesDeleted += await pruneKeysBefore(draftRef, 'changes', pruneThreshold);

	// Prune merges before the safe threshold (legacy data)
	stats.mergesDeleted += await pruneKeysBefore(draftRef, 'merges', pruneThreshold);

	// Prune older checkpoints (keep only the latest)
	stats.checkpointsDeleted += await pruneKeysBefore(draftRef, 'checkpoints', latestCheckpointKey);

	// Clean up checkpointMap entries for deleted checkpoints
	const checkpointMapSnapshot = await draftRef.child('checkpointMap').once('value');
	const checkpointMap = checkpointMapSnapshot.val();
	if (checkpointMap) {
		const oldMapKeys = Object.keys(checkpointMap).filter(
			(k) => parseInt(k, 10) < latestCheckpointKey,
		);
		if (oldMapKeys.length > 0 && !isDryRun) {
			const mapDeletions = oldMapKeys.map((key) =>
				draftRef.child('checkpointMap').child(key).remove(),
			);
			await Promise.all(mapDeletions);
			verbose(`  Cleaned up ${oldMapKeys.length} checkpointMap entries`);
		}
	}

	// Remove deprecated singular checkpoint if we have checkpoints/ entries
	if (!isDryRun) {
		const hasCheckpoints = (await draftRef.child('checkpoints').once('value')).exists();
		if (hasCheckpoints) {
			await draftRef.child('checkpoint').remove();
		}
	}
};

/**
 * Delete an orphaned draft from both Firebase and Postgres
 */
const deleteOrphanedDraft = async (draft: Draft): Promise<void> => {
	const { id, firebasePath } = draft;

	log(`  Deleting orphaned draft: ${id} (${firebasePath})`);

	if (!isDryRun) {
		// Delete from Firebase first
		const draftRef = getDatabaseRef(firebasePath);
		await draftRef.remove();

		// Then delete from Postgres
		await draft.destroy();
		stats.orphanedDraftsDeleted++;
	}
};

/**
 * Find all orphaned drafts (drafts without an associated Pub)
 */
const findOrphanedDrafts = async (): Promise<Draft[]> => {
	const orphanedDrafts = await sequelize.query<Draft>(
		`
		SELECT d.*
		FROM "Drafts" d
		LEFT JOIN "Pubs" p ON p."draftId" = d.id
		WHERE p.id IS NULL
		`,
		{
			model: Draft,
			mapToModel: true,
			type: QueryTypes.SELECT,
		},
	);
	return orphanedDrafts;
};

/**
 * Get all valid firebase paths from the database
 */
const getValidFirebasePaths = async (): Promise<Set<string>> => {
	const drafts = await Draft.findAll({
		attributes: ['firebasePath'],
	});
	return new Set(drafts.map((d) => d.firebasePath));
};

/**
 * Scan Firebase for orphaned top-level paths and delete them
 */
const cleanupOrphanedFirebasePaths = async (): Promise<void> => {
	log('Scanning Firebase for orphaned paths...');

	const validPaths = await getValidFirebasePaths();
	verbose(`  Found ${validPaths.size} valid paths in database`);

	// Check for orphaned paths under 'drafts/' prefix using shallow key listing
	const draftKeys = await getShallowKeys('drafts');
	verbose(`  Found ${draftKeys.length} keys under drafts/`);

	for (const draftKey of draftKeys) {
		const firebasePath = `drafts/${draftKey}`;
		if (!validPaths.has(firebasePath)) {
			stats.orphanedFirebasePathsFound++;
			log(`  Found orphaned Firebase path: ${firebasePath}`);
			if (!isDryRun) {
				// biome-ignore lint/performance/noAwaitInLoops: sequential deletes to avoid overwhelming Firebase
				await getDatabaseRef(firebasePath).remove();
				stats.orphanedFirebasePathsDeleted++;
				verbose(`  Deleted orphaned path: ${firebasePath}`);
			}
		}
	}

	// Check for orphaned 'pub-*' paths (legacy format) using shallow key listing
	const rootKeys = await getShallowKeys('');
	const legacyPubKeys = rootKeys.filter((key) => key.startsWith('pub-'));
	verbose(`  Found ${legacyPubKeys.length} legacy pub-* paths at root`);

	for (const pubKey of legacyPubKeys) {
		// Get branch keys under this pub using shallow listing
		// biome-ignore lint/performance/noAwaitInLoops: sequential processing for rate limiting
		const branchKeys = await getShallowKeys(pubKey);
		for (const branchKey of branchKeys) {
			if (branchKey.startsWith('branch-')) {
				const firebasePath = `${pubKey}/${branchKey}`;
				if (!validPaths.has(firebasePath)) {
					stats.orphanedFirebasePathsFound++;
					log(`  Found orphaned Firebase path: ${firebasePath}`);
					if (!isDryRun) {
						// biome-ignore lint/performance/noAwaitInLoops: sequential deletes
						await getDatabaseRef(firebasePath).remove();
						stats.orphanedFirebasePathsDeleted++;
						verbose(`  Deleted orphaned path: ${firebasePath}`);
					}
				}
			}
		}
	}

	log(`Found ${stats.orphanedFirebasePathsFound} orphaned Firebase paths`);
};

/**
 * Clean up orphaned branches for a specific pub (legacy format only)
 * If the draft uses pub-{pubId}/branch-{branchId} format, delete any other branches
 */
const cleanupOrphanedBranchesForPub = async (
	pubId: string,
	activePath: string,
): Promise<void> => {
	// Check if this is a legacy format path
	const legacyMatch = activePath.match(/^(pub-[^/]+)\/(branch-[^/]+)$/);
	if (!legacyMatch) {
		// New format (drafts/draft-xxx), no sibling branches to clean
		return;
	}

	const [, pubKey, activeBranchKey] = legacyMatch;
	verbose(`  Checking for orphaned branches under ${pubKey}`);

	const branchKeys = await getShallowKeys(pubKey);
	for (const branchKey of branchKeys) {
		if (branchKey.startsWith('branch-') && branchKey !== activeBranchKey) {
			const orphanedPath = `${pubKey}/${branchKey}`;
			stats.orphanedFirebasePathsFound++;
			log(`  Found orphaned branch: ${orphanedPath}`);
			if (!isDryRun) {
				// biome-ignore lint/performance/noAwaitInLoops: sequential deletes
				await getDatabaseRef(orphanedPath).remove();
				stats.orphanedFirebasePathsDeleted++;
				verbose(`  Deleted orphaned branch: ${orphanedPath}`);
			}
		}
	}
};

/**
 * Process a single pub's draft
 */
const processPubDraft = async (pubId: string): Promise<void> => {
	const pub = await Pub.findOne({
		where: { id: pubId },
		include: [{ model: Draft, as: 'draft' }],
	});

	if (!pub) {
		log(`Pub not found: ${pubId}`);
		return;
	}

	if (!pub.draft) {
		log(`Pub ${pubId} has no draft`);
		return;
	}

	log(`Processing pub ${pub.slug || pub.id}`);
	verbose(`  Draft path: ${pub.draft.firebasePath}`);

	try {
		await pruneDraft(pub.draft.firebasePath, pubId);
		await cleanupOrphanedBranchesForPub(pubId, pub.draft.firebasePath);
		stats.draftsProcessed++;
	} catch (err) {
		log(`  Error processing draft: ${(err as Error).message}`);
		stats.errorsEncountered++;
	}
};

/**
 * Process a single draft by ID
 */
const processDraftById = async (draftId: string): Promise<void> => {
	const draft = await Draft.findOne({ where: { id: draftId } });

	if (!draft) {
		log(`Draft not found: ${draftId}`);
		return;
	}

	// Try to find associated pub for release key lookup
	const pub = await Pub.findOne({ where: { draftId } });

	log(`Processing draft ${draftId}`);
	verbose(`  Draft path: ${draft.firebasePath}`);

	try {
		await pruneDraft(draft.firebasePath, pub?.id ?? null);
		stats.draftsProcessed++;
	} catch (err) {
		log(`  Error processing draft: ${(err as Error).message}`);
		stats.errorsEncountered++;
	}
};

/**
 * Process all drafts in batches
 */
const processAllDrafts = async (): Promise<void> => {
	let offset = 0;
	let hasMore = true;

	// First, handle orphaned drafts in Postgres
	log('Looking for orphaned drafts in Postgres...');
	const orphanedDrafts = await findOrphanedDrafts();
	stats.orphanedDraftsFound = orphanedDrafts.length;

	if (orphanedDrafts.length > 0) {
		log(`Found ${orphanedDrafts.length} orphaned drafts`);
		for (const draft of orphanedDrafts) {
			try {
				// biome-ignore lint/performance/noAwaitInLoops: intentionally sequential
				await deleteOrphanedDraft(draft);
			} catch (err) {
				log(`  Error deleting orphaned draft ${draft.id}: ${(err as Error).message}`);
				stats.errorsEncountered++;
			}
		}
	} else {
		log('No orphaned drafts found in Postgres');
	}

	// Scan Firebase for orphaned paths
	if (scanFirebase) {
		await cleanupOrphanedFirebasePaths();
	}

	// Then, prune old data from active drafts
	log('Pruning old data from active drafts...');

	// Get all pubs with their drafts for efficient processing
	while (hasMore) {
		// biome-ignore lint/performance/noAwaitInLoops: batched processing requires sequential fetches
		const pubs = await Pub.findAll({
			attributes: ['id', 'slug'],
			include: [{ model: Draft, as: 'draft', attributes: ['id', 'firebasePath'] }],
			limit: batchSize,
			offset,
			order: [['id', 'ASC']],
		});

		if (pubs.length === 0) {
			hasMore = false;
			break;
		}

		log(`Processing batch of ${pubs.length} pubs (offset: ${offset})`);

		for (const pub of pubs) {
			if (!pub.draft) {
				verbose(`  Pub ${pub.id} has no draft, skipping`);
				continue;
			}
			try {
				verbose(`Processing pub ${pub.slug || pub.id}`);
				// biome-ignore lint/performance/noAwaitInLoops: intentionally sequential
				await pruneDraft(pub.draft.firebasePath, pub.id);
				stats.draftsProcessed++;
			} catch (err) {
				log(`  Error processing pub ${pub.id}: ${(err as Error).message}`);
				stats.errorsEncountered++;
			}
		}

		offset += batchSize;
		hasMore = pubs.length === batchSize;

		// Brief pause to avoid overwhelming Firebase
		await new Promise((resolve) => setTimeout(resolve, 100));
	}
};

const printSummary = () => {
	log('=== Cleanup Summary ===');
	log(`Mode: ${isDryRun ? 'DRY RUN (no data deleted)' : 'EXECUTE'}`);
	log(`Drafts processed: ${stats.draftsProcessed}`);
	log(`Drafts skipped (no checkpoint): ${stats.draftsSkipped}`);
	log(`Orphaned drafts found (Postgres): ${stats.orphanedDraftsFound}`);
	log(`Orphaned drafts deleted: ${stats.orphanedDraftsDeleted}`);
	log(`Orphaned Firebase paths found: ${stats.orphanedFirebasePathsFound}`);
	log(`Orphaned Firebase paths deleted: ${stats.orphanedFirebasePathsDeleted}`);
	log(`Discussions fast-forwarded: ${stats.discussionsUpdated}`);
	log(`Changes deleted: ${stats.changesDeleted}`);
	log(`Merges deleted: ${stats.mergesDeleted}`);
	log(`Checkpoints deleted: ${stats.checkpointsDeleted}`);
	log(`Errors encountered: ${stats.errorsEncountered}`);
};

const postSummaryToSlack = async () => {
	if (isDryRun) return;

	const text = [
		'*Firebase Cleanup Completed*',
		`• Drafts processed: ${stats.draftsProcessed}`,
		`• Orphaned drafts deleted: ${stats.orphanedDraftsDeleted}`,
		`• Orphaned Firebase paths deleted: ${stats.orphanedFirebasePathsDeleted}`,
		`• Discussions fast-forwarded: ${stats.discussionsUpdated}`,
		`• Changes pruned: ${stats.changesDeleted}`,
		`• Merges pruned: ${stats.mergesDeleted}`,
		`• Checkpoints pruned: ${stats.checkpointsDeleted}`,
		stats.errorsEncountered > 0 ? `• ⚠️ Errors: ${stats.errorsEncountered}` : '',
	]
		.filter(Boolean)
		.join('\n');

	try {
		await postToSlack({ text, icon_emoji: ':broom:' });
	} catch (err) {
		log(`Failed to post to Slack: ${(err as Error).message}`);
	}
};

const main = async () => {
	log('Starting Firebase cleanup');
	log(`Mode: ${isDryRun ? 'DRY RUN' : 'EXECUTE'}`);

	try {
		if (pubId) {
			await processPubDraft(pubId);
		} else if (draftId) {
			await processDraftById(draftId);
		} else {
			await processAllDrafts();
		}

		printSummary();
		await postSummaryToSlack();
	} catch (err) {
		log(`Fatal error: ${(err as Error).message}`);
		console.error(err);
		process.exit(1);
	}
};

main().finally(() => process.exit(0));
