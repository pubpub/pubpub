import dateFormat from 'dateformat';
import React, { useCallback, useState } from 'react';
import { Button } from 'reakit/Button';

import { Byline } from 'components';
import { pubEdgeType } from './constants';

require('./pubEdge.scss');

export const propTypes = {
	pubEdge: pubEdgeType.isRequired,
};

const PubEdge = (props) => {
	const {
		pubEdge: { avatar, contributors, description, publicationDate, title, url },
	} = props;
	const [open, setOpen] = useState(false);
	const handleToggleDescriptionClick = useCallback(
		(e) => {
			e.preventDefault();
			setOpen(!open);
		},
		[open],
	);
	const publishedAt = dateFormat(publicationDate, 'mmm dd, yyyy');

	return (
		<article className="pub-edge-component">
			<div className="top">
				{avatar && (
					<div className="top-left">
						<img src={avatar} alt="" />
					</div>
				)}
				<div className="top-right">
					<h4>{title}</h4>
					<Byline contributors={contributors} />
					<ul className="metadata">
						<li>Published on {publishedAt}</li>
						<li>
							<a href={url}>{url}</a>
						</li>
						<li>
							<Button as="a" onClick={handleToggleDescriptionClick}>
								{open ? 'Hide Description' : 'Show Description'}
							</Button>
						</li>
					</ul>
				</div>
			</div>
			<details open={open}>
				<summary>Description</summary>
				<hr />
				<p>{description}</p>
			</details>
		</article>
	);
};

PubEdge.propTypes = propTypes;

export default PubEdge;
