import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import React, {PropTypes} from 'react';
import {ensureImmutable} from 'reducers';

// import {safeGetInToJS} from 'utils/safeParse';

let styles = {};

export const EmbedWrapper = React.createClass({
	propTypes: {
		source: PropTypes.string,
		className: PropTypes.string,
		id: PropTypes.string,
		align: PropTypes.oneOf(['inline', 'full', 'left', 'right', 'inline-word']),
		size: PropTypes.string,
		caption: PropTypes.string,
		mode: PropTypes.oneOf(['embed', 'cite']),
		data: PropTypes.object,
		citeCount: PropTypes.number,
		context: PropTypes.oneOf(['reference-list', 'document', 'library']), // where the embed is being used
		updateParams: PropTypes.func,
		nodeId: PropTypes.number,
	},
	getInitialState: function() {
		return { };
	},
	getDefaultProps: function() {
		return {
			context: 'document',
		};
	},

	render: function() {
		const data = this.props.data || {};
		// Data is the version object with a populated parent field.
		// The parent field is the atomData field

		const atomData = ensureImmutable({ atomData: data.parent, currentVersionData: data });

		if (this.props.mode === 'cite') {
			const number = this.state.citeCount || this.props.citeCount || '?';

			return (
				<span className={'light-button arrow-down-button cite-wrapper no-arrow'} style={styles.button} data-source={this.props.source}>
					<span style={styles.number}>
						{number}
					</span>
					<div className={'hoverChild arrow-down-child'} style={styles.hover}>
						<AtomViewerPane atomData={atomData} renderType={'embed'} context={this.props.context}/>
					</div>
				</span>
			);
		}

		if (this.props.align === 'inline') {
			return (<span ref="embedroot" className={'pub-embed ' + this.props.className} id={this.props.id}>
				<figure style={styles.figure({size: this.props.size, align: this.props.align})}>
					<AtomViewerPane atomData={atomData} renderType={'embed'} context={this.props.context}/>
			</figure>
		</span>);
		}

		return (
			<div ref="embedroot" className={'pub-embed ' + this.props.className} id={this.props.id}>
				<figure style={styles.figure({size: this.props.size, align: this.props.align})}>
				<div style={{display: 'table-row'}}>
					<AtomViewerPane atomData={atomData} renderType={'embed'} context={this.props.context}/>
				</div>
			<figcaption style={styles.caption({size: this.props.size, align: this.props.align})}>
				<span className="caption" style={styles.captionText({align: this.props.align})}>
					{this.props.caption}
				</span>
			</figcaption>
			</figure>
			</div>
		);
	}
});

styles = {
	button: {
		padding: '0em 0em',
		height: '0.75em',
		width: '0.75em',
		position: 'relative',
		top: '-0.15em',
		verticalAlign: 'middle',
		display: 'inline-block',
		cursor: 'pointer',
		// border: 'none'
	},
	hover: {
		minWidth: '275px',
		padding: '1em',
		fontSize: '0.85em'
	},
	number: {
		display: 'inline-block',
		height: '100%',
		verticalAlign: 'top',
		position: 'relative',
		top: '-0.45em',
		fontSize: '0.85em',
	},
	figure: function({size, align}) {
		const style = {
			width: size,
			display: 'table',
		};
		if (align === 'left') {
			style.float = 'left';
		} else if (align === 'right') {
			style.float = 'right';
		} else if (align === 'full') {
			style.margin = '0 auto';
		}
 		return style;
	},
	caption: function({size, align}) {
		const style = {
			width: size,
			display: 'table-row',
		};
		return style;
	},
	captionText: function({align}) {
		const style = {
			width: '100%',
			display: 'inline-block',
		};
		return style;
	}
};

export default EmbedWrapper;
