import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	className: PropTypes.string,
};

const defaultProps = {
	className: '',
};

const Image = function(props) {
	const sizes = [50, 320, 480, 500, 1024];
	const srcSet = sizes.reduce((prev, curr)=> {
		return prev + `https://jake.pubpub.org/unsafe/${curr}x0/${props.src} ${curr}w, `;
	}, '');
	console.log(srcSet);
	return (
		<img
			srcSet={srcSet}
			// sizes={'(max-width: 700px) 280px, (max-width: 800px) 480px, 1024'}
			sizes={'100vw'}
			src={props.src}
			alt={props.alt}
			className={props.className}
		/>
	);
};

Image.defaultProps = defaultProps;
Image.propTypes = propTypes;
export default Image;

// https://ericportis.com/posts/2014/srcset-sizes/