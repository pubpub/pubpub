export default (relatedItems) => {
	return {
		program: {
			'@name': 'relations',
			related_item: relatedItems.map(
				({ isIntraWork, identifier, identifierType, relationshipType }) => {
					const attrs = {
						'@identifier-type': identifierType,
						'@relationship-type': relationshipType,
						'#text': identifier,
					};

					return { [isIntraWork ? 'intra_work_relation' : 'inter_work_relation']: attrs };
				},
			),
		},
	};
};
