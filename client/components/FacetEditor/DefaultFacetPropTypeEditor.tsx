// import React, { useMemo } from 'react';

// import { FacetPropType } from 'facets';

// import { PropTypeEditorProps, PropTypeEditorComponent, PropTypeEditorDefinition } from './types';
// import { String, OneOf } from './propTypeEditors';

// type ComponentProps<PropType extends FacetPropType> = {
// 	propType: PropType;
// } & PropTypeEditorProps<PropType>;

// const registerPropTypeEditors = (editors: PropTypeEditorDefinition<any>[]) => {
// 	const registry: Map<FacetPropType, PropTypeEditorComponent<any>> = new Map();
// 	editors.forEach((editor) => {
// 		const { propType, renderFn } = editor;
// 		registry.set(propType.identity ?? propType, renderFn);
// 	});
// 	return registry;
// };

// const propTypeEditors = registerPropTypeEditors([String, OneOf]);

// const getEditorComponentForPropType = (propType: FacetPropType) => {
// 	const valueFromEditors = propTypeEditors.get(propType.identity ?? propType);
// 	if (valueFromEditors) {
// 		return valueFromEditors;
// 	}
// 	throw new Error(`No editor component for prop type ${propType.name}: ${propType.postgresType}`);
// };

// const DefaultFacetPropTypeEditor = <PropType extends FacetPropType>(
// 	props: ComponentProps<PropType>,
// ) => {
// 	const { propType } = props;
// 	const Editor = useMemo(() => getEditorComponentForPropType(propType), [propType]);
// 	return <Editor {...props} />;
// };

// export default DefaultFacetPropTypeEditor;
