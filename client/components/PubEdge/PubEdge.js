import dateFormat from 'dateformat';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import { Byline } from 'components';

require('./pubEdge.scss');

export const propTypes = {
	title: PropTypes.string.isRequired,
	contributors: PropTypes.arrayOf(PropTypes.string).isRequired,
	image: PropTypes.string,
	url: PropTypes.string.isRequired,
	publishedAt: PropTypes.number.isRequired,
	description: PropTypes.string.isRequired,
};

const PubEdge = (props) => {
	const [open, setOpen] = useState(false);
	const handleToggleDescriptionClick = useCallback((e) => {
		e.preventDefault();
		setOpen((open) => !open);
	}, []);
	const publishedAt = dateFormat(props.publishedAt, 'mmm dd, yyyy');

	return (
		<article className="pub-edge-component">
			<div className="top">
				{props.image && (
					<div className="top-left">
						<img src={props.image} alt="" />
					</div>
				)}
				<div className="top-right">
					<h4>{props.title}</h4>
					<Byline contributors={props.contributors} />
					<ul className="metadata">
						<li>Published on {publishedAt}</li>
						<li>
							<a href={props.url}>{props.url}</a>
						</li>
						<li>
							<a onClick={handleToggleDescriptionClick}>
								{open ? 'Hide Description' : 'Show Description'}
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

PubEdge.propTypes = propTypes;

export default PubEdge;
