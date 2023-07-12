--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Homebrew)
-- Dumped by pg_dump version 14.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_Collections_readNextPreviewSize; Type: TYPE; Schema: public; Owner: testuser
--

CREATE TYPE public."enum_Collections_readNextPreviewSize" AS ENUM (
    'none',
    'minimal',
    'medium',
    'choose-best'
);


ALTER TYPE public."enum_Collections_readNextPreviewSize" OWNER TO testuser;

--
-- Name: enum_Communities_headerColorType; Type: TYPE; Schema: public; Owner: testuser
--

CREATE TYPE public."enum_Communities_headerColorType" AS ENUM (
    'light',
    'dark',
    'custom'
);


ALTER TYPE public."enum_Communities_headerColorType" OWNER TO testuser;

--
-- Name: enum_DepositTargets_service; Type: TYPE; Schema: public; Owner: testuser
--

CREATE TYPE public."enum_DepositTargets_service" AS ENUM (
    'crossref',
    'datacite'
);


ALTER TYPE public."enum_DepositTargets_service" OWNER TO testuser;

--
-- Name: enum_Members_permissions; Type: TYPE; Schema: public; Owner: testuser
--

CREATE TYPE public."enum_Members_permissions" AS ENUM (
    'view',
    'edit',
    'manage',
    'admin'
);


ALTER TYPE public."enum_Members_permissions" OWNER TO testuser;

--
-- Name: enum_ReviewNews_status; Type: TYPE; Schema: public; Owner: testuser
--

CREATE TYPE public."enum_ReviewNews_status" AS ENUM (
    'open',
    'closed',
    'completed'
);


ALTER TYPE public."enum_ReviewNews_status" OWNER TO testuser;

--
-- Name: enum_Visibilities_access; Type: TYPE; Schema: public; Owner: testuser
--

CREATE TYPE public."enum_Visibilities_access" AS ENUM (
    'private',
    'members',
    'public'
);


ALTER TYPE public."enum_Visibilities_access" OWNER TO testuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ActivityItems; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ActivityItems" (
    id uuid NOT NULL,
    kind text NOT NULL,
    "pubId" uuid,
    payload jsonb,
    "timestamp" timestamp with time zone NOT NULL,
    "communityId" uuid NOT NULL,
    "actorId" uuid,
    "collectionId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ActivityItems" OWNER TO testuser;

--
-- Name: CitationStyle; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."CitationStyle" (
    "citationStyle" character varying,
    "inlineCitationStyle" character varying,
    id uuid NOT NULL,
    "facetBindingId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CitationStyle" OWNER TO testuser;

--
-- Name: CollectionAttributions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."CollectionAttributions" (
    id uuid NOT NULL,
    name text,
    avatar text,
    title text,
    "order" double precision,
    "isAuthor" boolean,
    roles jsonb,
    affiliation text,
    orcid character varying(255),
    "userId" uuid,
    "collectionId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CollectionAttributions" OWNER TO testuser;

--
-- Name: CollectionPubs; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."CollectionPubs" (
    id uuid NOT NULL,
    "pubId" uuid NOT NULL,
    "collectionId" uuid NOT NULL,
    "contextHint" text,
    rank text NOT NULL,
    "pubRank" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CollectionPubs" OWNER TO testuser;

--
-- Name: Collections; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Collections" (
    id uuid NOT NULL,
    title text,
    slug text NOT NULL,
    avatar text,
    "isRestricted" boolean,
    "isPublic" boolean,
    "viewHash" character varying(255),
    "editHash" character varying(255),
    metadata jsonb,
    kind text,
    doi text,
    "readNextPreviewSize" public."enum_Collections_readNextPreviewSize" DEFAULT 'choose-best'::public."enum_Collections_readNextPreviewSize",
    layout jsonb DEFAULT '{}'::jsonb NOT NULL,
    "layoutAllowsDuplicatePubs" boolean DEFAULT false NOT NULL,
    "pageId" uuid,
    "communityId" uuid,
    "scopeSummaryId" uuid,
    "crossrefDepositRecordId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Collections" OWNER TO testuser;

--
-- Name: Commenters; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Commenters" (
    id uuid NOT NULL,
    name text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Commenters" OWNER TO testuser;

--
-- Name: Communities; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Communities" (
    id uuid NOT NULL,
    subdomain text NOT NULL,
    domain text,
    title text NOT NULL,
    "citeAs" text,
    "publishAs" text,
    description text,
    avatar text,
    favicon text,
    "accentColorLight" character varying(255),
    "accentColorDark" character varying(255),
    "hideCreatePubButton" boolean,
    "headerLogo" text,
    "headerLinks" jsonb,
    "headerColorType" public."enum_Communities_headerColorType" DEFAULT 'dark'::public."enum_Communities_headerColorType",
    "useHeaderTextAccent" boolean,
    "hideHero" boolean,
    "hideHeaderLogo" boolean,
    "heroLogo" text,
    "heroBackgroundImage" text,
    "heroBackgroundColor" text,
    "heroTextColor" text,
    "useHeaderGradient" boolean,
    "heroImage" text,
    "heroTitle" text,
    "heroText" text,
    "heroPrimaryButton" jsonb,
    "heroSecondaryButton" jsonb,
    "heroAlign" text,
    navigation jsonb,
    "hideNav" boolean,
    "navLinks" jsonb,
    "footerLinks" jsonb,
    "footerLogoLink" text,
    "footerTitle" text,
    "footerImage" text,
    website text,
    facebook text,
    twitter text,
    email text,
    issn text,
    "isFeatured" boolean,
    "viewHash" character varying(255),
    "editHash" character varying(255),
    "premiumLicenseFlag" boolean DEFAULT false,
    "defaultPubCollections" jsonb,
    "spamTagId" uuid,
    "organizationId" uuid,
    "scopeSummaryId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Communities" OWNER TO testuser;

--
-- Name: CommunityAdmins; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."CommunityAdmins" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "communityId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CommunityAdmins" OWNER TO testuser;

--
-- Name: CrossrefDepositRecords; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."CrossrefDepositRecords" (
    id uuid NOT NULL,
    "depositJson" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CrossrefDepositRecords" OWNER TO testuser;

--
-- Name: CustomScripts; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."CustomScripts" (
    id uuid NOT NULL,
    "communityId" uuid,
    type character varying(255),
    content text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."CustomScripts" OWNER TO testuser;

--
-- Name: DepositTargets; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."DepositTargets" (
    id uuid NOT NULL,
    "communityId" uuid,
    "doiPrefix" character varying(255),
    service public."enum_DepositTargets_service" DEFAULT 'crossref'::public."enum_DepositTargets_service",
    username character varying(255),
    password character varying(255),
    "passwordInitVec" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."DepositTargets" OWNER TO testuser;

--
-- Name: DiscussionAnchors; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."DiscussionAnchors" (
    id uuid NOT NULL,
    "isOriginal" boolean NOT NULL,
    "discussionId" uuid NOT NULL,
    "historyKey" integer NOT NULL,
    selection jsonb,
    "originalText" text NOT NULL,
    "originalTextPrefix" text NOT NULL,
    "originalTextSuffix" text NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."DiscussionAnchors" OWNER TO testuser;

--
-- Name: Discussions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Discussions" (
    id uuid NOT NULL,
    title text,
    number integer NOT NULL,
    "isClosed" boolean,
    labels jsonb,
    "threadId" uuid NOT NULL,
    "visibilityId" uuid NOT NULL,
    "userId" uuid,
    "anchorId" uuid,
    "pubId" uuid,
    "commenterId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Discussions" OWNER TO testuser;

--
-- Name: Docs; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Docs" (
    id uuid NOT NULL,
    content jsonb NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Docs" OWNER TO testuser;

--
-- Name: Drafts; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Drafts" (
    id uuid NOT NULL,
    "latestKeyAt" timestamp with time zone,
    "firebasePath" character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Drafts" OWNER TO testuser;

--
-- Name: Exports; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Exports" (
    id uuid NOT NULL,
    format character varying(255) NOT NULL,
    url character varying(255),
    "historyKey" integer NOT NULL,
    "pubId" uuid NOT NULL,
    "workerTaskId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Exports" OWNER TO testuser;

--
-- Name: ExternalPublications; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ExternalPublications" (
    id uuid NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    contributors jsonb,
    doi text,
    description text,
    avatar text,
    "publicationDate" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ExternalPublications" OWNER TO testuser;

--
-- Name: FacetBindings; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."FacetBindings" (
    id uuid NOT NULL,
    "pubId" uuid,
    "collectionId" uuid,
    "communityId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FacetBindings" OWNER TO testuser;

--
-- Name: FeatureFlagCommunities; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."FeatureFlagCommunities" (
    id uuid NOT NULL,
    "featureFlagId" uuid,
    "communityId" uuid,
    enabled boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FeatureFlagCommunities" OWNER TO testuser;

--
-- Name: FeatureFlagUsers; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."FeatureFlagUsers" (
    id uuid NOT NULL,
    "featureFlagId" uuid,
    "userId" uuid,
    enabled boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FeatureFlagUsers" OWNER TO testuser;

--
-- Name: FeatureFlags; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."FeatureFlags" (
    id uuid NOT NULL,
    name character varying(255),
    "enabledUsersFraction" double precision DEFAULT '0'::double precision,
    "enabledCommunitiesFraction" double precision DEFAULT '0'::double precision,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FeatureFlags" OWNER TO testuser;

--
-- Name: IntegrationDataOAuth1; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."IntegrationDataOAuth1" (
    id uuid NOT NULL,
    "accessToken" text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."IntegrationDataOAuth1" OWNER TO testuser;

--
-- Name: LandingPageFeatures; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."LandingPageFeatures" (
    id uuid NOT NULL,
    "communityId" uuid,
    "pubId" uuid,
    rank text NOT NULL,
    payload jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."LandingPageFeatures" OWNER TO testuser;

--
-- Name: License; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."License" (
    kind character varying,
    "copyrightSelection" jsonb,
    id uuid NOT NULL,
    "facetBindingId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."License" OWNER TO testuser;

--
-- Name: Members; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Members" (
    id uuid NOT NULL,
    permissions public."enum_Members_permissions" DEFAULT 'view'::public."enum_Members_permissions",
    "isOwner" boolean,
    "subscribedToActivityDigest" boolean DEFAULT false NOT NULL,
    "userId" uuid NOT NULL,
    "pubId" uuid,
    "collectionId" uuid,
    "communityId" uuid,
    "organizationId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Members" OWNER TO testuser;

--
-- Name: Merges; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Merges" (
    id uuid NOT NULL,
    "noteContent" jsonb,
    "noteText" text,
    "userId" uuid NOT NULL,
    "pubId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Merges" OWNER TO testuser;

--
-- Name: NodeLabels; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."NodeLabels" (
    image jsonb,
    video jsonb,
    audio jsonb,
    "table" jsonb,
    math jsonb,
    id uuid NOT NULL,
    "facetBindingId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."NodeLabels" OWNER TO testuser;

--
-- Name: Organizations; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Organizations" (
    id uuid NOT NULL,
    subdomain text NOT NULL,
    domain text,
    title text NOT NULL,
    description text,
    avatar text,
    favicon text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Organizations" OWNER TO testuser;

--
-- Name: Pages; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Pages" (
    id uuid NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    avatar text,
    "isPublic" boolean DEFAULT false NOT NULL,
    "isNarrowWidth" boolean,
    "viewHash" text,
    layout jsonb NOT NULL,
    "layoutAllowsDuplicatePubs" boolean DEFAULT false NOT NULL,
    "communityId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Pages" OWNER TO testuser;

--
-- Name: PubAttributions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PubAttributions" (
    id uuid NOT NULL,
    name text,
    avatar text,
    title text,
    "order" double precision,
    "isAuthor" boolean,
    roles jsonb,
    affiliation text,
    orcid character varying(255),
    "userId" uuid,
    "pubId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PubAttributions" OWNER TO testuser;

--
-- Name: PubEdgeDisplay; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PubEdgeDisplay" (
    "defaultsToCarousel" boolean,
    "descriptionIsVisible" boolean,
    id uuid NOT NULL,
    "facetBindingId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PubEdgeDisplay" OWNER TO testuser;

--
-- Name: PubEdges; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PubEdges" (
    id uuid NOT NULL,
    "pubId" uuid NOT NULL,
    "externalPublicationId" uuid,
    "targetPubId" uuid,
    "relationType" character varying(255) NOT NULL,
    rank text NOT NULL,
    "pubIsParent" boolean NOT NULL,
    "approvedByTarget" boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PubEdges" OWNER TO testuser;

--
-- Name: PubHeaderTheme; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PubHeaderTheme" (
    "backgroundImage" text,
    "backgroundColor" text,
    "textStyle" character varying,
    id uuid NOT NULL,
    "facetBindingId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PubHeaderTheme" OWNER TO testuser;

--
-- Name: PubManagers; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PubManagers" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "pubId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PubManagers" OWNER TO testuser;

--
-- Name: PubVersions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PubVersions" (
    id uuid NOT NULL,
    "historyKey" integer,
    "pubId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PubVersions" OWNER TO testuser;

--
-- Name: PublicPermissions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."PublicPermissions" (
    id uuid NOT NULL,
    "canCreateReviews" boolean,
    "canCreateDiscussions" boolean,
    "canViewDraft" boolean,
    "canEditDraft" boolean,
    "pubId" uuid,
    "collectionId" uuid,
    "communityId" uuid,
    "organizationId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."PublicPermissions" OWNER TO testuser;

--
-- Name: Pubs; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Pubs" (
    id uuid NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    "htmlTitle" text,
    description text,
    "htmlDescription" text,
    avatar text,
    "customPublishedAt" timestamp with time zone,
    doi text,
    labels jsonb,
    downloads jsonb,
    metadata jsonb,
    "viewHash" character varying(255),
    "editHash" character varying(255),
    "reviewHash" character varying(255),
    "commentHash" character varying(255),
    "draftId" uuid NOT NULL,
    "communityId" uuid NOT NULL,
    "crossrefDepositRecordId" uuid,
    "scopeSummaryId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Pubs" OWNER TO testuser;

--
-- Name: Releases; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Releases" (
    id uuid NOT NULL,
    "noteContent" jsonb,
    "noteText" text,
    "pubId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "docId" uuid NOT NULL,
    "historyKey" integer NOT NULL,
    "historyKeyMissing" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Releases" OWNER TO testuser;

--
-- Name: ReviewEvents; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ReviewEvents" (
    id uuid NOT NULL,
    type character varying(255),
    data jsonb,
    "userId" uuid NOT NULL,
    "pubId" uuid NOT NULL,
    "reviewId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ReviewEvents" OWNER TO testuser;

--
-- Name: ReviewNews; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ReviewNews" (
    id uuid NOT NULL,
    title text,
    number integer NOT NULL,
    status public."enum_ReviewNews_status" DEFAULT 'open'::public."enum_ReviewNews_status",
    "releaseRequested" boolean,
    labels jsonb,
    "threadId" uuid NOT NULL,
    "visibilityId" uuid NOT NULL,
    "userId" uuid,
    "pubId" uuid,
    "reviewContent" jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ReviewNews" OWNER TO testuser;

--
-- Name: Reviewers; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Reviewers" (
    id uuid NOT NULL,
    name text,
    "reviewId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Reviewers" OWNER TO testuser;

--
-- Name: ScopeSummaries; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ScopeSummaries" (
    id uuid NOT NULL,
    collections integer DEFAULT 0 NOT NULL,
    pubs integer DEFAULT 0 NOT NULL,
    discussions integer DEFAULT 0 NOT NULL,
    reviews integer DEFAULT 0 NOT NULL,
    submissions integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ScopeSummaries" OWNER TO testuser;

--
-- Name: Signups; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Signups" (
    id uuid NOT NULL,
    email text NOT NULL,
    hash text,
    count integer,
    completed boolean,
    "communityId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Signups" OWNER TO testuser;

--
-- Name: SpamTags; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."SpamTags" (
    id uuid NOT NULL,
    status character varying(255) DEFAULT 'unreviewed'::character varying NOT NULL,
    "statusUpdatedAt" timestamp with time zone,
    fields jsonb NOT NULL,
    "spamScore" double precision NOT NULL,
    "spamScoreComputedAt" timestamp with time zone NOT NULL,
    "spamScoreVersion" integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."SpamTags" OWNER TO testuser;

--
-- Name: SubmissionWorkflows; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."SubmissionWorkflows" (
    id uuid NOT NULL,
    title text NOT NULL,
    "collectionId" uuid,
    enabled boolean NOT NULL,
    "instructionsText" jsonb NOT NULL,
    "acceptedText" jsonb NOT NULL,
    "declinedText" jsonb NOT NULL,
    "receivedEmailText" jsonb NOT NULL,
    "introText" jsonb NOT NULL,
    "targetEmailAddresses" jsonb DEFAULT '[]'::jsonb NOT NULL,
    "requireAbstract" boolean DEFAULT false NOT NULL,
    "requireDescription" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."SubmissionWorkflows" OWNER TO testuser;

--
-- Name: Submissions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Submissions" (
    id uuid NOT NULL,
    status text NOT NULL,
    "submittedAt" timestamp with time zone,
    "submissionWorkflowId" uuid NOT NULL,
    "pubId" uuid NOT NULL,
    abstract jsonb,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Submissions" OWNER TO testuser;

--
-- Name: ThreadComments; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ThreadComments" (
    id uuid NOT NULL,
    text text,
    content jsonb,
    "userId" uuid,
    "threadId" uuid NOT NULL,
    "commenterId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ThreadComments" OWNER TO testuser;

--
-- Name: ThreadEvents; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ThreadEvents" (
    id uuid NOT NULL,
    type character varying(255),
    data jsonb,
    "userId" uuid NOT NULL,
    "threadId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ThreadEvents" OWNER TO testuser;

--
-- Name: Threads; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Threads" (
    id uuid NOT NULL,
    "isLocked" boolean,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Threads" OWNER TO testuser;

--
-- Name: UserDismissables; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."UserDismissables" (
    id uuid NOT NULL,
    key character varying(255) NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserDismissables" OWNER TO testuser;

--
-- Name: UserNotificationPreferences; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."UserNotificationPreferences" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "receiveNotifications" boolean DEFAULT true NOT NULL,
    "lastReceivedNotificationsAt" timestamp with time zone,
    "subscribeToThreadsAsCommenter" boolean DEFAULT true NOT NULL,
    "subscribeToPubsAsMember" boolean DEFAULT true NOT NULL,
    "subscribeToPubsAsContributor" boolean DEFAULT true NOT NULL,
    "notificationCadence" integer DEFAULT 0 NOT NULL,
    "markReadTrigger" character varying(255) DEFAULT 'clicked-through'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserNotificationPreferences" OWNER TO testuser;

--
-- Name: UserNotifications; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."UserNotifications" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "userSubscriptionId" uuid NOT NULL,
    "activityItemId" uuid NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "manuallySetIsRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserNotifications" OWNER TO testuser;

--
-- Name: UserScopeVisits; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."UserScopeVisits" (
    id uuid NOT NULL,
    "userId" uuid,
    "pubId" uuid,
    "collectionId" uuid,
    "communityId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserScopeVisits" OWNER TO testuser;

--
-- Name: UserSubscriptions; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."UserSubscriptions" (
    id uuid NOT NULL,
    "setAutomatically" boolean NOT NULL,
    status character varying(255) NOT NULL,
    "userId" uuid NOT NULL,
    "pubId" uuid,
    "threadId" uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UserSubscriptions" OWNER TO testuser;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    slug text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "fullName" text NOT NULL,
    initials character varying(255) NOT NULL,
    avatar text,
    bio text,
    title text,
    email text NOT NULL,
    "publicEmail" text,
    "authRedirectHost" text,
    location text,
    website text,
    facebook text,
    twitter text,
    github text,
    orcid text,
    "googleScholar" text,
    "resetHashExpiration" timestamp with time zone,
    "resetHash" text,
    inactive boolean,
    "pubpubV3Id" integer,
    "passwordDigest" text,
    hash text NOT NULL,
    salt text NOT NULL,
    "gdprConsent" boolean,
    "isSuperAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO testuser;

--
-- Name: Visibilities; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."Visibilities" (
    id uuid NOT NULL,
    access public."enum_Visibilities_access" DEFAULT 'private'::public."enum_Visibilities_access",
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Visibilities" OWNER TO testuser;

--
-- Name: VisibilityUsers; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."VisibilityUsers" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "visibilityId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."VisibilityUsers" OWNER TO testuser;

--
-- Name: WorkerTasks; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."WorkerTasks" (
    id uuid NOT NULL,
    type text NOT NULL,
    input jsonb,
    "isProcessing" boolean,
    "attemptCount" integer,
    error jsonb,
    output jsonb,
    priority integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."WorkerTasks" OWNER TO testuser;

--
-- Name: ZoteroIntegrations; Type: TABLE; Schema: public; Owner: testuser
--

CREATE TABLE public."ZoteroIntegrations" (
    id uuid NOT NULL,
    "zoteroUsername" text,
    "zoteroUserId" text,
    "userId" uuid NOT NULL,
    "integrationDataOAuth1Id" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ZoteroIntegrations" OWNER TO testuser;

--
-- Data for Name: ActivityItems; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ActivityItems" (id, kind, "pubId", payload, "timestamp", "communityId", "actorId", "collectionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CitationStyle; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."CitationStyle" ("citationStyle", "inlineCitationStyle", id, "facetBindingId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CollectionAttributions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."CollectionAttributions" (id, name, avatar, title, "order", "isAuthor", roles, affiliation, orcid, "userId", "collectionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CollectionPubs; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."CollectionPubs" (id, "pubId", "collectionId", "contextHint", rank, "pubRank", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Collections; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Collections" (id, title, slug, avatar, "isRestricted", "isPublic", "viewHash", "editHash", metadata, kind, doi, "readNextPreviewSize", layout, "layoutAllowsDuplicatePubs", "pageId", "communityId", "scopeSummaryId", "crossrefDepositRecordId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Commenters; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Commenters" (id, name, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Communities; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Communities" (id, subdomain, domain, title, "citeAs", "publishAs", description, avatar, favicon, "accentColorLight", "accentColorDark", "hideCreatePubButton", "headerLogo", "headerLinks", "headerColorType", "useHeaderTextAccent", "hideHero", "hideHeaderLogo", "heroLogo", "heroBackgroundImage", "heroBackgroundColor", "heroTextColor", "useHeaderGradient", "heroImage", "heroTitle", "heroText", "heroPrimaryButton", "heroSecondaryButton", "heroAlign", navigation, "hideNav", "navLinks", "footerLinks", "footerLogoLink", "footerTitle", "footerImage", website, facebook, twitter, email, issn, "isFeatured", "viewHash", "editHash", "premiumLicenseFlag", "defaultPubCollections", "spamTagId", "organizationId", "scopeSummaryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CommunityAdmins; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."CommunityAdmins" (id, "userId", "communityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CrossrefDepositRecords; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."CrossrefDepositRecords" (id, "depositJson", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: CustomScripts; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."CustomScripts" (id, "communityId", type, content, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DepositTargets; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."DepositTargets" (id, "communityId", "doiPrefix", service, username, password, "passwordInitVec", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: DiscussionAnchors; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."DiscussionAnchors" (id, "isOriginal", "discussionId", "historyKey", selection, "originalText", "originalTextPrefix", "originalTextSuffix", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Discussions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Discussions" (id, title, number, "isClosed", labels, "threadId", "visibilityId", "userId", "anchorId", "pubId", "commenterId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Docs; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Docs" (id, content, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Drafts; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Drafts" (id, "latestKeyAt", "firebasePath", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Exports; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Exports" (id, format, url, "historyKey", "pubId", "workerTaskId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ExternalPublications; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ExternalPublications" (id, title, url, contributors, doi, description, avatar, "publicationDate", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FacetBindings; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."FacetBindings" (id, "pubId", "collectionId", "communityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeatureFlagCommunities; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."FeatureFlagCommunities" (id, "featureFlagId", "communityId", enabled, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeatureFlagUsers; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."FeatureFlagUsers" (id, "featureFlagId", "userId", enabled, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeatureFlags; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."FeatureFlags" (id, name, "enabledUsersFraction", "enabledCommunitiesFraction", "createdAt", "updatedAt") FROM stdin;
37369279-e122-47ac-b077-c1cf33befdca	customScripts	0	0	2023-07-12 14:13:37.527+02	2023-07-12 14:13:37.527+02
\.


--
-- Data for Name: IntegrationDataOAuth1; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."IntegrationDataOAuth1" (id, "accessToken", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LandingPageFeatures; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."LandingPageFeatures" (id, "communityId", "pubId", rank, payload, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: License; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."License" (kind, "copyrightSelection", id, "facetBindingId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Members; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Members" (id, permissions, "isOwner", "subscribedToActivityDigest", "userId", "pubId", "collectionId", "communityId", "organizationId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Merges; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Merges" (id, "noteContent", "noteText", "userId", "pubId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: NodeLabels; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."NodeLabels" (image, video, audio, "table", math, id, "facetBindingId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Organizations; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Organizations" (id, subdomain, domain, title, description, avatar, favicon, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Pages; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Pages" (id, title, slug, description, avatar, "isPublic", "isNarrowWidth", "viewHash", layout, "layoutAllowsDuplicatePubs", "communityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PubAttributions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PubAttributions" (id, name, avatar, title, "order", "isAuthor", roles, affiliation, orcid, "userId", "pubId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PubEdgeDisplay; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PubEdgeDisplay" ("defaultsToCarousel", "descriptionIsVisible", id, "facetBindingId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PubEdges; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PubEdges" (id, "pubId", "externalPublicationId", "targetPubId", "relationType", rank, "pubIsParent", "approvedByTarget", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PubHeaderTheme; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PubHeaderTheme" ("backgroundImage", "backgroundColor", "textStyle", id, "facetBindingId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PubManagers; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PubManagers" (id, "userId", "pubId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PubVersions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PubVersions" (id, "historyKey", "pubId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: PublicPermissions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."PublicPermissions" (id, "canCreateReviews", "canCreateDiscussions", "canViewDraft", "canEditDraft", "pubId", "collectionId", "communityId", "organizationId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Pubs; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Pubs" (id, slug, title, "htmlTitle", description, "htmlDescription", avatar, "customPublishedAt", doi, labels, downloads, metadata, "viewHash", "editHash", "reviewHash", "commentHash", "draftId", "communityId", "crossrefDepositRecordId", "scopeSummaryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Releases; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Releases" (id, "noteContent", "noteText", "pubId", "userId", "docId", "historyKey", "historyKeyMissing", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ReviewEvents; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ReviewEvents" (id, type, data, "userId", "pubId", "reviewId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ReviewNews; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ReviewNews" (id, title, number, status, "releaseRequested", labels, "threadId", "visibilityId", "userId", "pubId", "reviewContent", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Reviewers; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Reviewers" (id, name, "reviewId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ScopeSummaries; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ScopeSummaries" (id, collections, pubs, discussions, reviews, submissions, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Signups; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Signups" (id, email, hash, count, completed, "communityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SpamTags; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."SpamTags" (id, status, "statusUpdatedAt", fields, "spamScore", "spamScoreComputedAt", "spamScoreVersion", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SubmissionWorkflows; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."SubmissionWorkflows" (id, title, "collectionId", enabled, "instructionsText", "acceptedText", "declinedText", "receivedEmailText", "introText", "targetEmailAddresses", "requireAbstract", "requireDescription", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Submissions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Submissions" (id, status, "submittedAt", "submissionWorkflowId", "pubId", abstract, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ThreadComments; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ThreadComments" (id, text, content, "userId", "threadId", "commenterId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ThreadEvents; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ThreadEvents" (id, type, data, "userId", "threadId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Threads; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Threads" (id, "isLocked", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserDismissables; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."UserDismissables" (id, key, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserNotificationPreferences; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."UserNotificationPreferences" (id, "userId", "receiveNotifications", "lastReceivedNotificationsAt", "subscribeToThreadsAsCommenter", "subscribeToPubsAsMember", "subscribeToPubsAsContributor", "notificationCadence", "markReadTrigger", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserNotifications; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."UserNotifications" (id, "userId", "userSubscriptionId", "activityItemId", "isRead", "manuallySetIsRead", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserScopeVisits; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."UserScopeVisits" (id, "userId", "pubId", "collectionId", "communityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: UserSubscriptions; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."UserSubscriptions" (id, "setAutomatically", status, "userId", "pubId", "threadId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Users" (id, slug, "firstName", "lastName", "fullName", initials, avatar, bio, title, email, "publicEmail", "authRedirectHost", location, website, facebook, twitter, github, orcid, "googleScholar", "resetHashExpiration", "resetHash", inactive, "pubpubV3Id", "passwordDigest", hash, salt, "gdprConsent", "isSuperAdmin", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Visibilities; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."Visibilities" (id, access, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: VisibilityUsers; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."VisibilityUsers" (id, "userId", "visibilityId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: WorkerTasks; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."WorkerTasks" (id, type, input, "isProcessing", "attemptCount", error, output, priority, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ZoteroIntegrations; Type: TABLE DATA; Schema: public; Owner: testuser
--

COPY public."ZoteroIntegrations" (id, "zoteroUsername", "zoteroUserId", "userId", "integrationDataOAuth1Id", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: ActivityItems ActivityItems_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ActivityItems"
    ADD CONSTRAINT "ActivityItems_pkey" PRIMARY KEY (id);


--
-- Name: CitationStyle CitationStyle_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CitationStyle"
    ADD CONSTRAINT "CitationStyle_pkey" PRIMARY KEY (id);


--
-- Name: CollectionAttributions CollectionAttributions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CollectionAttributions"
    ADD CONSTRAINT "CollectionAttributions_pkey" PRIMARY KEY (id);


--
-- Name: CollectionPubs CollectionPubs_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CollectionPubs"
    ADD CONSTRAINT "CollectionPubs_pkey" PRIMARY KEY (id);


--
-- Name: Collections Collections_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_pkey" PRIMARY KEY (id);


--
-- Name: Commenters Commenters_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Commenters"
    ADD CONSTRAINT "Commenters_pkey" PRIMARY KEY (id);


--
-- Name: Communities Communities_domain_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Communities"
    ADD CONSTRAINT "Communities_domain_key" UNIQUE (domain);


--
-- Name: Communities Communities_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Communities"
    ADD CONSTRAINT "Communities_pkey" PRIMARY KEY (id);


--
-- Name: Communities Communities_subdomain_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Communities"
    ADD CONSTRAINT "Communities_subdomain_key" UNIQUE (subdomain);


--
-- Name: CommunityAdmins CommunityAdmins_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CommunityAdmins"
    ADD CONSTRAINT "CommunityAdmins_pkey" PRIMARY KEY (id);


--
-- Name: CrossrefDepositRecords CrossrefDepositRecords_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CrossrefDepositRecords"
    ADD CONSTRAINT "CrossrefDepositRecords_pkey" PRIMARY KEY (id);


--
-- Name: CustomScripts CustomScripts_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CustomScripts"
    ADD CONSTRAINT "CustomScripts_pkey" PRIMARY KEY (id);


--
-- Name: DepositTargets DepositTargets_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."DepositTargets"
    ADD CONSTRAINT "DepositTargets_pkey" PRIMARY KEY (id);


--
-- Name: DiscussionAnchors DiscussionAnchors_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."DiscussionAnchors"
    ADD CONSTRAINT "DiscussionAnchors_pkey" PRIMARY KEY (id);


--
-- Name: Discussions Discussions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Discussions"
    ADD CONSTRAINT "Discussions_pkey" PRIMARY KEY (id);


--
-- Name: Docs Docs_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Docs"
    ADD CONSTRAINT "Docs_pkey" PRIMARY KEY (id);


--
-- Name: Drafts Drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Drafts"
    ADD CONSTRAINT "Drafts_pkey" PRIMARY KEY (id);


--
-- Name: Exports Exports_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Exports"
    ADD CONSTRAINT "Exports_pkey" PRIMARY KEY (id);


--
-- Name: ExternalPublications ExternalPublications_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ExternalPublications"
    ADD CONSTRAINT "ExternalPublications_pkey" PRIMARY KEY (id);


--
-- Name: FacetBindings FacetBindings_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FacetBindings"
    ADD CONSTRAINT "FacetBindings_pkey" PRIMARY KEY (id);


--
-- Name: FeatureFlagCommunities FeatureFlagCommunities_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlagCommunities"
    ADD CONSTRAINT "FeatureFlagCommunities_pkey" PRIMARY KEY (id);


--
-- Name: FeatureFlagUsers FeatureFlagUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlagUsers"
    ADD CONSTRAINT "FeatureFlagUsers_pkey" PRIMARY KEY (id);


--
-- Name: FeatureFlags FeatureFlags_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlags"
    ADD CONSTRAINT "FeatureFlags_pkey" PRIMARY KEY (id);


--
-- Name: IntegrationDataOAuth1 IntegrationDataOAuth1_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."IntegrationDataOAuth1"
    ADD CONSTRAINT "IntegrationDataOAuth1_pkey" PRIMARY KEY (id);


--
-- Name: LandingPageFeatures LandingPageFeatures_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."LandingPageFeatures"
    ADD CONSTRAINT "LandingPageFeatures_pkey" PRIMARY KEY (id);


--
-- Name: License License_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."License"
    ADD CONSTRAINT "License_pkey" PRIMARY KEY (id);


--
-- Name: Members Members_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_pkey" PRIMARY KEY (id);


--
-- Name: Merges Merges_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Merges"
    ADD CONSTRAINT "Merges_pkey" PRIMARY KEY (id);


--
-- Name: NodeLabels NodeLabels_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."NodeLabels"
    ADD CONSTRAINT "NodeLabels_pkey" PRIMARY KEY (id);


--
-- Name: Organizations Organizations_domain_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Organizations"
    ADD CONSTRAINT "Organizations_domain_key" UNIQUE (domain);


--
-- Name: Organizations Organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Organizations"
    ADD CONSTRAINT "Organizations_pkey" PRIMARY KEY (id);


--
-- Name: Organizations Organizations_subdomain_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Organizations"
    ADD CONSTRAINT "Organizations_subdomain_key" UNIQUE (subdomain);


--
-- Name: Pages Pages_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pages"
    ADD CONSTRAINT "Pages_pkey" PRIMARY KEY (id);


--
-- Name: PubAttributions PubAttributions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubAttributions"
    ADD CONSTRAINT "PubAttributions_pkey" PRIMARY KEY (id);


--
-- Name: PubEdgeDisplay PubEdgeDisplay_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubEdgeDisplay"
    ADD CONSTRAINT "PubEdgeDisplay_pkey" PRIMARY KEY (id);


--
-- Name: PubEdges PubEdges_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubEdges"
    ADD CONSTRAINT "PubEdges_pkey" PRIMARY KEY (id);


--
-- Name: PubHeaderTheme PubHeaderTheme_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubHeaderTheme"
    ADD CONSTRAINT "PubHeaderTheme_pkey" PRIMARY KEY (id);


--
-- Name: PubManagers PubManagers_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubManagers"
    ADD CONSTRAINT "PubManagers_pkey" PRIMARY KEY (id);


--
-- Name: PubVersions PubVersions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubVersions"
    ADD CONSTRAINT "PubVersions_pkey" PRIMARY KEY (id);


--
-- Name: PublicPermissions PublicPermissions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PublicPermissions"
    ADD CONSTRAINT "PublicPermissions_pkey" PRIMARY KEY (id);


--
-- Name: Pubs Pubs_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pubs"
    ADD CONSTRAINT "Pubs_pkey" PRIMARY KEY (id);


--
-- Name: Pubs Pubs_slug_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pubs"
    ADD CONSTRAINT "Pubs_slug_key" UNIQUE (slug);


--
-- Name: Releases Releases_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Releases"
    ADD CONSTRAINT "Releases_pkey" PRIMARY KEY (id);


--
-- Name: ReviewEvents ReviewEvents_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewEvents"
    ADD CONSTRAINT "ReviewEvents_pkey" PRIMARY KEY (id);


--
-- Name: ReviewNews ReviewNews_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewNews"
    ADD CONSTRAINT "ReviewNews_pkey" PRIMARY KEY (id);


--
-- Name: Reviewers Reviewers_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Reviewers"
    ADD CONSTRAINT "Reviewers_pkey" PRIMARY KEY (id);


--
-- Name: ScopeSummaries ScopeSummaries_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ScopeSummaries"
    ADD CONSTRAINT "ScopeSummaries_pkey" PRIMARY KEY (id);


--
-- Name: Signups Signups_email_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Signups"
    ADD CONSTRAINT "Signups_email_key" UNIQUE (email);


--
-- Name: Signups Signups_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Signups"
    ADD CONSTRAINT "Signups_pkey" PRIMARY KEY (id);


--
-- Name: SpamTags SpamTags_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."SpamTags"
    ADD CONSTRAINT "SpamTags_pkey" PRIMARY KEY (id);


--
-- Name: SubmissionWorkflows SubmissionWorkflows_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."SubmissionWorkflows"
    ADD CONSTRAINT "SubmissionWorkflows_pkey" PRIMARY KEY (id);


--
-- Name: Submissions Submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Submissions"
    ADD CONSTRAINT "Submissions_pkey" PRIMARY KEY (id);


--
-- Name: ThreadComments ThreadComments_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadComments"
    ADD CONSTRAINT "ThreadComments_pkey" PRIMARY KEY (id);


--
-- Name: ThreadEvents ThreadEvents_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadEvents"
    ADD CONSTRAINT "ThreadEvents_pkey" PRIMARY KEY (id);


--
-- Name: Threads Threads_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Threads"
    ADD CONSTRAINT "Threads_pkey" PRIMARY KEY (id);


--
-- Name: UserDismissables UserDismissables_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserDismissables"
    ADD CONSTRAINT "UserDismissables_pkey" PRIMARY KEY (id);


--
-- Name: UserNotificationPreferences UserNotificationPreferences_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserNotificationPreferences"
    ADD CONSTRAINT "UserNotificationPreferences_pkey" PRIMARY KEY (id);


--
-- Name: UserNotifications UserNotifications_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserNotifications"
    ADD CONSTRAINT "UserNotifications_pkey" PRIMARY KEY (id);


--
-- Name: UserScopeVisits UserScopeVisits_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserScopeVisits"
    ADD CONSTRAINT "UserScopeVisits_pkey" PRIMARY KEY (id);


--
-- Name: UserSubscriptions UserSubscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserSubscriptions"
    ADD CONSTRAINT "UserSubscriptions_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_slug_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_slug_key" UNIQUE (slug);


--
-- Name: Visibilities Visibilities_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Visibilities"
    ADD CONSTRAINT "Visibilities_pkey" PRIMARY KEY (id);


--
-- Name: VisibilityUsers VisibilityUsers_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."VisibilityUsers"
    ADD CONSTRAINT "VisibilityUsers_pkey" PRIMARY KEY (id);


--
-- Name: VisibilityUsers VisibilityUsers_userId_visibilityId_key; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."VisibilityUsers"
    ADD CONSTRAINT "VisibilityUsers_userId_visibilityId_key" UNIQUE ("userId", "visibilityId");


--
-- Name: WorkerTasks WorkerTasks_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."WorkerTasks"
    ADD CONSTRAINT "WorkerTasks_pkey" PRIMARY KEY (id);


--
-- Name: ZoteroIntegrations ZoteroIntegrations_pkey; Type: CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ZoteroIntegrations"
    ADD CONSTRAINT "ZoteroIntegrations_pkey" PRIMARY KEY (id);


--
-- Name: activity_items_actor_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX activity_items_actor_id ON public."ActivityItems" USING btree ("actorId");


--
-- Name: activity_items_collection_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX activity_items_collection_id ON public."ActivityItems" USING btree ("collectionId");


--
-- Name: activity_items_community_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX activity_items_community_id ON public."ActivityItems" USING btree ("communityId");


--
-- Name: activity_items_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX activity_items_pub_id ON public."ActivityItems" USING btree ("pubId");


--
-- Name: collection_pubs_collection_id_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE UNIQUE INDEX collection_pubs_collection_id_pub_id ON public."CollectionPubs" USING btree ("pubId", "collectionId");


--
-- Name: discussion_anchors_discussion_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX discussion_anchors_discussion_id ON public."DiscussionAnchors" USING btree ("discussionId");


--
-- Name: discussions_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX discussions_pub_id ON public."Discussions" USING btree ("pubId");


--
-- Name: discussions_user_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX discussions_user_id ON public."Discussions" USING btree ("userId");


--
-- Name: facet_bindings_collection_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX facet_bindings_collection_id ON public."FacetBindings" USING btree ("collectionId");


--
-- Name: facet_bindings_community_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX facet_bindings_community_id ON public."FacetBindings" USING btree ("communityId");


--
-- Name: facet_bindings_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX facet_bindings_pub_id ON public."FacetBindings" USING btree ("pubId");


--
-- Name: feature_flags_name; Type: INDEX; Schema: public; Owner: testuser
--

CREATE UNIQUE INDEX feature_flags_name ON public."FeatureFlags" USING btree (name);


--
-- Name: landing_page_features_community_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE UNIQUE INDEX landing_page_features_community_id ON public."LandingPageFeatures" USING btree ("communityId");


--
-- Name: landing_page_features_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE UNIQUE INDEX landing_page_features_pub_id ON public."LandingPageFeatures" USING btree ("pubId");


--
-- Name: pubs_community_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX pubs_community_id ON public."Pubs" USING btree ("communityId");


--
-- Name: review_news_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX review_news_pub_id ON public."ReviewNews" USING btree ("pubId");


--
-- Name: review_news_user_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX review_news_user_id ON public."ReviewNews" USING btree ("userId");


--
-- Name: user_dismissables_user_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX user_dismissables_user_id ON public."UserDismissables" USING btree ("userId");


--
-- Name: user_notification_preferences_user_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX user_notification_preferences_user_id ON public."UserNotificationPreferences" USING btree ("userId");


--
-- Name: user_notifications_user_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX user_notifications_user_id ON public."UserNotifications" USING btree ("userId");


--
-- Name: user_scope_visits_user_id_collection_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE UNIQUE INDEX user_scope_visits_user_id_collection_id ON public."UserScopeVisits" USING btree ("userId", "collectionId");


--
-- Name: user_scope_visits_user_id_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE UNIQUE INDEX user_scope_visits_user_id_pub_id ON public."UserScopeVisits" USING btree ("userId", "pubId");


--
-- Name: user_subscriptions_pub_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX user_subscriptions_pub_id ON public."UserSubscriptions" USING btree ("pubId");


--
-- Name: user_subscriptions_thread_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX user_subscriptions_thread_id ON public."UserSubscriptions" USING btree ("threadId");


--
-- Name: user_subscriptions_user_id; Type: INDEX; Schema: public; Owner: testuser
--

CREATE INDEX user_subscriptions_user_id ON public."UserSubscriptions" USING btree ("userId");


--
-- Name: CitationStyle CitationStyle_facetBindingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CitationStyle"
    ADD CONSTRAINT "CitationStyle_facetBindingId_fkey" FOREIGN KEY ("facetBindingId") REFERENCES public."FacetBindings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CollectionAttributions CollectionAttributions_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CollectionAttributions"
    ADD CONSTRAINT "CollectionAttributions_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collections"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CollectionAttributions CollectionAttributions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CollectionAttributions"
    ADD CONSTRAINT "CollectionAttributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CollectionPubs CollectionPubs_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CollectionPubs"
    ADD CONSTRAINT "CollectionPubs_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collections"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CollectionPubs CollectionPubs_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."CollectionPubs"
    ADD CONSTRAINT "CollectionPubs_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Collections Collections_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE;


--
-- Name: Collections Collections_crossrefDepositRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_crossrefDepositRecordId_fkey" FOREIGN KEY ("crossrefDepositRecordId") REFERENCES public."CrossrefDepositRecords"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Collections Collections_pageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES public."Pages"(id) ON UPDATE CASCADE;


--
-- Name: Collections Collections_scopeSummaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Collections"
    ADD CONSTRAINT "Collections_scopeSummaryId_fkey" FOREIGN KEY ("scopeSummaryId") REFERENCES public."ScopeSummaries"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Communities Communities_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Communities"
    ADD CONSTRAINT "Communities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organizations"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Communities Communities_scopeSummaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Communities"
    ADD CONSTRAINT "Communities_scopeSummaryId_fkey" FOREIGN KEY ("scopeSummaryId") REFERENCES public."ScopeSummaries"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Communities Communities_spamTagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Communities"
    ADD CONSTRAINT "Communities_spamTagId_fkey" FOREIGN KEY ("spamTagId") REFERENCES public."SpamTags"(id) ON UPDATE CASCADE;


--
-- Name: DepositTargets DepositTargets_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."DepositTargets"
    ADD CONSTRAINT "DepositTargets_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DiscussionAnchors DiscussionAnchors_discussionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."DiscussionAnchors"
    ADD CONSTRAINT "DiscussionAnchors_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES public."Discussions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discussions Discussions_commenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Discussions"
    ADD CONSTRAINT "Discussions_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES public."Commenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discussions Discussions_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Discussions"
    ADD CONSTRAINT "Discussions_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discussions Discussions_threadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Discussions"
    ADD CONSTRAINT "Discussions_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES public."Threads"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discussions Discussions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Discussions"
    ADD CONSTRAINT "Discussions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Discussions Discussions_visibilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Discussions"
    ADD CONSTRAINT "Discussions_visibilityId_fkey" FOREIGN KEY ("visibilityId") REFERENCES public."Visibilities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exports Exports_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Exports"
    ADD CONSTRAINT "Exports_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Exports Exports_workerTaskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Exports"
    ADD CONSTRAINT "Exports_workerTaskId_fkey" FOREIGN KEY ("workerTaskId") REFERENCES public."WorkerTasks"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FacetBindings FacetBindings_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FacetBindings"
    ADD CONSTRAINT "FacetBindings_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collections"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FacetBindings FacetBindings_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FacetBindings"
    ADD CONSTRAINT "FacetBindings_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FacetBindings FacetBindings_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FacetBindings"
    ADD CONSTRAINT "FacetBindings_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeatureFlagCommunities FeatureFlagCommunities_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlagCommunities"
    ADD CONSTRAINT "FeatureFlagCommunities_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeatureFlagCommunities FeatureFlagCommunities_featureFlagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlagCommunities"
    ADD CONSTRAINT "FeatureFlagCommunities_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES public."FeatureFlags"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeatureFlagUsers FeatureFlagUsers_featureFlagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlagUsers"
    ADD CONSTRAINT "FeatureFlagUsers_featureFlagId_fkey" FOREIGN KEY ("featureFlagId") REFERENCES public."FeatureFlags"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FeatureFlagUsers FeatureFlagUsers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."FeatureFlagUsers"
    ADD CONSTRAINT "FeatureFlagUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LandingPageFeatures LandingPageFeatures_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."LandingPageFeatures"
    ADD CONSTRAINT "LandingPageFeatures_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: LandingPageFeatures LandingPageFeatures_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."LandingPageFeatures"
    ADD CONSTRAINT "LandingPageFeatures_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: License License_facetBindingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."License"
    ADD CONSTRAINT "License_facetBindingId_fkey" FOREIGN KEY ("facetBindingId") REFERENCES public."FacetBindings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Members Members_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collections"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Members Members_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Members Members_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Members Members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Members"
    ADD CONSTRAINT "Members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Merges Merges_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Merges"
    ADD CONSTRAINT "Merges_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: NodeLabels NodeLabels_facetBindingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."NodeLabels"
    ADD CONSTRAINT "NodeLabels_facetBindingId_fkey" FOREIGN KEY ("facetBindingId") REFERENCES public."FacetBindings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pages Pages_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pages"
    ADD CONSTRAINT "Pages_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubAttributions PubAttributions_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubAttributions"
    ADD CONSTRAINT "PubAttributions_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubAttributions PubAttributions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubAttributions"
    ADD CONSTRAINT "PubAttributions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubEdgeDisplay PubEdgeDisplay_facetBindingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubEdgeDisplay"
    ADD CONSTRAINT "PubEdgeDisplay_facetBindingId_fkey" FOREIGN KEY ("facetBindingId") REFERENCES public."FacetBindings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubEdges PubEdges_externalPublicationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubEdges"
    ADD CONSTRAINT "PubEdges_externalPublicationId_fkey" FOREIGN KEY ("externalPublicationId") REFERENCES public."ExternalPublications"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubEdges PubEdges_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubEdges"
    ADD CONSTRAINT "PubEdges_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubEdges PubEdges_targetPubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubEdges"
    ADD CONSTRAINT "PubEdges_targetPubId_fkey" FOREIGN KEY ("targetPubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubHeaderTheme PubHeaderTheme_facetBindingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubHeaderTheme"
    ADD CONSTRAINT "PubHeaderTheme_facetBindingId_fkey" FOREIGN KEY ("facetBindingId") REFERENCES public."FacetBindings"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubManagers PubManagers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubManagers"
    ADD CONSTRAINT "PubManagers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PubVersions PubVersions_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PubVersions"
    ADD CONSTRAINT "PubVersions_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: PublicPermissions PublicPermissions_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."PublicPermissions"
    ADD CONSTRAINT "PublicPermissions_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pubs Pubs_communityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pubs"
    ADD CONSTRAINT "Pubs_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES public."Communities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Pubs Pubs_crossrefDepositRecordId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pubs"
    ADD CONSTRAINT "Pubs_crossrefDepositRecordId_fkey" FOREIGN KEY ("crossrefDepositRecordId") REFERENCES public."CrossrefDepositRecords"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Pubs Pubs_draftId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pubs"
    ADD CONSTRAINT "Pubs_draftId_fkey" FOREIGN KEY ("draftId") REFERENCES public."Drafts"(id) ON UPDATE CASCADE;


--
-- Name: Pubs Pubs_scopeSummaryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Pubs"
    ADD CONSTRAINT "Pubs_scopeSummaryId_fkey" FOREIGN KEY ("scopeSummaryId") REFERENCES public."ScopeSummaries"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Releases Releases_docId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Releases"
    ADD CONSTRAINT "Releases_docId_fkey" FOREIGN KEY ("docId") REFERENCES public."Docs"(id) ON UPDATE CASCADE;


--
-- Name: Releases Releases_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Releases"
    ADD CONSTRAINT "Releases_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReviewEvents ReviewEvents_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewEvents"
    ADD CONSTRAINT "ReviewEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReviewNews ReviewNews_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewNews"
    ADD CONSTRAINT "ReviewNews_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReviewNews ReviewNews_threadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewNews"
    ADD CONSTRAINT "ReviewNews_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES public."Threads"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ReviewNews ReviewNews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewNews"
    ADD CONSTRAINT "ReviewNews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: ReviewNews ReviewNews_visibilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ReviewNews"
    ADD CONSTRAINT "ReviewNews_visibilityId_fkey" FOREIGN KEY ("visibilityId") REFERENCES public."Visibilities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Reviewers Reviewers_reviewId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Reviewers"
    ADD CONSTRAINT "Reviewers_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES public."ReviewNews"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SubmissionWorkflows SubmissionWorkflows_collectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."SubmissionWorkflows"
    ADD CONSTRAINT "SubmissionWorkflows_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES public."Collections"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Submissions Submissions_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Submissions"
    ADD CONSTRAINT "Submissions_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Submissions Submissions_submissionWorkflowId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."Submissions"
    ADD CONSTRAINT "Submissions_submissionWorkflowId_fkey" FOREIGN KEY ("submissionWorkflowId") REFERENCES public."SubmissionWorkflows"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ThreadComments ThreadComments_commenterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadComments"
    ADD CONSTRAINT "ThreadComments_commenterId_fkey" FOREIGN KEY ("commenterId") REFERENCES public."Commenters"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ThreadComments ThreadComments_threadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadComments"
    ADD CONSTRAINT "ThreadComments_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES public."Threads"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ThreadComments ThreadComments_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadComments"
    ADD CONSTRAINT "ThreadComments_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ThreadEvents ThreadEvents_threadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadEvents"
    ADD CONSTRAINT "ThreadEvents_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES public."Threads"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ThreadEvents ThreadEvents_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ThreadEvents"
    ADD CONSTRAINT "ThreadEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserNotificationPreferences UserNotificationPreferences_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserNotificationPreferences"
    ADD CONSTRAINT "UserNotificationPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserNotifications UserNotifications_activityItemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserNotifications"
    ADD CONSTRAINT "UserNotifications_activityItemId_fkey" FOREIGN KEY ("activityItemId") REFERENCES public."ActivityItems"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserNotifications UserNotifications_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserNotifications"
    ADD CONSTRAINT "UserNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserNotifications UserNotifications_userSubscriptionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserNotifications"
    ADD CONSTRAINT "UserNotifications_userSubscriptionId_fkey" FOREIGN KEY ("userSubscriptionId") REFERENCES public."UserSubscriptions"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSubscriptions UserSubscriptions_pubId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserSubscriptions"
    ADD CONSTRAINT "UserSubscriptions_pubId_fkey" FOREIGN KEY ("pubId") REFERENCES public."Pubs"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSubscriptions UserSubscriptions_threadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserSubscriptions"
    ADD CONSTRAINT "UserSubscriptions_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES public."Threads"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserSubscriptions UserSubscriptions_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."UserSubscriptions"
    ADD CONSTRAINT "UserSubscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisibilityUsers VisibilityUsers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."VisibilityUsers"
    ADD CONSTRAINT "VisibilityUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisibilityUsers VisibilityUsers_visibilityId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."VisibilityUsers"
    ADD CONSTRAINT "VisibilityUsers_visibilityId_fkey" FOREIGN KEY ("visibilityId") REFERENCES public."Visibilities"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ZoteroIntegrations ZoteroIntegrations_integrationDataOAuth1Id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ZoteroIntegrations"
    ADD CONSTRAINT "ZoteroIntegrations_integrationDataOAuth1Id_fkey" FOREIGN KEY ("integrationDataOAuth1Id") REFERENCES public."IntegrationDataOAuth1"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ZoteroIntegrations ZoteroIntegrations_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: testuser
--

ALTER TABLE ONLY public."ZoteroIntegrations"
    ADD CONSTRAINT "ZoteroIntegrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id) ON UPDATE CASCADE;


--
-- PostgreSQL database dump complete
--

