import React, { Component } from 'react';
import PropTypes from 'prop-types';

require('./pubSideOptions.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	setOptionsMode: PropTypes.func.isRequired,
};

class PubSideOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPositionFixed: false,
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.wrapperRef = React.createRef();
	}

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
		this.handleScroll();
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll() {
		if (this.wrapperRef.current) {
			if (!this.state.isPositionFixed) {
				const isPastTop = this.wrapperRef.current.getBoundingClientRect().top < 0;
				const isBeforeBottom = this.wrapperRef.current.parentNode.getBoundingClientRect().bottom > 200;
				if (isPastTop && isBeforeBottom) {
					this.setState(()=> { return { isPositionFixed: true }; });
				}
			} else {
				const isBeforeTop = this.wrapperRef.current.getBoundingClientRect().top > 0;
				const isAfterBottom = this.wrapperRef.current.parentNode.getBoundingClientRect().bottom < 200;
				if (isBeforeTop || isAfterBottom) {
					this.setState(()=> { return { isPositionFixed: false }; });
				}
			}
		}
	}

	render() {
		const wrapperStyle = {
			position: this.state.isPositionFixed ? 'fixed' : 'static',
			top: '1em',
			width: '275px',
		};

		// TODO: handling discussion flows
		// Iterate over all discussionSidePreviews
		// Set all to be position: absolute, top: 0
		// On every click - you iterate over them all, calculate their height and set their transformY
		// On every click - you figure out where they want to be, and then get as close as possible given the other 
		// heights and position that exist.
		// If one is selected - you have to give that one priority, so you set it first, and then calculate
		// for the previews before and after.
		return (
			<div className="pub-side-options-component" ref={this.wrapperRef}>
				<div style={wrapperStyle}>
					<div className="links">
						<a onClick={()=> { props.setOptionsMode('cite'); }}>Cite</a>
						<span>·</span>
						<a onClick={()=> { props.setOptionsMode('export'); }}>Export</a>
						<span>·</span>
						<a><span className="pt-icon-standard pt-icon-facebook" /></a>
						<span>·</span>
						<a><span className="pt-icon-standard pt-icon-twitter" /></a>
						<span>·</span>
						<a><span className="pt-icon-standard pt-icon-reddit" /></a>
						<span>·</span>
						<a><span className="pt-icon-standard pt-icon-google-plus" /></a>
					</div>
					<div className="discussion-options">
						<div className="pt-select pt-fill pt-small">
							<select>
								<option value="public">public</option>
							</select>
						</div>
						<a>View All</a>
					</div>
				</div>
			</div>
		);
	}
}

PubSideOptions.propTypes = propTypes;
export default PubSideOptions;
