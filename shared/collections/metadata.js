import metadataSchemas, { getSchemaForKind } from './schemas';

export const getAllSchemaKinds = () => metadataSchemas.map((s) => s.kind);

export const normalizeMetadataToKind = (metadata, kind, context) => {
	const { metadata: shape } = getSchemaForKind(kind);
	const res = {};
	shape.forEach((field) => {
		const { name, derivedFrom, hintDerivedFrom } = field;
		if (derivedFrom) {
			res[name] = derivedFrom(context);
		} else {
			const existingValue = metadata[name];
			if (typeof existingValue !== 'undefined') {
				res[name] = existingValue;
			} else if (hintDerivedFrom) {
				res[name] = hintDerivedFrom(context);
			}
		}
	});
	return res;
};

export const enumerateMetadataFields = (metadata, kind) => {
	const { metadata: shape } = getSchemaForKind(kind);
	return shape.map((field) => {
		const { name, label, derivedFrom, isMulti } = field;
		return {
			name: name,
			label: label,
			isMulti: isMulti,
			value: metadata[name],
			derived: !!derivedFrom,
		};
	});
};
