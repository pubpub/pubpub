import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { getResizedUrl } from 'utilities';
import { EditableText } from '@blueprintjs/core';

require('./pubHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	locationData: PropTypes.object,
	setOptionsMode: PropTypes.func.isRequired,
};

const defaultProps = {
	locationData: { params: {} },
};

const PubHeader = function(props) {
	const pubData = props.pubData;
	// const authors = pubData.collaborators.filter((collaborator)=> {
	// 	return collaborator.Collaborator.isAuthor;
	// });
	const authors = pubData.attributions.filter((attribution)=> {
		return attribution.isAuthor;
	});
	const useHeaderImage = pubData.useHeaderImage && pubData.avatar;
	const backgroundStyle = {};
	if (useHeaderImage) {
		const resizedBackground = getResizedUrl(pubData.avatar, 'fit-in', '1500x600');
		backgroundStyle.backgroundImage = `url("${resizedBackground}")`;
		backgroundStyle.color = 'white';
	}
	const mode = props.locationData.params.mode;
	const subMode = props.locationData.params.subMode;
	const activeVersion = pubData.activeVersion;
	const sortedVersionsList = pubData.versions.sort((foo, bar)=>{
		if (foo.createdAt < bar.createdAt) { return 1; }
		if (foo.createdAt > bar.createdAt) { return -1; }
		return 0;
	});

	const numNewerVersions = !pubData.isDraft && pubData.versions.reduce((prev, curr)=> {
		if (curr.createdAt > activeVersion.createdAt) { return prev + 1; }
		return prev;
	}, 0);
	const numDiscussions = pubData.discussions.length;
	// const numCollaborators = pubData.collaborators.filter((item)=> {
	// 	return item.Collaborator.isAuthor || item.Collaborator.isContributor;
	// }).length;
	const numCollaborators = pubData.attributions.length;

	return (
		<div className={`pub-header-component ${mode ? 'mode' : ''}`} style={backgroundStyle}>
			<div className={`wrapper ${useHeaderImage ? 'dim' : ''}`}>
				<div className="container pub">
					<div className="row">
						<div className="col-12">
							<div className="tags-buttons-wrapper">
								<div className="tags">
									{pubData.collections.sort((foo, bar)=> {
										if (foo.title.toLowerCase() < bar.title.toLowerCase()) { return -1; }
										if (foo.title.toLowerCase() > bar.title.toLowerCase()) { return 1; }
										return 0;
									}).map((item)=> {
										return <a key={`footer-collection-${item.id}`} href={`/${item.slug}`} className="pt-tag pt-intent-primary pt-minimal">{item.title}</a>;
									})}
								</div>
								<div className="buttons">
									{!pubData.isDraft && (pubData.isDraftViewer || pubData.isDraftEditor || pubData.isManager) &&
										<a
											className="pt-button pt-small"
											href={`/pub/${pubData.slug}/draft`}
										>
											Go To Working Draft
										</a>
									}
									<button
										className="pt-button pt-small"
										type="button"
										onClick={()=> {
											props.setOptionsMode('details');
										}}
									>
										Options
									</button>

									<button
										className="pt-button pt-small"
										type="button"
										onClick={()=> {
											props.setOptionsMode('sharing');
										}}
									>
										Share
									</button>
								</div>
							</div>

							{!mode &&
								<h1>{pubData.title}</h1>
							}
							{/*<h1>
								<EditableText
									placeholder="Add a Pub Title"
									isEditing={true}
									multiline={true}
									confirmOnEnterKey={true}
									// onCancel
									// onChange
									// onConfirm
									// value
								/>
							</h1>*/}

							{mode &&
								<a href={`/pub/${pubData.slug}`}><h1>{pubData.title}</h1></a>
							}
							{mode &&
								<ul className="pt-breadcrumbs">
									<li><a className="pt-breadcrumb" href={`/pub/${pubData.slug}`}>Pub</a></li>
									{!subMode &&
										<li><span className="pt-breadcrumb">{mode}</span></li>
									}
									{subMode &&
										<li><a className="pt-breadcrumb" href={`/pub/${pubData.slug}/${mode}`}>{mode}</a></li>
									}
									{subMode &&
										<li><span className="pt-breadcrumb">Thread #{subMode}</span></li>
									}
								</ul>
							}
							{pubData.description &&
								<div className="description">{pubData.description}</div>
							}

							{!!authors.length &&
								<div className="authors">
									<span>by </span>
									{authors.sort((foo, bar)=> {
										if (foo.order < bar.order) { return -1; }
										if (foo.order > bar.order) { return 1; }
										if (foo.createdAt < bar.createdAt) { return 1; }
										if (foo.createdAt > bar.createdAt) { return -1; }
										return 0;
									}).map((author, index)=> {
										const separator = index === authors.length - 1 || authors.length === 2 ? '' : ', ';
										const prefix = index === authors.length - 1 && index !== 0 ? ' and ' : '';
										const user = author.user;
										if (user.slug) {
											return (
												<span key={`author-${user.id}`}>
													{prefix}
													<a href={`/user/${user.slug}`}>{user.fullName}</a>
													{separator}
												</span>
											);
										}
										return <span key={`author-${user.id}`}>{prefix}{user.fullName}{separator}</span>;
									})}
								</div>
							}
							<div className="details">
								{!pubData.isDraft &&
									<a
										// href={`/pub/${pubData.slug}/versions`}
										onClick={(evt)=> {
											evt.preventDefault();
											props.setOptionsMode('versions');
										}}
									>
										<span>{sortedVersionsList[sortedVersionsList.length - 1].id !== activeVersion.id ? 'Updated ' : ''}{dateFormat(pubData.activeVersion.createdAt, 'mmm dd, yyyy')}</span>
									</a>
								}
								<a
									href="#discussions"
								>
									{/* <span className="pt-icon-standard pt-icon-chat" /> */}
									{numDiscussions} Discussion{numDiscussions === 1 ? '' : 's'}
								</a>
								<a
									// href={`/pub/${pubData.slug}/collaborators`}
									onClick={(evt)=> {
										evt.preventDefault();
										props.setOptionsMode('collaborators');
									}}
								>
									{/* <span className="pt-icon-standard pt-icon-team" /> */}
									{numCollaborators} Collaborator{numCollaborators === 1 ? '' : 's'}
								</a>
								<a
									// href={`/pub/${pubData.slug}/versions`}
									onClick={(evt)=> {
										evt.preventDefault();
										props.setOptionsMode('versions');
									}}
								>
									{/* If is draft, say total number of saved versions */}
									{pubData.isDraft &&
										<span>{pubData.versions.length} Saved Version{pubData.versions.length === 1 ? '' : 's'}</span>
									}

									{/* If not draft, and newer versions, say numNewerVersions */}
									{!pubData.isDraft && !!numNewerVersions &&
										<span>{numNewerVersions} Newer Version{pubData.versions.length === 1 ? '' : 's'}</span>
									}
									
									{/* If not draft, and no newer versions, say numVersions - 1 Older Versions */}
									{!pubData.isDraft && !numNewerVersions &&
										<span>{pubData.versions.length - 1} Older Version{pubData.versions.length === 1 ? '' : 's'}</span>
									}
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PubHeader.propTypes = propTypes;
PubHeader.defaultProps = defaultProps;
export default PubHeader;
