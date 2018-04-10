import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem } from '@blueprintjs/core';
import { getResizedUrl } from 'utilities';

require('./pubPresHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	setOverlayPanel: PropTypes.func.isRequired,
	locationData: PropTypes.object,
	loginData: PropTypes.object.isRequired,
};

const defaultProps = {
	locationData: { params: {} },
};

const PubPresHeader = function(props) {
	const pubData = props.pubData;
	const authors = pubData.collaborators.filter((collaborator)=> {
		return collaborator.Collaborator.isAuthor;
	});
	const useHeaderImage = pubData.useHeaderImage && pubData.avatar;
	const backgroundStyle = {};
	if (useHeaderImage) {
		const resizedBackground = getResizedUrl(pubData.avatar, 'fit-in', '1500x600');
		backgroundStyle.backgroundImage = `url("${resizedBackground}")`;
		backgroundStyle.color = 'white';
	}
	const queryObject = props.locationData.query;
	const mode = props.locationData.params.mode;
	const subMode = props.locationData.params.subMode;
	const numChapters = Array.isArray(props.pubData.versions[0].content) && props.pubData.versions[0].content.length;
	const activeChapterId = props.locationData.params.chapterId ? props.locationData.params.chapterId - 1 : 0;
	// const activeChapterTitle = Array.isArray(props.pubData.versions[0].content) && props.pubData.versions[0].content[activeChapterId].title;
	const sortedVersionsList = pubData.versionsList.sort((foo, bar)=>{
		if (foo.createdAt < bar.createdAt) { return 1; }
		if (foo.createdAt > bar.createdAt) { return -1; }
		return 0;
	});

	return (
		<div className={`pub-pres-header-component ${mode ? 'mode' : ''}`} style={backgroundStyle}>
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
									<div className="pt-button-group pt-minimal">
										{pubData.localPermissions !== 'none' &&
											<a href={`/pub/${pubData.slug}/collaborate`} className="pt-button pt-icon-edit2">Edit Pub</a>
										}

										<Popover
											content={
												<Menu>
													<MenuItem
														text="Share"
														label={<span className="pt-icon-standard pt-icon-share" />}
														onClick={()=> {
															props.setOverlayPanel('share');
														}}
													/>
													<MenuItem
														text="Cite"
														label={<span className="pt-icon-standard pt-icon-bookmark" />}
														onClick={()=> {
															props.setOverlayPanel('cite');
														}}
													/>
													{props.loginData.isAdmin &&
														<MenuItem
															text="DOI"
															label={<span className="pt-icon-standard pt-icon-doi" />}
															onClick={()=> {
																props.setOverlayPanel('doi');
															}}
														/>
													}
													{numChapters &&
														<MenuItem
															text="Chapters"
															label={<span className="pt-icon-standard pt-icon-properties" />}
															onClick={()=> {
																props.setOverlayPanel('chapters');
															}}
														/>
													}
												</Menu>
											}
											popoverClassName="pt-minimal"
											interactionKind={PopoverInteractionKind.CLICK}
											position={Position.BOTTOM_RIGHT}
											transitionDuration={-1}
											inheritDarkTheme={false}
										>
											<button className="pt-button pt-icon-menu" />
										</Popover>

										{/* <a
											href={`/pub/${pubData.slug}/invite`}
											className="pt-button"
											onClick={(evt)=> {
												evt.preventDefault();
												props.setOverlayPanel('invite');
											}}
										>
											Invite Reviewer
										</a> */}
										{/* <a href="/" className="pt-button">More</a> */}
									</div>
								</div>
							</div>

							{!mode &&
								<h1>{pubData.title}</h1>
							}
							{/* !!activeChapterTitle &&
								<h2>{activeChapterTitle}</h2>
							*/}
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
										if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
										if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
										if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
										if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
										return 0;
									}).map((author, index)=> {
										const separator = index === authors.length - 1 || authors.length === 2 ? '' : ', ';
										const prefix = index === authors.length - 1 && index !== 0 ? ' and ' : '';
										if (author.slug) {
											return (
												<span key={`author-${author.id}`}>
													{prefix}
													<a href={`/user/${author.slug}`}>{author.fullName}</a>
													{separator}
												</span>
											);
										}
										return <span key={`author-${author.id}`}>{prefix}{author.fullName}{separator}</span>;
									})}
								</div>
							}
							<div className="details">
								<a
									href={`/pub/${pubData.slug}/versions`}
									className="pt-button pt-minimal date"
									onClick={(evt)=> {
										evt.preventDefault();
										props.setOverlayPanel('versions');
									}}
								>
									<span>{sortedVersionsList[sortedVersionsList.length - 1].id !== pubData.versions[0].id ? 'Updated ' : ''}{dateFormat(pubData.versions[0].createdAt, 'mmm dd, yyyy')}</span>
									<span>{pubData.versionsList.length}</span>
									<span className="pt-icon-standard pt-align-right pt-icon-multi-select" />
								</a>
								<a
									href="#discussions"
									className="pt-button pt-minimal discussions"
								>
									{pubData.discussions.length}
									<span className="pt-icon-standard pt-align-right pt-icon-chat" />
								</a>
								<a
									href={`/pub/${pubData.slug}/collaborators`}
									className="pt-button pt-minimal collaborators"
									onClick={(evt)=> {
										evt.preventDefault();
										props.setOverlayPanel('collaborators');
									}}
								>
									{pubData.collaborators.length}
									<span className="pt-icon-standard pt-align-right pt-icon-team" />
								</a>
								{numChapters &&
									<a
										href={`/pub/${pubData.slug}/chapters${queryObject.version ? `?version=${queryObject.version}` : ''}`}
										className="pt-button pt-minimal chapters"
										onClick={(evt)=> {
											evt.preventDefault();
											props.setOverlayPanel('chapters');
										}}
									>
										{activeChapterId + 1} of {numChapters}
										<span className="pt-icon-standard pt-align-right pt-icon-properties" />
									</a>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PubPresHeader.propTypes = propTypes;
PubPresHeader.defaultProps = defaultProps;
export default PubPresHeader;
