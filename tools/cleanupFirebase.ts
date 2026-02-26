/**
 * Firebase Cleanup Tool
 *
 * Reduces Firebase storage costs by:
 * 1. Fast-forwarding outdated discussions to the latest checkpoint key
 * 2. Pruning changes/merges/checkpoints before the safe prune threshold
 *    (max of latestCheckpointKey and latestReleaseHistoryKey)
 * 3. Removing orphaned drafts (drafts without an associated Pub)
 * 4. Removing orphaned Firebase paths (paths not referenced in Postgres)
 *
 * Usage:
 *   pnpm run tools cleanupFirebase                    # Dry run, all drafts
 *   pnpm run tools cleanupFirebase --execute          # Actually delete data
 *   pnpm run tools cleanupFirebase --pubId=<uuid>     # Test on single pub
 *   pnpm run tools cleanupFirebase --pubId=<uuid> --execute
 */

import type firebase from 'firebase';

import { compressSelectionJSON, uncompressSelectionJSON } from 'prosemirror-compress-pubpub';
import { QueryTypes } from 'sequelize';
import yargs from 'yargs';

import { editorSchema, getFirebaseDoc } from 'components/Editor';
import { createFastForwarder } from 'components/Editor/plugins/discussions/fastForward';
import type { DiscussionInfo } from 'components/Editor/plugins/discussions/types';
import { Draft, Pub, Release } from 'server/models';
import { sequelize } from 'server/sequelize';
import { getDatabaseRef } from 'server/utils/firebaseAdmin';
import { postToSlack } from 'server/utils/slack';

const argv = yargs
	.option('execute', {
		type: 'boolean',
		default: false,
		description: 'Actually delete data (default is dry-run)',
	})
	.option('pubId', {
		type: 'string',
		description: 'Process a single pub by ID',
	})
	.option('draftId', {
		type: 'string',
		description: 'Process a single draft by ID',
	})
	.option('batchSize', {
		type: 'number',
		default: 100,
		description: 'Number of drafts to process in each batch',
	})
	.option('verbose', {
		type: 'boolean',
		default: false,
		description: 'Show detailed logging',
	})
	.option('scanFirebase', {
		type: 'boolean',
		default: true,
		description: 'Scan Firebase for orphaned top-level paths',
	})
	.parseSync();

const isDryRun = !argv.execute;
const isVerbose = argv.verbose;

// biome-ignore lint/suspicious/noConsole: CLI tool output
const log = (msg: string) => console.log(`[cleanup] ${new Date().toISOString()} ${msg}`);
const verbose = (msg: string) => isVerbose && log(msg);

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
	bytesFreedEstimate: number;
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
	bytesFreedEstimate: 0,
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
		const selection = compressed.selection ? uncompressSelectionJSON(compressed.selection) : null;
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
			verbose(`  Fast-forwarding discussion ${id} from ${discussions[id].currentKey} to ${targetKey}`);
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
 * Count and optionally delete keys before a threshold in a Firebase child
 */
const pruneKeysBefore = async (
	parentRef: firebase.database.Reference,
	childName: string,
	thresholdKey: number,
): Promise<{ count: number; estimatedBytes: number }> => {
	const childRef = parentRef.child(childName);
	const snapshot = await childRef.orderByKey().endAt(String(thresholdKey - 1)).once('value');
	const data = snapshot.val();

	if (!data) {
		return { count: 0, estimatedBytes: 0 };
	}

	const keys = Object.keys(data);
	const estimatedBytes = JSON.stringify(data).length;

	if (keys.length === 0) {
		return { count: 0, estimatedBytes: 0 };
	}

	verbose(`  Found ${keys.length} ${childName} entries before key ${thresholdKey}`);

	if (!isDryRun) {
		// Delete each key individually to avoid transaction size limits
		const deletions = keys.map((key) => childRef.child(key).remove());
		await Promise.all(deletions);
		verbose(`  Deleted ${keys.length} ${childName} entries`);
	}

	return { count: keys.length, estimatedBytes };
};

/**
 * Prune old data from a single draft
 */
const pruneDraft = async (
	firebasePath: string,
	pubId: string | null = null,
): Promise<void> => {
	const draftRef = getDatabaseRef(firebasePath);

	const latestCheckpointKey = await getLatestCheckpointKey(draftRef);

	if (latestCheckpointKey === null) {
		verbose(`  No checkpoint found for ${firebasePath}, skipping pruning`);
		stats.draftsSkipped++;
		return;
	}

	// Determine safe prune threshold: max(latestCheckpointKey, latestReleaseHistoryKey)
	let safePruneThreshold = latestCheckpointKey;
	if (pubId) {
		const latestReleaseKey = await getLatestReleaseHistoryKey(pubId);
		if (latestReleaseKey !== null && latestReleaseKey > safePruneThreshold) {
			verbose(`  Using release history key ${latestReleaseKey} instead of checkpoint key ${latestCheckpointKey}`);
			safePruneThreshold = latestReleaseKey;
		}
	}

	verbose(`  Safe prune threshold: ${safePruneThreshold}`);

	// First, fast-forward any outdated discussions to the safe prune threshold
	const discussionsUpdated = await fastForwardDiscussions(draftRef, safePruneThreshold);
	stats.discussionsUpdated += discussionsUpdated;

	// Prune changes before safe threshold
	const changesResult = await pruneKeysBefore(draftRef, 'changes', safePruneThreshold);
	stats.changesDeleted += changesResult.count;
	stats.bytesFreedEstimate += changesResult.estimatedBytes;

	// Prune merges before safe threshold (legacy data)
	const mergesResult = await pruneKeysBefore(draftRef, 'merges', safePruneThreshold);
	stats.mergesDeleted += mergesResult.count;
	stats.bytesFreedEstimate += mergesResult.estimatedBytes;

	// Prune older checkpoints (keep only the latest)
	const checkpointsResult = await pruneKeysBefore(draftRef, 'checkpoints', latestCheckpointKey);
	stats.checkpointsDeleted += checkpointsResult.count;
	stats.bytesFreedEstimate += checkpointsResult.estimatedBytes;

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
	}

	stats.orphanedDraftsDeleted++;
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

	// Check for orphaned paths under 'drafts/' prefix
	const draftsRef = getDatabaseRef('drafts');
	const draftsSnapshot = await draftsRef.once('value');
	const draftsData = draftsSnapshot.val();

	if (draftsData) {
		for (const draftKey of Object.keys(draftsData)) {
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
	}

	// Check for orphaned 'pub-*' paths (legacy format)
	// These are top-level, so we need to get root children
	const rootRef = getDatabaseRef('');
	const rootSnapshot = await rootRef.once('value');
	const rootData = rootSnapshot.val();

	if (rootData) {
		for (const key of Object.keys(rootData)) {
			if (key.startsWith('pub-')) {
				// This is a legacy pub path, check each branch underneath
				const pubData = rootData[key];
				if (pubData && typeof pubData === 'object') {
					for (const branchKey of Object.keys(pubData)) {
						if (branchKey.startsWith('branch-')) {
							const firebasePath = `${key}/${branchKey}`;
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
			}
		}
	}

	log(`Found ${stats.orphanedFirebasePathsFound} orphaned Firebase paths`);
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

	// Try to find associated pub
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
	const { batchSize } = argv;
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
	if (argv.scanFirebase) {
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

const formatBytes = (bytes: number): string => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
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
	log(`Estimated data freed: ${formatBytes(stats.bytesFreedEstimate)}`);
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
		`• Estimated space freed: ${formatBytes(stats.bytesFreedEstimate)}`,
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
		if (argv.pubId) {
			await processPubDraft(argv.pubId);
		} else if (argv.draftId) {
			await processDraftById(argv.draftId);
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
