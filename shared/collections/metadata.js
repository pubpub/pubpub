import metadataSchemas, { getSchemaForKind } from './schemas';

export const getAllSchemaKinds = () => metadataSchemas.map((s) => s.kind);

export const normalizeMetadataToKind = (metadata, kind, context) => {
	const { metadata: shape } = getSchemaForKind(kind);
	const res = {};
	shape.forEach((entry) => {
		const { field, derivedFrom, hintDerivedFrom } = entry;
		if (derivedFrom) {
			res[field] = derivedFrom(context);
		} else {
			const existingValue = metadata[field];
			if (typeof existingValue !== 'undefined') {
				res[field] = existingValue;
			} else if (hintDerivedFrom) {
				res[field] = hintDerivedFrom(context);
			}
		}
	});
	return res;
};

export const enumerateMetadataFields = (metadata, kind) => {
	const { metadata: shape } = getSchemaForKind(kind);
	return shape.map((entry) => {
		const { field, label, derivedFrom } = entry;
		return { field: field, label: label, value: metadata[field], derived: !!derivedFrom };
	});
};
