import React from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { getResizedUrl } from 'utilities';

require('./pubHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	locationData: PropTypes.object,
	setSettingsMode: PropTypes.func.isRequired,
};

const defaultProps = {
	locationData: { params: {} },
};

const PubHeader = function(props) {
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
	const activeVersion = pubData.activeVersion;
	const numChapters = activeVersion && Array.isArray(activeVersion.content) && activeVersion.content.length;
	// const activeChapterId = props.locationData.params.chapterId ? props.locationData.params.chapterId - 1 : 0;
	// const activeChapterTitle = Array.isArray(props.pubData.activeVersion.content) && props.pubData.activeVersion.content[activeChapterId].title;
	const sortedVersionsList = pubData.versions.sort((foo, bar)=>{
		if (foo.createdAt < bar.createdAt) { return 1; }
		if (foo.createdAt > bar.createdAt) { return -1; }
		return 0;
	});

	const hasChapters = activeVersion && Array.isArray(activeVersion.content);
	const chapterId = hasChapters ? props.locationData.params.chapterId || '' : undefined;

	const chapterIds = hasChapters
		? pubData.activeVersion.content.map((chapter)=> {
			return chapter.id || '';
		})
		: [];
	const currentChapterIndex = chapterIds.reduce((prev, curr, index)=> {
		if (chapterId === curr) { return index; }
		return prev;
	}, undefined);

	const numDiscussions = pubData.discussions.length;
	const numCollaborators = pubData.collaborators.filter((item)=> {
		return item.Collaborator.isAuthor || item.Collaborator.isContributor;
	}).length;
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
									<button
										className="pt-button pt-small"
										type="button"
										onClick={()=> {
											props.setSettingsMode('pub');
										}}
									>
										Pub Settings
									</button>

									<button
										className="pt-button pt-small"
										type="button"
									>
										Share
									</button>
								</div>
							</div>

							{!mode &&
								<h1>{pubData.title}</h1>
							}

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
									href="#discussions"
									// className="pt-button pt-minimal discussions"
								>
									<span className="pt-icon-standard pt-icon-chat" />
									{numDiscussions} Discussion{numDiscussions === 1 ? '' : 's'}
								</a>
								<a
									href={`/pub/${pubData.slug}/collaborators`}
									// className="pt-button pt-minimal collaborators"
									onClick={(evt)=> {
										evt.preventDefault();
										props.setSettingsMode('collaborators');
									}}
								>
									<span className="pt-icon-standard pt-icon-team" />
									{numCollaborators} Collaborator{numCollaborators === 1 ? '' : 's'}
								</a>
								<a>
									<span className="pt-icon-standard pt-icon-multi-select" />
									{pubData.versions.length} Saved Version{pubData.versions.length === 1 ? '' : 's'}
								</a>

								{/*numChapters &&
									<a
										href={`/pub/${pubData.slug}/contents${queryObject.version ? `?version=${queryObject.version}` : ''}`}
										className="pt-button pt-minimal chapters"
										onClick={(evt)=> {
											evt.preventDefault();
											props.setSettingsMode('chapters');
										}}
									>
										{currentChapterIndex + 1} of {numChapters}
										<span className="pt-icon-standard pt-align-right pt-icon-properties" />
									</a>
								*/}
							</div>
							<div className="details">
								{!pubData.isDraft &&
									<a
										href={`/pub/${pubData.slug}/versions`}
										// className="pt-button pt-minimal date"
										onClick={(evt)=> {
											evt.preventDefault();
											props.setSettingsMode('versions');
										}}
									>
										<span>{sortedVersionsList[sortedVersionsList.length - 1].id !== activeVersion.id ? 'Updated ' : ''}{dateFormat(pubData.activeVersion.createdAt, 'mmm dd, yyyy')}</span>
									</a>
								}
								{!pubData.isDraft &&
									<a href={`/pub/${pubData.slug}/draft`}>
										Go to Working Draft
									</a>
								}
								{pubData.isDraft && !!sortedVersionsList.length &&
									<a href={`/pub/${pubData.slug}`}>
										Go to Newest Saved Version
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

PubHeader.propTypes = propTypes;
PubHeader.defaultProps = defaultProps;
export default PubHeader;
