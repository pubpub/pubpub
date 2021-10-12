import React from 'react';
import { Card, Checkbox } from '@blueprintjs/core';
import { Collection } from 'types';

import { LayoutBlockCollectionHeader } from 'utils/layout';
import getCollectionDoi from 'utils/collections/getCollectionDoi';

type Content = LayoutBlockCollectionHeader['content'];

type Props = {
	content: Content;
	collection: Collection;

	onChange: (nextContent: Partial<Content>) => unknown;
};

const PreviewElements = (props: Props) => {
	const { content, onChange, collection } = props;
	const { hideDoi, hideCollectionKind, hideByline, hideContributors, hideDate } = content;
	const doi = getCollectionDoi(collection);

	return (
		<Card className="layout-editor-pubs_preview-elements-component">
			<Checkbox
				checked={!hideByline}
				onChange={() => onChange({ hideByline: !hideByline })}
				label="Byline"
			/>
			<Checkbox
				disabled={hideByline}
				checked={hideByline ? false : !hideContributors}
				onChange={() => onChange({ hideContributors: !hideContributors })}
				label="Contributors"
			/>
			<Checkbox
				checked={!hideCollectionKind}
				onChange={() => onChange({ hideCollectionKind: !hideCollectionKind })}
				label="Collection kind"
			/>
			<Checkbox
				checked={!hideDate}
				onChange={() => onChange({ hideDate: !hideDate })}
				label="Creation date"
			/>
			<Checkbox
				disabled={!doi}
				checked={doi ? !hideDoi : false}
				onChange={() => onChange({ hideDoi: !hideDoi })}
				label="DOI"
			/>
		</Card>
	);
};

export default PreviewElements;
