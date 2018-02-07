import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';

require('./discussionAddon.scss');

const propTypes = {
	threads: PropTypes.array,
	threadNumber: PropTypes.number,
	slug: PropTypes.string.isRequired,
	align: PropTypes.oneOf(['full', 'left', 'right', 'center']),
	setActiveThread: PropTypes.func.isRequired,
};

const defaultProps = {
	threads: [],
	threadNumber: undefined,
	align: 'center',
};

class DiscussionStatic extends Component {
	render() {
		const figFloat = this.props.align === 'left' || this.props.align === 'right' ? this.props.align : 'none';
		let figMargin = '0em auto 1em';
		if (this.props.align === 'left') { figMargin = '1em 1em 1em 0px'; }
		if (this.props.align === 'right') { figMargin = '1em 0px 1em 1em'; }
		const figWidth = this.props.align === 'full' ? '100%' : '60%';
		const figStyle = {
			width: figWidth,
			margin: figMargin,
			float: figFloat,
		};
		const activeThread = this.props.threads.reduce((prev, curr)=> {
			if (curr[0].threadNumber === this.props.threadNumber) {
				return curr;
			}
			return prev;
		}, undefined);
		if (!activeThread) { return null; }
		return (
			<div className="discussion-figure-wrapper">
				<figure className="discussion pt-card pt-elevation-2" style={figStyle}>
					<DiscussionPreview
						key={`thread-${activeThread[0].id}`}
						discussions={activeThread}
						slug={this.props.slug}
						// isPresentation={true}
						// onPreviewClick={()=> { this.props.setActiveThread(activeThread[0].threadNumber); }}
						onPreviewClick={this.props.setActiveThread}
					/>
				</figure>
			</div>
		);
	}
}

DiscussionStatic.propTypes = propTypes;
DiscussionStatic.defaultProps = defaultProps;
export default DiscussionStatic;
