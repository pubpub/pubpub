import React from 'react';
import PropTypes from 'prop-types';
import PubPreview from 'components/PubPreview/PubPreview';

const propTypes = {
	layoutIndex: PropTypes.number.isRequired,
	content: PropTypes.object.isRequired,
	pubRenderList: PropTypes.array.isRequired,
	isLoading: PropTypes.bool.isRequired,
	/* Expected content */
	/* title, size, limit, pubIds */
};

const LayoutPubs = function(props) {
	const size = props.content.size;
	const displayLimit = props.content.limit || Math.max(4, props.pubRenderList.length);
	const emptyPreviews = [];
	for (let index = 0; index < displayLimit; index += 1) {
		emptyPreviews.push(null);
	}
	const previews = [...props.content.pubIds, ...emptyPreviews].slice(0, displayLimit);
	const selectOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	// const dataAvailable = props.pubRenderList.reduce((prev, curr)=> {
	// 	if (curr.slug) { return true; }
	// 	return prev;
	// }, false);
	/* Show limit when loading */
	/* Once data is loaded, only show blocks if there was a pub available */
	const renderItems = previews.filter((item, index)=> {
		const pub = props.pubRenderList[index];
		return props.isLoading || (pub && pub.slug);
	});
	return (
		<div className="layout-editor-pubs-component">
			<div className="block-content">
				{props.content.title &&
					<div className="row">
						<div className="col-12">
							<h3>{props.content.title}</h3>
						</div>
					</div>
				}

				<div className="row">
					{renderItems.map((item, index)=> {
						const selectedPub = props.pubRenderList[index] || { collaborators: [] };
						return (
							<div key={`preview-${props.layoutIndex}-${index}`} className={size === 'medium' ? 'col-6' : 'col-12'}>
								<PubPreview
									title={selectedPub.title}
									description={selectedPub.description}
									slug={selectedPub.slug}
									bannerImage={selectedPub.avatar}
									size={size}
									publicationDate={selectedPub.firstPublishedAt}
									collaborators={selectedPub.collaborators.filter((collaborator)=> {
										return collaborator.Collaborator.isContributor;
									})}
									authors={selectedPub.collaborators.filter((collaborator)=> {
										return collaborator.Collaborator.isAuthor;
									})}
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};

LayoutPubs.propTypes = propTypes;
export default LayoutPubs;
