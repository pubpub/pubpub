import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, NonIdealState } from '@blueprintjs/core';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import LayoutPubs from 'components/LayoutPubs/LayoutPubs';
import LayoutHtml from 'components/LayoutHtml/LayoutHtml';
import LayoutDrafts from 'components/LayoutDrafts/LayoutDrafts';
import LayoutText from 'components/LayoutText/LayoutText';
import { hydrateWrapper, apiFetch, getDefaultLayout } from 'utilities';

require('./collection.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	collectionData: PropTypes.object.isRequired,
};

class Collection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			createPubIsLoading: false,
		};
		this.getComponentFromType = this.getComponentFromType.bind(this);
		this.generateRenderList = this.generateRenderList.bind(this);
		this.handleCreatePub = this.handleCreatePub.bind(this);
	}

	getComponentFromType(item, index, pubRenderLists) {
		const collectionData = this.props.collectionData || {};
		const pubs = collectionData.pubs || [];

		if (item.type === 'pubs') {
			return (
				<LayoutPubs
					key={`item-${item.id}`}
					layoutIndex={index}
					content={item.content}
					pubRenderList={pubRenderLists[index]}
					isLoading={!collectionData.id}
				/>
			);
		}
		if (item.type === 'text') {
			return (
				<LayoutText
					key={`item-${item.id}`}
					content={item.content}
				/>
			);
		}
		if (item.type === 'html') {
			return (
				<LayoutHtml
					key={`item-${item.id}`}
					content={item.content}
				/>
			);
		}
		if (item.type === 'drafts') {
			return (
				<LayoutDrafts
					key={`item-${item.id}`}
					content={item.content}
					pubs={pubs.filter((pub)=> {
						return !pub.firstPublishedAt;
					})}
				/>
			);
		}
		return null;
	}
	generateRenderList(layout) {
		const collectionData = this.props.collectionData || {};
		const pubs = collectionData.pubs || [];
		const allPubs = pubs.filter((item)=> {
			return item.firstPublishedAt;
		}).sort((foo, bar)=> {
			if (foo.firstPublishedAt < bar.firstPublishedAt) { return 1; }
			if (foo.firstPublishedAt > bar.firstPublishedAt) { return -1; }
			return 0;
		});
		const nonSpecifiedPubs = [...allPubs];
		const pubRenderLists = {};
		layout.forEach((block)=> {
			if (block.type === 'pubs') {
				const specifiedPubs = block.content.pubIds;
				nonSpecifiedPubs.forEach((pub, index)=> {
					if (specifiedPubs.indexOf(pub.id) > -1) {
						nonSpecifiedPubs.splice(index, 1);
					}
				});
			}
		});
		layout.forEach((block, index)=> {
			if (block.type === 'pubs') {
				const pubsById = pubs.reduce((prev, curr)=> {
					const output = prev;
					output[curr.id] = curr;
					return output;
				}, {});
				const renderList = block.content.pubIds.map((id)=> {
					return pubsById[id];
				});
				const limit = block.content.limit || (nonSpecifiedPubs.length + renderList.length);
				for (let pubIndex = renderList.length; pubIndex < limit; pubIndex += 1) {
					if (nonSpecifiedPubs.length) {
						renderList.push(nonSpecifiedPubs[0]);
						nonSpecifiedPubs.splice(0, 1);
					}
				}
				pubRenderLists[index] = renderList;
			}
		});
		return pubRenderLists;
	}

	handleCreatePub() {
		this.setState({ createPubIsLoading: true });
		return apiFetch('/api/pubs', {
			method: 'POST',
			body: JSON.stringify({
				collectionId: this.props.collectionData.id,
				communityId: this.props.communityData.id,
				createPubHash: undefined,
			})
		})
		.then((result)=> {
			// this.setState({ createPubIsLoading: false });
			window.location.href = result;
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ createPubIsLoading: false });
		});
	}

	render() {
		const collectionData = this.props.collectionData;
		const slug = this.props.locationData.params.slug;
		const title = this.props.communityData.collections.reduce((prev, curr)=> {
			if (curr.slug === '' && slug === undefined) { return curr.title; }
			if (curr.slug === slug) { return curr.title; }
			return prev;
		}, undefined);
		// if (!title) { return <NoMatch />; }
		if (!title) { return <h1>Nothing</h1>; }
		const numPublished = collectionData.pubs.reduce((prev, curr)=> {
			if (curr.firstPublishedAt) { return prev + 1; }
			return prev;
		}, 0);
		const publicDrafts = collectionData.pubs.filter((item)=> {
			return !item.firstPublishedAt;
		}).sort((foo, bar)=> {
			if (foo.updatedAt > bar.updatedAt) { return -1; }
			if (foo.updatedAt < bar.updatedAt) { return 1; }
			return 0;
		});
		const layout = collectionData.layout || getDefaultLayout(collectionData.isPage);
		const hasTextLayoutComponent = layout.reduce((prev, curr)=> {
			if (curr.type === 'text') { return true; }
			return prev;
		}, false);
		const pubRenderLists = this.generateRenderList(layout);
		return (
			<div id="collection-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
				>
					<div className="container">
						{((!collectionData.isPage && collectionData.isOpenSubmissions) || (title && title !== 'Home')) &&
							<div className="row">
								<div className="col-12">
									{!collectionData.isPage && collectionData.isOpenSubmissions &&
										<div className="create-pub-wrapper">
											{this.props.loginData.id &&
												<Button
													type="button"
													className="pt-button pt-intent-primary"
													loading={this.state.createPubIsLoading}
													onClick={this.handleCreatePub}
													text="Create Pub in Collection"
												/>
											}
											{!this.props.loginData.id &&
												<a
													href={`/login?redirect=${this.props.locationData.path}`}
													className="pt-button pt-intent-primary"
												>
													Login to Create Pub
												</a>
											}
											{collectionData.createPubMessage &&
												<a href={`/${collectionData.slug}/submit`} className="instructions-link">
													Submission Instructions
												</a>
											}
										</div>
									}
									{title && title !== 'Home' &&
										<h1 className="collection-title">{title}</h1>
									}
								</div>
							</div>
						}

						{layout.filter((item)=> {
							if (collectionData.id && !numPublished && item.type === 'pubs') {
								return false;
							}
							return true;
						}).map((item, index)=> {
							const editorTypeComponent = this.getComponentFromType(item, index, pubRenderLists);
							if (!editorTypeComponent) { return null; }
							return <div key={`block-${item.id}`} className="component-wrapper">{editorTypeComponent}</div>;
						})}

						{!publicDrafts.length && !!collectionData.id && !numPublished && !collectionData.isPage && !hasTextLayoutComponent &&
							<NonIdealState
								title="Empty Collection"
								description="This collection has no Pubs."
								visual="pt-icon-applications"
							/>
						}
					</div>
				</PageWrapper>
			</div>
		);
	}
}

Collection.propTypes = propTypes;
export default Collection;

hydrateWrapper(Collection);
