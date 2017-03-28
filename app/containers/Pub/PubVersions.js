import { Dialog, Menu, MenuItem, MenuDivider, Popover, PopoverInteractionKind, Position, Button, Alert } from '@blueprintjs/core';
import React, { PropTypes } from 'react';
import { postDoi, putVersion } from './actionsVersions';

import { Link } from 'react-router';
import Loader from 'components/Loader/Loader';
import { PUBPUB_CONVERSION_URL } from 'configURLs';
import Radium from 'radium';
import dateFormat from 'dateformat';
import request from 'superagent';

let styles;

export const PubVersions = React.createClass({
	propTypes: {
		versionsData: PropTypes.array,
		pub: PropTypes.object,
		location: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			confirmPublish: undefined,
			confirmRestricted: undefined,
			confirmDoi: undefined,
			exportErrorAlert: false,
			showExportOptions: false,
			pdftexTemplates: undefined,
			selectedTemplate: undefined,
			exportOptionsVersion: undefined,
			exportOutputType: undefined,
			metadata: {},
			convertError: [],
			conversionLoading: [],
			downloadReady: [],
			downloadReadyUrls: []
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.isLoading && !nextProps.isLoading && !nextProps.error) {
			this.setState({
				confirmPublish: undefined,
				confirmRestricted: undefined,
				confirmDoi: undefined,
			});
		}
	},

	setRestricted: function(versionId) {
		this.setState({ confirmRestricted: versionId });
	},

	setPublish: function(versionId) {
		this.setState({ confirmPublish: versionId });
	},

	restrictVersion: function() {
		this.props.dispatch(putVersion(this.props.pub.id, this.state.confirmRestricted, null, true));
	},

	publishVersion: function() {
		this.props.dispatch(putVersion(this.props.pub.id, this.state.confirmPublish, true));
	},

	toggleexportErrorAlert: function () {
		this.setState({ exportErrorAlert: !this.state.exportErrorAlert });
	},

	toggleDoiDialog: function(versionId) {
		this.setState({ confirmDoi: versionId });
	},

	createDoi: function() {
		this.props.dispatch(postDoi(this.props.pub.id, this.state.confirmDoi));
	},
	toggleShowExportOptions: function() {
		this.setState({ showExportOptions: !this.state.showExportOptions });
	},

	pollURL: function(url, versionHash) {

		const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === 'www.funky.com' || window.location.hostname === 'www.funkynocors.com';
		const isRemoteDev = window.location.hostname === 'dev.pubpub.org' || window.location.hostname === 'test.epsx.org' || window.location.hostname === 'testnocors.epsx.org';
		const isProd = !(isLocalDev || isRemoteDev);

		let pollUrl = (isProd) ? 'https://pubpub-converter-prod.herokuapp.com' : 'https://pubpub-converter-dev.herokuapp.com';
		pollUrl += url;

		request
		.get(pollUrl)
		.end((err, res) => {
			console.log(err, res);
			if (!err && res && res.statusCode === 200) {
				if (res.body.url) {
					window.open(res.body.url, '_blank');
					const index = this.state.conversionLoading.indexOf(versionHash);
					this.setState({
						conversionLoading: this.state.conversionLoading.filter((_, ii) => ii !== index)
					});
					this.setState({
						downloadReady: this.state.downloadReady.concat([versionHash]),
						downloadReadyUrls: this.state.downloadReadyUrls.concat([res.body.url])
					});
				} else {
					window.setTimeout(this.pollURL.bind(this, url, versionHash), 2000);
				}
			} else if (err) {
				this.setState({
					convertError: this.state.convertError.concat([versionHash]),
					exportErrorAlert: true
				});

			}
		});
	},
	exportOptionsSubmit: function() {
		const metadata = this.state.metadata;
		const version = this.state.exportOptionsVersion;

		this.convertVersion(version, {});

		// If Valud
		this.setState({
			showExportOptions: false,
			exportOptionsVersion: undefined
		});
	},
	exportOptionsDialog: function(version, options) {
		const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === 'www.funky.com' || window.location.hostname === 'www.funkynocors.com';
		const isRemoteDev = window.location.hostname === 'dev.pubpub.org' || window.location.hostname === 'test.epsx.org' || window.location.hostname === 'testnocors.epsx.org';
		const isProd = !(isLocalDev || isRemoteDev);
		const reqURL = (isProd) ? 'https://pubpub-converter-prod.herokuapp.com/templates/all' : 'https://pubpub-converter-dev.herokuapp.com/templates/all';

		const outputType = options.outputType;


		if (!this.state.pdftexTemplates) {
			request
			.get(reqURL)
			.end((err, res) => {
				this.setState({
					pdftexTemplates: res.body
				});
			});
		}

		this.setState({
			showExportOptions: true,
			exportOptionsVersion: version,
			exportOutputType: outputType
		});
	},

	convertVersion: function(version, options) {
		const { files, defaultFile } = version;

		const outputType = (options && options.outputType) ? options.outputType : this.state.exportOutputType;

		const metadata = this.state.metadata;


		if (this.state.conversionLoading.indexOf(version.hash) === -1) {
			this.setState({
				conversionLoading: this.state.conversionLoading.concat([version.hash]),
				exportOutputType: undefined
			});
		} else {
			this.setState({
				exportOutputType: undefined
			});
			return;
		}

		const title = this.props.pub.title;
		const authors = [];

		this.props.pub.contributors.forEach((contributor) => {
			if (contributor.isAuthor) {
				authors.push(`${contributor.user.firstName} ${contributor.user.lastName}`);
			}
		});
		metadata.title = title;
		metadata.authors = authors;


		for (const file of files) {
			if (file.name === defaultFile) {
				console.log('got url!', file.url);
				request
				.post(PUBPUB_CONVERSION_URL)
				.send({ inputType: 'pub', outputType: outputType, inputUrl: file.url, metadata: metadata })
				.set('Accept', 'application/json')
				.end((err, res) => {
					if (err || !res.ok) {
						alert('Oh no! error', err);
					} else {
						const pollUrl = res.body.pollUrl;
						window.setTimeout(this.pollURL.bind(this, pollUrl, version.hash), 2000);

					}
				});
			}
		}
	},
	setMetadata: function(event, val) {
		const metadata = this.state.metadata;
		metadata[val] = event.target.value;
		this.setState({ metadata: metadata });
	},
	handleTemplateChange: function(event) {
		this.setState({ selectedTemplate: event.target.value });
	},
	prepareSupportEmail: function() {
		const emailTo = 'pubpub@media.mit.edu';
		const pub = this.props.pub.slug;
		const emailSubject = `Help: Trouble producing PDF With Pub slug==${pub} `;
		const emailBody = '';
		window.open(`mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`);

	},
	clearDownloadUrl: function(index) {
		this.setState({
			downloadReady: this.state.downloadReady.filter((_, ii) => ii !== index)
		});
	},

	render: function() {
		const pub = this.props.pub || {};
		const location = this.props.location || {};
		const query = location.query || {};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.error;
		const versions = this.props.versionsData || [];
		const pdftexTemplates = this.state.pdftexTemplates || {};
		const selectedTemplate = this.state.selectedTemplate || 'default';
		const selectedTemplateMetadata = (pdftexTemplates && pdftexTemplates[selectedTemplate]) ? pdftexTemplates[selectedTemplate].metadata : {};

		window.pdftexTemplates = pdftexTemplates;
		const pubDOI = versions.reduce((previous, current)=> {
			if (current.doi) { return current.doi; }
			return previous;
		}, undefined);

		return (
			<div style={styles.container}>
				<h2>Versions</h2>
					<Alert title="Error" isOpen={this.state.exportErrorAlert} cancelButtonText='Email Support' onCancel={this.prepareSupportEmail} confirmButtonText="Okay" onConfirm={this.toggleexportErrorAlert}>
						<div className="pt-dialog-body">
							<p>There was an error producing a PDF.</p>
							<p><b>Please contact support and let them know.</b></p>
						</div>
					</Alert>

					<Dialog isOpen={this.state.showExportOptions} onClose={this.toggleShowExportOptions} autofocus={true} enforceFocus={true}>

						<div className="pt-select pt-disabled">
								<select value={selectedTemplate} onChange={this.handleTemplateChange}>
								{Object.keys(pdftexTemplates).map((val) => {
									return (
										<option value={val}>{pdftexTemplates[val].displayName}</option>
									);
								})
							}
							</select>
						</div>

						<form>
							<div>Mandatory</div>
							{
								selectedTemplateMetadata.mandatory &&
								Object.keys(selectedTemplateMetadata.mandatory).map((val) => {
									if (val === 'authors' || val === 'title') return;

									return (
										<label>
											{selectedTemplateMetadata.mandatory[val].displayName}:
											<input name={val} type="text" onChange={(e) => this.setMetadata(e, val) }/>
										</label>);
									}
								)
							}
							{
								selectedTemplateMetadata.optional &&
								<div>Optional</div>
							}
							{
								selectedTemplateMetadata.optional &&
								Object.keys(selectedTemplateMetadata.optional).map((val) => {
									return (
										<label>
											{selectedTemplateMetadata.optional[val].displayName}:
											<input name={val} type="text" onChange={(e) => this.setMetadata(e, val) }/>
										</label>);
									}
								)
							}
						</form>
						<Button onClick={this.exportOptionsSubmit} style={{ float: 'right' }}>Submit</Button>
					</Dialog>

					{versions.sort((foo, bar)=> {
					// Sort so that most recent is first in array
					if (foo.createdAt > bar.createdAt) { return -1; }
					if (foo.createdAt < bar.createdAt) { return 1; }
					return 0;
				}).map((version, index, array)=> {
					const previousVersion = index < array.length - 1 ? array[index + 1] : {};
					let mode = 'private';
					if (version.isRestricted) { mode = 'restricted'; }
					if (version.isPublished) { mode = 'published'; }
					const downloadReady = (this.state.downloadReady.indexOf(version.hash) !== -1);
					let downloadReadyUrl;
					if (downloadReady) {
						downloadReadyUrl = this.state.downloadReadyUrls[this.state.downloadReady.indexOf(version.hash)];
					}
					const conversionLoading = (this.state.conversionLoading.indexOf(version.hash) !== -1);
					const convertError = (this.state.convertError.indexOf(version.hash) !== -1);

					return (
						<div key={'version-' + version.id} style={styles.versionRow}>

							{this.props.pub.canEdit &&
								<div style={styles.smallColumn}>
									<Popover
										content={
											<div>
												<Menu>
													<li className={'pt-menu-header'}><h6>Version is <span style={{ textTransform: 'capitalize' }}>{mode}</span></h6></li>
													{mode === 'private' &&
														<MenuDivider />
													}
													{mode === 'private' &&
														<li>
															<button type={'button'} className={'pt-menu-item'} onClick={this.setRestricted.bind(this, version.id)}>
																<p style={{ fontSize: '1.2em' }}>Set Restricted</p>
																<p>Restricted pubs can be read by journals and invited reviewers</p>
															</button>
														</li>
													}
													{(mode === 'private' || mode === 'restricted') &&
														<MenuDivider />
													}
													{(mode === 'private' || mode === 'restricted') &&
														<li>
															<button type={'button'} className={'pt-menu-item'} onClick={this.setPublish.bind(this, version.id)}>
																<p style={{fontSize: '1.2em'}}>Publish</p>
																<p>Make it publicly available</p>
															</button>
														</li>
													}
												</Menu>
											</div>
										}
										interactionKind={PopoverInteractionKind.HOVER}
										position={Position.BOTTOM_LEFT}>
										<span className={'pt-button pt-minimal'}>
											<span className={'pt-icon-standard pt-icon-globe'} style={mode === 'published' ? styles.icon : [styles.icon, styles.inactiveIcon]} />
											<span style={styles.iconSpacer} />
											<span className={'pt-icon-standard pt-icon-people'} style={mode === 'restricted' ? styles.icon : [styles.icon, styles.inactiveIcon]} />
											<span style={styles.iconSpacer} />
											<span className={'pt-icon-standard pt-icon-lock'} style={mode === 'private' ? styles.icon : [styles.icon, styles.inactiveIcon]} />
										</span>
									</Popover>

								</div>
							}

							<div style={styles.largeColumn}>
								{/* Link to Diff view */}
								<Link to={{ pathname: '/pub/' + this.props.pub.slug + '/diff', query: { ...query, version: undefined, base: previousVersion.hash, target: version.hash } }}>
									<h6 style={styles.noMargin}>{version.message || 'No message'}</h6>
								</Link>
								<p style={styles.noMargin}>{dateFormat(version.createdAt, 'mmm dd, yyyy HH:MM')}</p>
							</div>

							{this.props.pub.canEdit && mode === 'published' && !pubDOI &&
								<div style={[styles.smallColumn, { padding: '0.5em' }]}>
									<button className={'pt-button'} onClick={this.toggleDoiDialog.bind(this, version.id)}>Assign DOI</button>
								</div>
							}

							{version.doi &&
								<a href={'https://doi.org/' + pubDOI} style={[styles.smallColumn, { padding: '0.5em', display: 'block' }]}>
									<span href={'https://doi.org/' + pubDOI} className={'pt-tag'}>{version.doi}</span>
								</a>
							}


							<div style={[styles.smallColumn, { padding: '0.5em' }]}>
								{console.log('ok no here ' + this.state.conversionLoading)}
								{console.log(version.hash)}

								{ !downloadReady && !convertError &&
									<Popover content={
											<Menu>
												<MenuItem
													onClick={this.exportOptionsDialog.bind(this, version, { outputType: 'pdf' })}
													text={
														<div>
															<b>PDF</b>
														</div>
													}
													/>
												<MenuItem
													onClick={this.exportOptionsDialog.bind(this, version, { outputType: 'latex' })}
													text={
														<div>
															<b>Latex</b>
														</div>
													}
													/>
												<MenuItem
													onClick={this.convertVersion.bind(this, version, { outputType: 'docx' })}
													text={
														<div>
															<b>Docx</b>
														</div>
													}
													/>
											</Menu>
									} position={Position.BOTTOM}>
										<Button loading={conversionLoading} className={'pt-button p2-minimal'} onClick={''} text="Export" />
									</Popover>
								}
								{
									downloadReady && !convertError &&
									<a href={downloadReadyUrl}>
										<Button className={'pt-button p2-minimal'} onClick={this.clearDownloadUrl.bind(this, this.state.downloadReady.indexOf(version.hash))} text='Click Again' />
									</a>
								}

								{
									convertError &&
									<Button disabled={true} className={'pt-button p2-minimal'} text='Error'/>
								}


							</div>

							<div style={styles.smallColumn}>
								{/* Link to pub at that version instance */}
								<Link to={{ pathname: '/pub/' + this.props.pub.slug, query: { ...query, version: version.hash } }}>
									<button className={'pt-button p2-minimal'}>View Pub</button>
								</Link>
							</div>

							{!version.isPublished && !version.isRestricted &&
								<Dialog isOpen={this.state.confirmRestricted === version.id} onClose={this.setRestricted.bind(this, undefined)}>
									<div className="pt-dialog-body">
										<p>Please confirm that you want to set restricted access on this version. Once set, journal admins and invited reviewers will be granted read-acess to this version.</p>
										<p><b>Setting restricted access cannot be undone.</b></p>
										<div className={'pt-card pt-elevation-2'}>
											<h6 style={styles.noMargin}>{version.message || 'No message'}</h6>
											<p style={styles.noMargin}>{dateFormat(version.createdAt, 'mmm dd, yyyy HH:MM')}</p>
										</div>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<div style={styles.loaderContainer}><Loader loading={isLoading} /></div>
											<div style={styles.loaderContainer}>{errorMessage}</div>
											<button type="button" className="pt-button" onClick={this.setRestricted.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary" onClick={this.restrictVersion}>Enable Restricted Access</button>
										</div>
									</div>
								</Dialog>
							}

							{!version.isPublished &&
								<Dialog isOpen={this.state.confirmPublish === version.id} onClose={this.setPublish.bind(this, undefined)}>
									<div className="pt-dialog-body">
										<p>Please confirm that you want to publish the following version. Once published, the version will be publicly available.</p>
										<p><b>Publishing cannot be undone.</b></p>

										{!pub.isPublished &&
											<p><b>The Pub's URL (www.pubpub.org/pub/{pub.slug}) cannot be changed once published.</b></p>
										}
										<div className={'pt-card pt-elevation-2'}>
											<h6 style={styles.noMargin}>{version.message || 'No message'}</h6>
											<p style={styles.noMargin}>{dateFormat(version.createdAt, 'mmm dd, yyyy HH:MM')}</p>
										</div>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<div style={styles.loaderContainer}><Loader loading={isLoading} /></div>
											<div style={styles.loaderContainer}>{errorMessage}</div>
											<button type="button" className="pt-button" onClick={this.setPublish.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary" onClick={this.publishVersion}>Publish Version</button>
										</div>
									</div>
								</Dialog>
							}

							{!version.doi && version.isPublished &&
								<Dialog isOpen={this.state.confirmDoi === version.id} onClose={this.toggleDoiDialog.bind(this, undefined)}>
									<div className="pt-dialog-body">
										<p>Please confirm that you want to assign a DOI to this version of the pub.</p>
										<p><b>DOIs are permanent and can only be set on one version.</b></p>
										<div className={'pt-card pt-elevation-2'}>
											<h6 style={styles.noMargin}>{version.message || 'No message'}</h6>
											<p style={styles.noMargin}>{dateFormat(version.createdAt, 'mmm dd, yyyy HH:MM')}</p>
										</div>
									</div>
									<div className="pt-dialog-footer">
										<div className="pt-dialog-footer-actions">
											<div style={styles.loaderContainer}><Loader loading={isLoading} /></div>
											<div style={styles.loaderContainer}>{errorMessage}</div>
											<button type="button" className="pt-button" onClick={this.toggleDoiDialog.bind(this, undefined)}>Cancel</button>
											<button type="submit" className="pt-button pt-intent-primary" onClick={this.createDoi}>Assign DOI</button>
										</div>
									</div>
								</Dialog>
							}

						</div>
					);
				})}

			</div>
		);
	}
});

export default Radium(PubVersions);

styles = {
	container: {

	},
	noMargin: {
		margin: 0,
	},
	versionRow: {
		display: 'table',
		width: '100%',
		margin: '1em 0em 0em',
		padding: '1em 0em 0em',
		borderTop: '1px solid #CCC',
		verticalAlign: 'middle',
	},
	smallColumn: {
		display: 'table-cell',
		width: '1%',
		whiteSpace: 'nowrap',
		verticalAlign: 'middle',
	},
	largeColumn: {
		display: 'table-cell',
		width: '100%',
		padding: '0em 1em',
		verticalAlign: 'middle',
	},
	inactiveIcon: {
		opacity: '.25',
	},
	icon: {
		margin: 0,
		lineHeight: 'inherit',
	},
	iconSpacer: {
		width: '0.5em',
		height: '1em',
		display: 'inline-block',
	},
	noClick: {
		pointerEvents: 'none',
	},
	loaderContainer: {
		display: 'inline-block',
		margin: 'auto 0',
	},
};
