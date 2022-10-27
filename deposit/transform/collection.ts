import { Resource, ResourceKind } from '../types';
import { Collection } from 'types';

function getResourceKindForCollection(collection: Collection): ResourceKind {
	switch (collection.kind) {
		case 'tag':
		case 'issue':
			return ResourceKind.Journal;
		case 'book':
			return ResourceKind.Book;
		case 'conference':
			return ResourceKind.Conference;
	}
}

export function transformCollectionToResource(collection: Collection) {}
