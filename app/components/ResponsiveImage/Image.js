import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	sizes: PropTypes.string,
	className: PropTypes.string,
};

const defaultProps = {
	sizes: '100vw',
	className: '',
};

const ResponsiveImage = function(props) {
	// https://ericportis.com/posts/2014/srcset-sizes/
	const sizes = [50, 256, 512, 1024, 2048];
	const srcSet = sizes.reduce((prev, curr)=> {
		return `${prev} https://jake.pubpub.org/unsafe/${curr}x0/${props.src} ${curr}w, `;
	}, '');
	return (
		<img
			srcSet={srcSet}
			// sizes={'(max-width: 700px) 100vw, (max-width: 800px) 324px, 1024'}
			sizes={props.sizes}
			src={props.src}
			alt={props.alt}
			className={props.className}
		/>
	);
};

ResponsiveImage.defaultProps = defaultProps;
ResponsiveImage.propTypes = propTypes;
export default ResponsiveImage;
