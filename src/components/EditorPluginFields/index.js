import assetField from './assetField';
import alignField from './alignField';
import selectionField from './selectionField';
import sizeField from './sizeField';
import referenceField from './referenceField';
import urlField from './urlField';

import baseTextField from './baseTextField';
import baseTextAreaField from './baseTextAreaField';
import baseRadioField from './baseRadioField';

export default {
	'asset': assetField,
	'selection': selectionField,
	'text': baseTextField,
	'textArea': baseTextAreaField,
	'align': alignField,
	'size': sizeField,
	'reference': referenceField,
	'url': urlField,
	'radio': baseRadioField

	// 'size' : (radio with small, medium, large and %),
	// 'align' : (radio with left, right and full)
	// 'caption' : (text field)
	// 'reference' : (dropdown like assets that filters on references instead)
	// 'assetsMultiple' : (takes multiple assets, e.g. for a gallery)
	// 'text' : basic text field
};
