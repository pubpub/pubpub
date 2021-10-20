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
import {
	issueMetadata,
	bookMetadata,
	conferenceMetadata,
	getOrderedCollectionMetadataFields,
} from 'utils/collections/getMetadata';

require('./layoutCollectionHeader.scss');

type Props = {
	collection: Collection;
	content: LayoutBlockCollectionHeader['content'];
};

const issueDiv = (props: Props) => {
	const {
		collection,
		content: { hiddenMetadataFields },
	} = props;

	const {
		printIssn,
		electronicIssn,
		volume,
		issue,
		printPublicationDate,
		publicationDate,
	} = issueMetadata(collection);

	if (!hiddenMetadataFields) {
		return null;
	}
	return [
		printIssn && hiddenMetadataFields.includes('printIssn') && `ISSN: ${printIssn}`,
		electronicIssn && !hiddenMetadataFields && `e-ISSN: ${electronicIssn}`,
		volume && !hiddenMetadataFields && `Volume ${volume}`,
		issue && !hiddenMetadataFields && `Issue ${issue}`,
		printPublicationDate &&
			!hiddenMetadataFields &&
			`Printed ${formatDate(printPublicationDate)}`,
		publicationDate && !hiddenMetadataFields && `Published ${formatDate(publicationDate)}`,
	]
		.filter((x: any): x is string => !!x)
		.map((label) => <div key={label}>{label}</div>);
};

const BookDiv = (props: Props) => {
	const {
		collection,
		content: { hiddenMetadataFields },
	} = props;
	const { isbn, copyright, published, edition } = bookMetadata(collection);

	return (
		<>
			{isbn && !hiddenMetadataFields && <div>ISBN: {isbn}</div>}
			{copyright && !hiddenMetadataFields && <div>Copyright © {copyright}</div>}
			{published && !hiddenMetadataFields && <div>Published {formatDate(published)}</div>}
			{edition && !hiddenMetadataFields && <div>{edition} ed.</div>}
		</>
	);
};

const ConferenceDiv = (props: Props) => {
	const {
		collection,
		content: { hiddenMetadataFields },
	} = props;
	const { theme, acronym, location, date } = conferenceMetadata(collection);

	if (!hiddenMetadataFields) {
		return null;
	}

	return (
		<>
			{theme && !hiddenMetadataFields.includes('theme') && <div> {theme}</div>}
			{acronym && !hiddenMetadataFields.includes('acronym') && <div> {acronym}</div>}
			{location && !hiddenMetadataFields.includes('location') && <div>{location}</div>}
			{date && !hiddenMetadataFields.includes('date') && <div> {formatDate(date)}</div>}
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
		collection.kind === 'issue' && issueDiv(props),
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
