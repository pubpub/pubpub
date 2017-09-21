import React from 'react';
import { storiesOf } from '@storybook/react';
import ImageUpload from 'components/ImageUpload/ImageUpload';

const wrapperStyle = { margin: '1em', padding: '1em', boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.2)' };
const handleNewImage = (image)=> {
	console.log(image);
};

storiesOf('ImageUpload', module)
.add('Default', () => (
	<div>
		<div style={wrapperStyle}>
			<ImageUpload
				htmlFor={'input1'}
				label={'Avatar Image'}
				canClear={true}
				onNewImage={handleNewImage}
			/>
			<ImageUpload
				htmlFor={'input1a'}
				label={'Avatar Image (with crop)'}
				userCrop={true}
				onNewImage={handleNewImage}
			/>
			<ImageUpload
				htmlFor={'input2'}
				label={'Avatar Image'}
				defaultImage={'https://assets.pubpub.org/_testing/51505996842023.jpg'}
				canClear={true}
				onNewImage={handleNewImage}
				helperText={'Should be great than 1200px wide'}
			/>
			<ImageUpload
				htmlFor={'input3'}
				label={'Avatar Image'}
				defaultImage={'https://assets.pubpub.org/_testing/51505996842023.jpg'}
				canClear={true}
				width={150}
				onNewImage={handleNewImage}
			/>
		</div>
	</div>
));
