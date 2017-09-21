import React from 'react';
import { storiesOf } from '@storybook/react';
import ImageCropper from 'components/ImageCropper/ImageCropper';

const wrapperStyle = { margin: '1em', padding: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.2)' };
const onUpload = (url)=> {
	console.log(url);
};
const onCancel = ()=> {
	console.log('Canceled');
};

storiesOf('ImageCropper', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<ImageCropper
				image={'https://assets.pubpub.org/_testing/51505996842023.jpg'}
				onCancel={onCancel}
				onUploaded={onUpload}
			/>
		</div>
	</div>
));
