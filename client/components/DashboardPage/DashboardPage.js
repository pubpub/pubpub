import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { Editor } from '@pubpub/editor';
import FormattingMenu from '@pubpub/editor/addons/FormattingMenu';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import InsertMenu from '@pubpub/editor/addons/InsertMenu';
import LayoutEditor from 'components/LayoutEditor/LayoutEditor';
import InputField from 'components/InputField/InputField';
import { s3Upload, getResizedUrl, getDefaultLayout, apiFetch } from 'utilities';

require('./dashboardPage.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pageData: PropTypes.object.isRequired,
	// location: PropTypes.object.isRequired,
	setCommunityData: PropTypes.func.isRequired,
	setPageData: PropTypes.func.isRequired,
	// collectionData: PropTypes.object.isRequired,
	// putIsLoading: PropTypes.bool,
	// deleteIsLoading: PropTypes.bool,
	// error: PropTypes.string,
	// onSave: PropTypes.func,
	// onDelete: PropTypes.func,
};

// const defaultProps = {
// 	putIsLoading: false,
// 	deleteIsLoading: false,
// 	error: undefined,
// 	onSave: ()=>{},
// 	onDelete: ()=> {},
// };

class DashboardPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// editMode: 'details',
			hasChanged: false,
			title: props.pageData.title,
			description: props.pageData.description || '',
			slug: props.pageData.slug,
			isPublic: props.pageData.isPublic,
			isOpenSubmissions: props.pageData.isOpenSubmissions,
			isOpenPublish: props.pageData.isOpenPublish,
			// createPubMessage: props.pageData.createPubMessage,
			layout: props.pageData.layout || getDefaultLayout(props.pageData.isPage),
			isLoading: false,
			error: undefined,
			deleteString: '',
			isLoadingDelete: false,
		};
		// this.setEditMode = this.setEditMode.bind(this);
		this.setTitle = this.setTitle.bind(this);
		this.setDescription = this.setDescription.bind(this);
		this.setSlug = this.setSlug.bind(this);
		this.setPublic = this.setPublic.bind(this);
		this.setPrivate = this.setPrivate.bind(this);
		this.setOpenSubmissions = this.setOpenSubmissions.bind(this);
		this.setClosedSubmissions = this.setClosedSubmissions.bind(this);
		this.setOpenPublish = this.setOpenPublish.bind(this);
		this.setClosedPublish = this.setClosedPublish.bind(this);
		this.setLayout = this.setLayout.bind(this);
		this.setCreatePubMessage = this.setCreatePubMessage.bind(this);
		this.handleSaveChanges = this.handleSaveChanges.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	// setEditMode(mode) {
	// 	this.setState({ editMode: mode });
	// }

	setTitle(evt) {
		this.setState({ hasChanged: true, title: evt.target.value });
	}

	setDescription(evt) {
		this.setState({ hasChanged: true, description: evt.target.value.substring(0, 280).replace(/\n/g, ' ') });
	}

	setSlug(evt) {
		this.setState({ hasChanged: true, slug: evt.target.value.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase() });
	}

	setPublic() {
		this.setState({ hasChanged: true, isPublic: true });
	}

	setPrivate() {
		this.setState({ hasChanged: true, isPublic: false });
	}

	setOpenSubmissions() {
		this.setState({ hasChanged: true, isOpenSubmissions: true });
	}

	setClosedSubmissions() {
		this.setState({ hasChanged: true, isOpenSubmissions: false });
	}

	setOpenPublish() {
		this.setState({ hasChanged: true, isOpenPublish: true });
	}

	setClosedPublish() {
		this.setState({ hasChanged: true, isOpenPublish: false });
	}

	setLayout(newLayout) {
		this.setState({ hasChanged: true, layout: newLayout });
	}

	setCreatePubMessage(val) {
		this.setState({ hasChanged: true, createPubMessage: val });
	}

	handleSaveChanges() {
		const pageObject = {
			title: this.state.title,
			slug: this.state.slug,
			description: this.state.description,
			isPublic: this.state.isPublic,
			// isOpenSubmissions: this.state.isOpenSubmissions,
			// isOpenPublish: this.state.isOpenPublish,
			layout: this.state.layout,
			// createPubMessage: this.editorRef && this.editorRef.view.state.doc.textContent
			// 	? this.state.createPubMessage
			// 	: null
		};
		this.setState({ isLoading: true, error: undefined });
		return apiFetch('/api/pages', {
			method: 'PUT',
			body: JSON.stringify({
				...pageObject,
				pageId: this.props.pageData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.setState({ isLoading: false, error: undefined });
			this.props.setCommunityData({
				...this.props.communityData,
				pages: this.props.communityData.pages.map((page)=> {
					if (page.id !== this.props.pageData.id) { return page; }
					return {
						...page,
						...pageObject,
					};
				})
			});
			this.props.setPageData({
				...this.props.pageData,
				...pageObject,
			});
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ isLoading: false, error: err });
		});
	}

	handleDelete() {
		this.setState({ isLoadingDelete: true });
		return apiFetch('/api/pages', {
			method: 'DELETE',
			body: JSON.stringify({
				pageId: this.props.pageData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			window.location.href = '/dashboard';
		})
		.catch((err)=> {
			console.error(err);
			this.setState({ isLoadingDelete: false });
		});
	}

	render() {
		const data = this.props.pageData;
		const pubs = data.pubs || [];

		return (
			<div className="dashboard-page-component">
				<div className="content-buttons">
					<a href={`/dashboard/${data.slug}`} className="pt-button">Cancel</a>
					<Button
						type="button"
						className="pt-intent-primary"
						text="Save Changes"
						disabled={!this.state.hasChanged || !this.state.title || (data.slug && !this.state.slug)}
						loading={this.state.isLoading}
						onClick={this.handleSaveChanges}
					/>
					{this.state.error &&
						<div className="error">Error Saving</div>
					}
				</div>

				<h1>{data.title}</h1>

				<div className="section-wrapper">
					<div className="title">Details</div>
					<div className="content">
						<InputField
							label="Title"
							placeholder="Enter title"
							isRequired={true}
							value={this.state.title}
							onChange={this.setTitle}
							error={undefined}
						/>
						<InputField
							label="Description"
							placeholder="Enter description"
							isTextarea={true}
							helperText="Used for search results. Max 180 characters."
							value={this.state.description}
							onChange={this.setDescription}
							error={undefined}
						/>
						{this.props.pageData.slug &&
							<InputField
								label="Link"
								placeholder="Enter link"
								isRequired={true}
								value={this.state.slug}
								onChange={this.setSlug}
								error={undefined}
							/>
						}

						{this.props.pageData.slug &&
							<InputField label="Privacy">
								<div className="pt-button-group">
									<button type="button" className={`pt-button pt-icon-globe ${this.state.isPublic ? 'pt-active' : ''}`} onClick={this.setPublic}>Public</button>
									<button type="button" className={`pt-button pt-icon-lock ${this.state.isPublic ? '' : 'pt-active'}`} onClick={this.setPrivate}>Private</button>
								</div>
							</InputField>
						}

						{/*!this.props.pageData.isPage &&
							<InputField
								label="Submissions"
								helperText={this.state.isOpenSubmissions
									? 'Anyone can create new pubs in this collection.'
									: 'Only Community Admins can create new pubs in this collection.'
								}
							>
								<div className="pt-button-group">
									<button type="button" className={`pt-button pt-icon-add-to-artifact ${this.state.isOpenSubmissions ? 'pt-active' : ''}`} onClick={this.setOpenSubmissions}>Open</button>
									<button type="button" className={`pt-button pt-icon-delete ${!this.state.isOpenSubmissions ? 'pt-active' : ''}`} onClick={this.setClosedSubmissions}>Closed</button>
								</div>
							</InputField>
						*/}

						{/*!this.props.pageData.isPage &&
							<InputField
								label="Publishing"
								helperText={this.state.isOpenPublish
									? 'Anyone can publish their own pubs in this collection.'
									: 'Only Community Admins can publish pubs in this collection. Authors must \'Submit for Publication\'.'
								}
							>
								<div className="pt-button-group">
									<button type="button" className={`pt-button pt-icon-add-to-artifact ${this.state.isOpenPublish ? 'pt-active' : ''}`} onClick={this.setOpenPublish}>Open</button>
									<button type="button" className={`pt-button pt-icon-delete ${!this.state.isOpenPublish ? 'pt-active' : ''}`} onClick={this.setClosedPublish}>Closed</button>
								</div>
							</InputField>
						*/}

						{/*!this.props.pageData.isPage &&
							<InputField label="Submission Instructions">
								<div className="editor-wrapper">
									<Editor
										placeholder="Instructions for submitting to this collection..."
										onChange={this.setCreatePubMessage}
										initialContent={this.props.pageData.createPubMessage || undefined}
										ref={(ref)=> { this.editorRef = ref; }}
									>
										<FormattingMenu />
										<InsertMenu />
										<Image
											handleFileUpload={s3Upload}
											handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }}
										/>
										<Video handleFileUpload={s3Upload} />
										<File handleFileUpload={s3Upload} />
									</Editor>
								</div>
							</InputField>
						*/}
					</div>
				</div>
				<div className="section-wrapper">
					<div className="title">
						Layout
					</div>
					<div className="content">
						{/*<LayoutEditor
							onChange={this.setLayout}
							initialLayout={this.state.layout}
							pubs={data.pubs}
							isPage={data.isPage}
						/>*/}
					</div>
				</div>
				{this.props.pageData.slug &&
					<div className="section-wrapper">
						<div className="title">
							Delete
						</div>
						<div className="content">
							<div className="pt-callout pt-intent-danger">
								<h5>Delete Page from Community</h5>
								<p>Deleting a Page is permanent.</p>
								<p>This will permanantely delete <b>{this.props.pageData.title}</b>. This will not delete pubs that are included in this page's layout.</p>
								<p>Please type the title of the Page below to confirm your intention.</p>

								<InputField
									label={<b>Confirm Page Title</b>}
									value={this.state.deleteString}
									onChange={(evt)=> {
										this.setState({ deleteString: evt.target.value });
									}}
								/>
								<div className="delete-button-wrapper">
									<Button
										type="button"
										className="pt-intent-danger"
										text={`Delete ${this.props.pageData.isPage ? 'Page' : 'Collection'}`}
										disabled={this.state.deleteString !== this.props.pageData.title}
										loading={this.state.isLoadingDelete}
										onClick={this.handleDelete}
									/>
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		);
	}
}


DashboardPage.propTypes = propTypes;
// DashboardPage.defaultProps = defaultProps;
export default DashboardPage;
