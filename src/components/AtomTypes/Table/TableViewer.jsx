import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import update from 'react-addons-update';

import {Table, Cell, Column} from 'fixed-data-table-2';
import tableStyles from './fixed-data-table.css';

import parse from 'csv-parse';
import request from 'superagent';

let styles = {};

export const TableViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	getInitialState() {
		return {
			url: '',
			width: 600,
			height: 400,
			rows: [],
			header: false
		};
	},

	componentWillMount() {
		const url = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']) || '';
		const header = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'header']) || false;
		const height = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'height']) || 400;
		this.setState({url, header, height});
	},

	loadCSV() {
		const url = this.state.url;
		if (url) {
			// const req = request.get(url, {withCredentials: false});
			const req = request.get(url);
			const config = {
				relax_column_count: true,
				trim: true
			};
			req.end((err, res) => parse(res.text, config, (err, rows) => this.setState({rows})));
			// req.pipe(parser).on('data', row => this.setState(update(this.state, {rows: {$push: [row]}})));
		}
	},

	componentDidMount() {
		this.loadCSV();
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
		
		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
		case 'full':
		case 'static-full':
		default:
			return <div ref={this.setWidth} style={styles.container}>
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
	}
});

export default Radium(TableViewer);

styles = {
	container: {
		width: '100%'
	}
};
