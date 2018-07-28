import React from 'react';
import PropTypes from 'prop-types';
import PubPresSideUser from 'components/PubPresSideUser/PubPresSideUser';

require('./pubSideCollaborators.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	// setOptionsMode: PropTypes.func.isRequired,
};

const PubSideCollaborators = function(props) {
	// const authors = props.pubData.collaborators.filter((collaborator)=> {
	// 	return collaborator.Collaborator.isAuthor;
	// });
	// const contributors = props.pubData.collaborators.filter((collaborator)=> {
	// 	return collaborator.Collaborator.isContributor;
	// });
	const authors = props.pubData.attributions.filter((attribution)=> {
		return attribution.isAuthor;
	});
	const contributors = props.pubData.attributions.filter((attribution)=> {
		return !attribution.isAuthor;
	});

	return (
		<div className="pub-side-collaborators-component">
			{!!authors.length &&
				<div>
					<div className="header-title">Authors</div>
					{authors.sort((foo, bar)=> {
						if (foo.order < bar.order) { return -1; }
						if (foo.order > bar.order) { return 1; }
						if (foo.createdAt < bar.createdAt) { return 1; }
						if (foo.createdAt > bar.createdAt) { return -1; }
						return 0;
					}).map((item)=> {
						return <PubPresSideUser user={item.user} key={item.id} />;
					})}
				</div>
			}
			{!!contributors.length &&
				<div>
					<div className="header-title">Contributors</div>
					{contributors.sort((foo, bar)=> {
						if (foo.order < bar.order) { return -1; }
						if (foo.order > bar.order) { return 1; }
						if (foo.createdAt < bar.createdAt) { return 1; }
						if (foo.createdAt > bar.createdAt) { return -1; }
						return 0;
					}).map((item)=> {
						return <PubPresSideUser user={item.user} key={item.id} />;
					})}
				</div>
			}
		</div>
	);
};

PubSideCollaborators.propTypes = propTypes;
export default PubSideCollaborators;
