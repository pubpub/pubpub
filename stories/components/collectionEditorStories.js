import * as React from 'react';
import { storiesOf } from '@storybook/react';

import CollectionEditor from 'components/CollectionEditor/CollectionEditor';

const TEST_COLLECTION = {
	kind: 'book',
	id: 'pretend-its-a-uuid',
	title: 'A Real Life Book',
};

const TEST_AUTHORS = {
	ANNE: { name: 'Anne Burns' },
	CARLOS: { name: 'Carlos Delgado' },
	EMILY: { name: 'Emily Firenze' },
	GRANT: { name: 'Grant Huang' },
};

const TEST_PUB_TAGS = {
	GOOD: { tag: { title: 'Good' } },
	BAD: { tag: { title: 'Bad' } },
};

const TEST_PUBS = [
	{ id: '0', title: 'A pub', attributions: [TEST_AUTHORS.ANNE], pubTags: [TEST_PUB_TAGS.GOOD] },
	{ id: '1', title: 'Another pub', attributions: [TEST_AUTHORS.CARLOS], pubTags: [] },
	{
		id: '2',
		title: 'Wow, yet another pub',
		attributions: [TEST_AUTHORS.ANNE, TEST_AUTHORS.EMILY],
		pubTags: [],
	},
	{
		id: '3',
		title: 'Where are we getting all of these pubs?',
		attributions: [TEST_AUTHORS.GRANT],
		pubTags: [TEST_PUB_TAGS.BAD],
	},
];

storiesOf('Components/Collections/CollectionEditor', module).add('default', () => (
	<CollectionEditor collection={TEST_COLLECTION} pubs={TEST_PUBS} />
));
