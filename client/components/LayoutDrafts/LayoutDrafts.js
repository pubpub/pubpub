import React from 'react';
import PropTypes from 'prop-types';
import PubPreview from 'components/PubPreview/PubPreview';

const propTypes = {
	content: PropTypes.object.isRequired,
	pubs: PropTypes.array.isRequired,
	/* Expected content */
	/* title */
};

const LayoutDrafts = function(props) {
	if (!props.pubs.length) { return null; }
	return (
		<div className="layout-drafts-component">
			<div className="block-content">
				{props.content.title &&
					<div className="row">
						<div className="col-12 drafts-header">
							<h2>{props.content.title}</h2>
							<div>The following are unpublished pubs that are open to collaboration.</div>
						</div>
					</div>
				}
				<div className="row">
					{props.pubs.sort((foo, bar)=> {
						if (foo.createdAt < bar.createdAt) { return 1; }
						if (foo.createdAt > bar.createdAt) { return -1; }
						return 0;
					}).map((pub)=> {
						return (
							<div className="col-12" key={`pub-${pub.id}`}>
								<PubPreview
									title={pub.title}
									description={pub.description}
									slug={pub.slug}
									bannerImage={pub.avatar}
									size="small"
									publicationDate={pub.updatedAt}
									collaborators={pub.collaborators.filter((item)=> {
										return !item.Collaborator.isAuthor;
									})}
									authors={pub.collaborators.filter((item)=> {
										return item.Collaborator.isAuthor;
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

LayoutDrafts.propTypes = propTypes;
export default LayoutDrafts;
