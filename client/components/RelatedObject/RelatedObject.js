import { Card } from '@blueprintjs/core';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';

require('./relatedObject.scss');

const RelatedObject = (props) => {
	const [open, setOpen] = useState(false);
	const handleToggleDescriptionClick = useCallback((e) => {
		e.preventDefault();
		setOpen(open => !open);
	}, []);
	const publishedAt = dateFormat(props.publishedAt, 'mmm dd, yyyy')

	return (
		<article className="related-object-component">
			<div className="top">
				{props.image && (
					<div className="top-left">
						<img src={props.image} alt="" />
					</div>
				)}
				<div className="top-right">
					<h5>{props.title}</h5>
					<div>by {props.authors.join(", ")}</div>
					<ul class="metadata">
						<li>Published on {publishedAt}</li>
						<li>
							<a href={props.url}>{props.url}</a>
						</li>
						<li>
							<a onClick={handleToggleDescriptionClick}>
								{open ? "Hide Description" : "Show Description"}
							</a>
						</li>
					</ul>
				</div>
			</div>
			<details open={open}>
				<summary>Description</summary>
				<hr />
				<p>{props.description}</p>
			</details>
		</article>
	);
};

RelatedObject.propTypes = {
	title: PropTypes.string.isRequired,
	authors: PropTypes.arrayOf(PropTypes.string).isRequired,
	image: PropTypes.string,
	url: PropTypes.string.isRequired,
	publishedAt: PropTypes.number.isRequired,
	description: PropTypes.string.isRequired,
};

export default RelatedObject;