import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DiscussionPreview from 'components/DiscussionPreview/DiscussionPreview';

require('./discussionAddon.scss');

const propTypes = {
	threads: PropTypes.array,
	threadNumber: PropTypes.number,
	align: PropTypes.oneOf(['full', 'left', 'right', 'center']),
	routerContext: PropTypes.object,
};

const defaultProps = {
	threads: [],
	threadNumber: undefined,
	align: 'center',
	routerContext: {},
};
const childContextTypes = {
	router: PropTypes.object,
};

class DiscussionStatic extends Component {
	getChildContext() {
		return { router: this.props.routerContext };
	}

	render() {
		const figFloat = this.props.align === 'left' || this.props.align === 'right' ? this.props.align : 'none';
		const figMargin = this.props.align === 'left' || this.props.align === 'right' ? '10px' : '0em auto 1em';
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
			<div className={'discussion-figure-wrapper'}>
				<figure className={'discussion pt-card pt-elevation-2'} style={figStyle}>
					<DiscussionPreview
						key={`thread-${activeThread[0].id}`}
						discussions={activeThread}
						slug={'pubData.slug'}
						isPresentation={false}
					/>
				</figure>
			</div>
		);
	}
}

DiscussionStatic.propTypes = propTypes;
DiscussionStatic.defaultProps = defaultProps;
DiscussionStatic.childContextTypes = childContextTypes;
export default DiscussionStatic;
