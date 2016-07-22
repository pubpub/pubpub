import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import update from 'react-addons-update';

import {Table, Cell, Column} from 'fixed-data-table-2';
import tableStyles from './fixed-data-table.css';

import Papa from 'papaparse';

let styles = {};

export const TableEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			url: '',
			width: 600,
			height: 400,
			isUploading: false,
			rows: [],
			header: false
		};
	},

	componentWillMount() {
		const url = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']) || '';
		const header = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'header']) || false;
		const height = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'height']) || 400;
		this.setState({url, header, height});
	},
	
	loadCSV() {
		const url = this.state.url;
		Papa.parse(url, {
			download: true,
			header: false,
			step: row => this.setState(update(this.state, {rows: {$push: row.data}}))
		});
	},
	
	componentDidMount() {
		this.loadCSV();
	},

	getSaveVersionContent() {
		const {url, header} = this.state;
		return {url, header};
	},

	handleFileSelect(evt) {
		if (evt.target.files.length) {
			this.setState({isUploading: true});
			s3Upload(evt.target.files[0], ()=>{}, this.onFileFinish, 0);
		}
	},

	onFileFinish(evt, index, type, filename) {
		const url = 'https://assets.pubpub.org/' + filename;
		this.setState({url, isUploading: false, rows: []}, this.loadCSV);
	},
	
	handleHeaderChange(evt) {
		const header = evt.target.checked;
		this.setState({header});
	},
	
	handleHeightChange(evt) {
		const height = +evt.target.value;
		this.setState({height});
	},
	
	setWidth(container) {
		if (container && container.offsetWidth)	{
			this.setState({width: container.offsetWidth});
		}
	},
	
	render() {
		const {height, width, header, rows} = this.state;
		const offset = header ? 1 : 0;
		const columns = rows[0] || [];
		const rowsCount = Math.max(0, rows.length - offset - 1);
		const dimensions = {
			width, height,
			rowHeight: 50,
			headerHeight: offset * 50
		};
		return <div style={styles.container} ref={this.setWidth}>
			<label htmlFor="header" style={styles.label}>
				Header Row:
				<input id='header' name='header' type='checkbox' value={header} style={styles.header}
											onChange={this.handleHeaderChange}/>
			</label>
			<label htmlFor="height" style={styles.label}>
				Height:
				<input id='height' name='height' type="number"
											min={100} step={100} max={1000} value={height} style={styles.height}
											onChange={this.handleHeightChange}/>
			</label>
			<label htmlFor="csvFile" style={styles.label}>
				Upload a new file
				<input id='csvFile' name='csv file' type="file" accept="text/csv" style={styles.file}
											onChange={this.handleFileSelect} />
			</label>
			<h3>Preview</h3>
			
			<Style rules={tableStyles} />

			<Table rowsCount={rowsCount} {...dimensions}>
				{columns.map((column, key) => {
					const props = {key, width: 200};
					props.cell = props => <Cell width={props.width} height={props.height}>{rows[props.rowIndex + offset][key]}</Cell>;
					if (header) props.header = <Cell>{column}</Cell>;
					return <Column {...props} />;
				})}
			</Table>
			
		</div>;
	}
});

export default Radium(TableEditor);

styles = {
	container: {
		width: '100%'
	},
	header: {
		marginLeft: '12px',
		marginBottom: '12px'
	},
	height: {
		marginLeft: '12px',
		marginBottom: '6px',
		fontSize: '1em'
	},
	label: {
		fontSize: '1.1em'
	}
};
