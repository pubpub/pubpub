import React from 'react';
import { Button } from 'reakit/Button';

import { Byline, GridWrapper, ContributorAvatars, Icon, ClickToCopyButton } from 'components';
import { Collection } from 'types';
import { LayoutBlockCollectionHeader } from 'utils/layout/types';
import { getAllCollectionContributors } from 'utils/contributors';
import getCollectionDoi from 'utils/collections/getCollectionDoi';
import { getSchemaForKind } from 'utils/collections/schemas';
import { capitalize } from 'utils/strings';
import { formatDate } from 'utils/dates';
import { IssueMetadata } from 'utils/collections/getIssueMetadata';
import { BookMetadata } from 'utils/collections/getBookMetadata';
import { ConferenceMetadata } from 'utils/collections/getConferenceMetadata';

require('./layoutCollectionHeader.scss');

type Props = {
	collection: Collection;
	content: LayoutBlockCollectionHeader['content'];
};

const IssueDiv = (props: Props) => {
	const {
		collection,
		content: {
			hidePrintIssn,
			hideElectronicIssn,
			hideVolume,
			hideIssuePrintPublicationDate,
			hideIssuePublicationDate,
			hideIssue,
		},
	} = props;

	const {
		printIssn,
		electronicIssn,
		volume,
		printPublicationDate,
		publicationDate,
		issue,
	} = IssueMetadata(collection);

	return (
		<>
			{printIssn && !hidePrintIssn && <div key={3}> {printIssn}</div>}
			{electronicIssn && !hideElectronicIssn && <div key={4}> {electronicIssn}</div>}
			{volume && !hideVolume && <div key={5}>{volume}</div>}
			{printPublicationDate && !hideIssuePrintPublicationDate && (
				<div key={6}>Published in print on {printPublicationDate}</div>
			)}
			{publicationDate && !hideIssuePublicationDate && (
				<div key={7}>Published {publicationDate}</div>
			)}
			{issue && !hideIssue && <div key={8}> {issue}</div>}
		</>
	);
};

const BookDiv = (props: Props) => {
	const {
		collection,
		content: { hideIsbn, hideBookPublicationDate, hideCopyrightYear, hideEdition },
	} = props;
	const { isbn, copyright, published, edition } = BookMetadata(collection);

	return (
		<>
			{isbn && !hideIsbn && <div key={3}> {isbn}</div>}
			{copyright && !hideCopyrightYear && <div key={5}>{copyright}</div>}
			{published && !hideBookPublicationDate && <div key={4}> {published}</div>}
			{edition && !hideEdition && <div key={6}> {edition}</div>}
		</>
	);
};

const ConferenceDiv = (props: Props) => {
	const {
		collection,
		content: { hideTheme, hideAcronym, hideConferenceDate, hideLocation },
	} = props;
	const { theme, acronym, location, conferenceDate } = ConferenceMetadata(collection);

	return (
		<>
			{theme && !hideTheme && <div key={3}> {theme}</div>}
			{acronym && !hideAcronym && <div key={4}> {acronym}</div>}
			{location && !hideLocation && <div key={5}>{location}</div>}
			{conferenceDate && !hideConferenceDate && (
				<div key={6}>Date of conference {conferenceDate}</div>
			)}
		</>
	);
};

const LayoutCollectionHeader = (props: Props) => {
	const {
		collection,
		content: { hideByline, hideContributors, hideCollectionKind, hideDate, hideDoi },
		content,
	} = props;
	const contributors = getAllCollectionContributors(collection);
	const bylineContributors = contributors.filter((c) => c.isAuthor);
	const schema = getSchemaForKind(collection.kind)!;
	const doi = getCollectionDoi(collection);

	const detailsRowElements = [
		!hideCollectionKind && (
			<div className="collection-kind" key={0}>
				<Icon icon={schema.bpDisplayIcon} />
				{capitalize(schema.label.singular)}
			</div>
		),
		!hideDate && <div key={1}>Created {formatDate(collection.createdAt)}</div>,
		doi && !hideDoi && (
			<ClickToCopyButton
				className="click-to-copy"
				copyString={`https://doi.org/${doi}`}
				beforeCopyPrompt="Copy doi.org link"
				icon={null}
				small
				key={2}
			>
				{(handleClick) => (
					<Button as="a" onClick={handleClick}>
						{doi}
					</Button>
				)}
			</ClickToCopyButton>
		),
		collection.kind === 'issue' && <IssueDiv collection={collection} content={content} />,
		collection.kind === 'book' && <BookDiv collection={collection} content={content} />,
		collection.kind === 'conference' && (
			<ConferenceDiv collection={collection} content={content} />
		),
	].filter((x) => x);

	return (
		<div className="layout-collection-header-component">
			<GridWrapper columnClassName="inner">
				<h1>{collection.title}</h1>
				{bylineContributors && !hideByline && (
					<Byline
						contributors={bylineContributors}
						renderSuffix={() => {
							return (
								!hideContributors &&
								contributors.length > 0 && (
									<ContributorAvatars
										attributions={contributors}
										truncateAt={8}
									/>
								)
							);
						}}
					/>
				)}
				{detailsRowElements.length > 0 && (
					<div className="details-row">{detailsRowElements}</div>
				)}
			</GridWrapper>
		</div>
	);
};

export default LayoutCollectionHeader;
