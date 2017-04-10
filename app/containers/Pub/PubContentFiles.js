import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import dateFormat from 'dateformat';
import RenderFile from 'components/RenderFile/RenderFile';
import { globalStyles } from 'utils/globalStyles';
import { putDefaultFile } from './actionsFiles';

let styles;

export const PubContentFiles = React.createClass({
	propTypes: {
		version: PropTypes.object,
		pub: PropTypes.object,
		params: PropTypes.object,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},


	defaultFileChange: function(filename) {
		return this.props.dispatch(putDefaultFile(this.props.pub.id, this.props.version.id, filename));
	},

	render() {
		const version = this.props.version || {};
		const files = version.files || [];
		const query = this.props.query || {};
		const params = this.props.params || {};
		const meta = params.meta;
		const mode = params.mode;
		const routeFilename = params.filename;

		const defaultFile = version.defaultFile;
		const mainFile = files.reduce((previous, current)=> {
			if (defaultFile === current.name) { return current; }
			if (!defaultFile && current.name.split('.')[0] === 'main') { return current; }
			return previous;
		}, files[0]);

		const routeFile = files.reduce((previous, current)=> {
			if (current.name === routeFilename) { return current; }
			return previous;
		}, undefined);

		const currentFile = meta === 'files' ? routeFile : mainFile;

		return (
			<div style={styles.container}>

				{/* Add or Edit Button */}
				{meta === 'files' && !!files.length && !routeFilename && this.props.pub.canEdit &&
					<div style={styles.topButtons}>
						<Link className={'pt-button pt-icon-add'} to={`/pub/${params.slug}/edit`}>Add or Edit Files</Link>
					</div>
				}

				{/* File List */}
				{meta === 'files' && !routeFile &&
					<div>
						<table className="pt-table pt-condensed pt-striped" style={{ width: '100%' }}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Updated</th>
									<th />
									<th />
								</tr>
							</thead>
							<tbody>
								{files.sort((foo, bar)=> {
									if (foo.name > bar.name) { return 1; }
									if (foo.name < bar.name) { return -1; }
									return 0;
								}).map((file, index)=> {
									return (
										<tr key={'file-' + index}>
											<td style={styles.tableCell}>
												<Link className={'underlineOnHover link'} to={{ pathname: `/pub/${this.props.pub.slug}/files/${file.name}`, query: query }}>
													file.name
												</Link>
											</td>
											<td style={styles.tableCell}>{dateFormat(file.createdAt, 'mmm dd, yyyy')}</td>
											<td style={[styles.tableCell, styles.tableCellSmall]}>
												<a href={file.url} target={'_blank'}>
													<button type="button" className={'pt-button pt-minimal pt-icon-import'} />
												</a>
											</td>
											<td style={[styles.tableCell, styles.tableCellSmall]}>
												{file.name === mainFile.name &&
													<button role="button" className={'pt-button pt-fill pt-active'}>Main File</button>
												}
												{file.name !== mainFile.name && this.props.pub.canEdit &&
													<button role="button" className={'pt-button pt-fill'} onClick={this.defaultFileChange.bind(this, file.name)}>Set as main</button>
												}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				}

				{/* Render specific File */}
				{!!files.length && currentFile && !mode &&
					<div style={styles.pubStyle} className={'pub-body'}>
						<RenderFile file={currentFile} allFiles={files} pubSlug={this.props.pub.slug} query={this.props.query} />
					</div>
				}
			</div>
		);
	},

});

export default Radium(PubContentFiles);

styles = {
	container: {
		paddingTop: '10px',
	},
	topButtons: {
		textAlign: 'right',
		margin: '-1em 0em 1em',
	},
	tableCell: {
		verticalAlign: 'middle',
	},
	tableCellSmall: {
		width: '1%',
		whiteSpace: 'nowrap',
	},
	tableCellRight: {
		textAlign: 'right',
	},
	pubStyle: {
		maxWidth: '700px',
	}
};
