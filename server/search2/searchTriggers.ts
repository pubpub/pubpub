/**
 * Postgres triggers and functions for maintaining pre-computed tsvector columns
 * on the Pubs and Communities tables. These are installed after sequelize.sync()
 * so the columns/indexes exist before the triggers reference them.
 *
 * Weight mapping for Pubs:
 *   A = title
 *   B = description
 *   C = byline (aggregated from PubAttributions + Users)
 *   D = latest release doc content (extracted from ProseMirror JSON)
 *
 * Weight mapping for Communities:
 *   A = title
 *   B = description
 *
 * Triggers fire on:
 *   - Pubs INSERT/UPDATE of title or description
 *   - PubAttributions INSERT/UPDATE/DELETE (recalculates byline for affected pub)
 *   - Releases INSERT (new release = new doc content for the pub)
 *   - Communities INSERT/UPDATE of title or description
 */

import { sequelize } from 'server/sequelize';

/**
 * Install all search-related triggers and functions. Idempotent — uses
 * CREATE OR REPLACE and IF NOT EXISTS throughout.
 */
export const installSearchTriggers = async () => {
	// ---- Ensure searchVector columns exist (sync force:false won't add them) ----
	await sequelize.query(`
		ALTER TABLE "Pubs" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;
	`);
	await sequelize.query(`
		ALTER TABLE "Communities" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;
	`);

	// ---- GIN indexes on searchVector columns ----
	await sequelize.query(`
		CREATE INDEX IF NOT EXISTS pubs_search_vector_idx
		ON "Pubs" USING gin ("searchVector");
	`);
	await sequelize.query(`
		CREATE INDEX IF NOT EXISTS communities_search_vector_idx
		ON "Communities" USING gin ("searchVector");
	`);

	// ---- Helper: extract plain text from ProseMirror JSONB ----
	await sequelize.query(`
		CREATE OR REPLACE FUNCTION extract_doc_text(doc_content jsonb)
		RETURNS text
		LANGUAGE sql IMMUTABLE PARALLEL SAFE AS $$
			WITH RECURSIVE nodes(node) AS (
				SELECT doc_content
				UNION ALL
				SELECT jsonb_array_elements(nodes.node->'content')
				FROM nodes
				WHERE nodes.node->'content' IS NOT NULL
				  AND jsonb_typeof(nodes.node->'content') = 'array'
			)
			SELECT coalesce(string_agg(node->>'text', ' '), '')
			FROM nodes
			WHERE node->>'text' IS NOT NULL;
		$$;
	`);

	// ---- Pub search vector update function ----
	await sequelize.query(`
		CREATE OR REPLACE FUNCTION pub_search_vector_update()
		RETURNS trigger
		LANGUAGE plpgsql AS $$
		DECLARE
			pub_row RECORD;
			byline_text text;
			doc_text text;
			doc_id uuid;
		BEGIN
			-- Determine which pub to update
			IF TG_TABLE_NAME = 'Pubs' THEN
				pub_row := NEW;
			ELSIF TG_TABLE_NAME = 'PubAttributions' THEN
				IF TG_OP = 'DELETE' THEN
					pub_row := OLD;
				ELSE
					pub_row := NEW;
				END IF;
			ELSIF TG_TABLE_NAME = 'Releases' THEN
				pub_row := NEW;
			END IF;

			-- Get the full pub title/description (needed when triggered from related tables)
			IF TG_TABLE_NAME != 'Pubs' THEN
				SELECT INTO pub_row p.* FROM "Pubs" p WHERE p.id = pub_row."pubId";
				IF NOT FOUND THEN
					RETURN COALESCE(NEW, OLD);
				END IF;
			END IF;

			-- Aggregate byline from PubAttributions + Users
			SELECT coalesce(string_agg(coalesce(u."fullName", pa.name), ' '), '')
			INTO byline_text
			FROM "PubAttributions" pa
			LEFT JOIN "Users" u ON u.id = pa."userId"
			WHERE pa."pubId" = pub_row.id
			  AND pa."isAuthor" = true
			  AND (pa.name IS NOT NULL OR u."fullName" IS NOT NULL);

			-- Get latest release doc content
			SELECT r."docId" INTO doc_id
			FROM "Releases" r
			WHERE r."pubId" = pub_row.id
			ORDER BY r."createdAt" DESC
			LIMIT 1;

			IF doc_id IS NOT NULL THEN
				SELECT extract_doc_text(d.content) INTO doc_text
				FROM "Docs" d WHERE d.id = doc_id;
			END IF;

			-- Update the search vector
			UPDATE "Pubs" SET "searchVector" =
				setweight(to_tsvector('english', coalesce(pub_row.title, '')), 'A') ||
				setweight(to_tsvector('english', coalesce(pub_row.description, '')), 'B') ||
				setweight(to_tsvector('english', coalesce(byline_text, '')), 'C') ||
				setweight(to_tsvector('english', coalesce(doc_text, '')), 'D')
			WHERE id = pub_row.id;

			RETURN COALESCE(NEW, OLD);
		END;
		$$;
	`);

	// ---- Triggers on Pubs ----
	await sequelize.query(`
		DROP TRIGGER IF EXISTS pubs_search_vector_update ON "Pubs";
		CREATE TRIGGER pubs_search_vector_update
		AFTER INSERT OR UPDATE OF title, description ON "Pubs"
		FOR EACH ROW
		EXECUTE FUNCTION pub_search_vector_update();
	`);

	// ---- Triggers on PubAttributions ----
	await sequelize.query(`
		DROP TRIGGER IF EXISTS pubattributions_search_vector_update ON "PubAttributions";
		CREATE TRIGGER pubattributions_search_vector_update
		AFTER INSERT OR UPDATE OR DELETE ON "PubAttributions"
		FOR EACH ROW
		EXECUTE FUNCTION pub_search_vector_update();
	`);

	// ---- Triggers on Releases ----
	await sequelize.query(`
		DROP TRIGGER IF EXISTS releases_search_vector_update ON "Releases";
		CREATE TRIGGER releases_search_vector_update
		AFTER INSERT ON "Releases"
		FOR EACH ROW
		EXECUTE FUNCTION pub_search_vector_update();
	`);

	// ---- Community search vector update function ----
	await sequelize.query(`
		CREATE OR REPLACE FUNCTION community_search_vector_update()
		RETURNS trigger
		LANGUAGE plpgsql AS $$
		BEGIN
			NEW."searchVector" :=
				setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
				setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
			RETURN NEW;
		END;
		$$;
	`);

	// ---- Trigger on Communities (BEFORE so we can modify NEW directly) ----
	await sequelize.query(`
		DROP TRIGGER IF EXISTS communities_search_vector_update ON "Communities";
		CREATE TRIGGER communities_search_vector_update
		BEFORE INSERT OR UPDATE OF title, description ON "Communities"
		FOR EACH ROW
		EXECUTE FUNCTION community_search_vector_update();
	`);
};

/**
 * Backfill searchVector for all existing Pubs. Run once after adding the column.
 * Uses batched updates to avoid locking the whole table.
 */
export const backfillPubSearchVectors = async () => {
	// Step 1: Set title + description for ALL pubs that haven't been backfilled
	await sequelize.query(`
		UPDATE "Pubs" SET "searchVector" =
			setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
			setweight(to_tsvector('english', coalesce(description, '')), 'B')
		WHERE "searchVector" IS NULL;
	`);

	// Step 2: Layer in byline (weight C) from PubAttributions
	await sequelize.query(`
		UPDATE "Pubs" p SET "searchVector" = p."searchVector" ||
			setweight(to_tsvector('english', byline_sub.byline_text), 'C')
		FROM (
			SELECT pa."pubId",
			       string_agg(coalesce(u."fullName", pa.name), ' ') AS byline_text
			FROM "PubAttributions" pa
			LEFT JOIN "Users" u ON u.id = pa."userId"
			WHERE pa."isAuthor" = true
			  AND (pa.name IS NOT NULL OR u."fullName" IS NOT NULL)
			GROUP BY pa."pubId"
		) byline_sub
		WHERE p.id = byline_sub."pubId";
	`);

	// Step 3: Layer in latest release doc content (weight D)
	await sequelize.query(`
		UPDATE "Pubs" p SET "searchVector" = p."searchVector" ||
			setweight(to_tsvector('english', doc_sub.doc_text), 'D')
		FROM (
			SELECT DISTINCT ON (r."pubId") r."pubId",
			       extract_doc_text(d.content) AS doc_text
			FROM "Releases" r
			JOIN "Docs" d ON d.id = r."docId"
			ORDER BY r."pubId", r."createdAt" DESC
		) doc_sub
		WHERE p.id = doc_sub."pubId";
	`);
};

/**
 * Backfill searchVector for all existing Communities.
 */
export const backfillCommunitySearchVectors = async () => {
	await sequelize.query(`
		UPDATE "Communities" SET "searchVector" =
			setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
			setweight(to_tsvector('english', coalesce(description, '')), 'B')
		WHERE "searchVector" IS NULL;
	`);
};
