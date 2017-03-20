import React, { PropTypes } from 'react';
import { browserHistory } from 'react-router';
import Radium from 'radium';
import { Rendering } from 'marklib';
import * as textQuote from 'dom-anchor-text-quote';

let styles;

export const PubHighlights = React.createClass({
	propTypes: {
		discussions: PropTypes.array,
		location: PropTypes.object,
	},

	getInitialState() {
		return {
			highlightsMade: {},
		};
	},

	componentWillReceiveProps(nextProps) {
		const lastPathname = this.props.location.pathname;
		const nextPathname = nextProps.location.pathname;
		if (lastPathname !== nextPathname) {
			this.setState({ highlightsMade: {} });
			setTimeout(()=> {
				this.setState({});
				// This is a bad hack for PDFs to trigger their rebuild. What should we do instead? Send highlights into RenderFile?
			}, 20000);
		}
	},

	openDiscussion: function(threadNumber) {
		browserHistory.push({
			pathname: this.props.location.pathname,
			query: { ...this.props.location.query, panel: undefined, discussion: threadNumber }
		});
	},

	highlightBubbleEnter: function(highlightId) {
		// console.log('enter ', highlightId);
		const elements = document.getElementsByClassName(`highlight-${highlightId}`);
		// console.log(elements);
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index];
			element.className += ' highlight-hover';
		}
	},

	highlightBubbleLeave: function(highlightId) {
		const elements = document.getElementsByClassName(`highlight-${highlightId}`);
		for (let index = 0; index < elements.length; index++) {
			const element = elements[index];
			element.className = element.className.replace(' highlight-hover', '');
		}
	},

	render() {
		const discussions = this.props.discussions || [];
		const allHighlights = discussions.reduce((previous, current)=> {
			if (!current.versions.length) { return previous; }
			const currentFileVersion = current.versions.reduce((previousVersionItem, currentVersionItem)=> {
				return (!previousVersionItem.createdAt || currentVersionItem.createdAt > previousVersionItem.createdAt) ? currentVersionItem : previousVersionItem;
			}, {}); // Get the last version
			const files = currentFileVersion.files || [];

			const highlightFileArray = files.reduce((previousFileItem, currentFileItem)=> {
				if (currentFileItem.name === 'highlights.json') { return JSON.parse(currentFileItem.content); }
				return previousFileItem;
			}, []);

			const addedThreadNumber = highlightFileArray.map((item) => {
				return {
					...item,
					threadNumber: current.threadNumber
				};
			});
			return [...previous, ...addedThreadNumber];

		}, []);

		setTimeout(()=> {
			const container = document.getElementById('highlighter-wrapper');
			if (container) {
				const newHighlightsMade = {};
				allHighlights.forEach((highlight)=> {
					const highlightObject = {
						exact: highlight.exact,
						prefix: highlight.prefix,
						suffix: highlight.suffix,
					};
					const t0 = performance.now();
					// const textQuoteRange = textQuote.toRange(container, highlightObject);
					// const t1 = performance.now();
					// console.log('-----------');
					
					// if (textQuoteRange && document.getElementsByClassName(`highlight-${highlight.id}`).length === 0) {
					if (!this.state.highlightsMade[highlight.id]) {
						
						const t1 = performance.now();
						const textQuoteRange = textQuote.toRange(container, highlightObject);
						// console.log('t01: ', t1 - t0);
						if (textQuoteRange) {

							const t2 = performance.now();
							const renderer = new Rendering(document, { hoverClass: 'highlight-hover', className: `highlight highlight-${highlight.id} discussion-${highlight.threadNumber}` });
							const t3 = performance.now();
							renderer.renderWithRange(textQuoteRange);
							const t4 = performance.now();
							// const element = document.getElementsByClassName(`highlight-${highlight.id}`)[0];
							const elements = document.getElementsByClassName(`highlight-${highlight.id}`);
							const elementBox = elements[0].getBoundingClientRect();
							const wrapperBox = document.getElementById('content-wrapper').getBoundingClientRect();
							newHighlightsMade[highlight.id] = [highlight.threadNumber, elementBox.top + ((elementBox.bottom - elementBox.top) / 2) + (Math.floor(Math.random() * 20) - 10) - wrapperBox.top];
							const t5 = performance.now();
							for (let index = 0; index < elements.length; index++) {
								const element = elements[index];
								element.addEventListener('click', ()=> {
									this.openDiscussion(highlight.threadNumber);
								});

								element.addEventListener('mouseenter', ()=> {
									this.highlightBubbleEnter(highlight.id);
									// element.className += ' highlight-hover';
								});

								element.addEventListener('mouseleave', ()=> {
									this.highlightBubbleLeave(highlight.id);
									// element.className = element.className.replace(' highlight-hover', '');
								});

								// const marker = document.createElement('div');
								// marker.className = 'highlight-marker';
								// marker.setAttribute('style', `transform: translateY(${Math.floor(Math.random() * 20) - 10}px)`);
								// element.appendChild(marker);
								
							}
							const t6 = performance.now();
							const t7 = performance.now();
							
							// console.log('t12: ', t2 - t1);
							// console.log('t23: ', t3 - t2);
							// console.log('t34: ', t4 - t3);
							// console.log('t45: ', t5 - t4);
							// console.log('t56: ', t6 - t5);
							// console.log('t67: ', t7 - t6);
						}
					}
	
				});
				if (Object.keys(newHighlightsMade).length) {
					this.setState({ highlightsMade: { ...this.state.highlightsMade, ...newHighlightsMade } });
				}
			}
		}, 1000);

		return (
			<div>
				{Object.keys(this.state.highlightsMade).map((highlightKey)=> {
					return <div key={`highlightBubble-${highlightKey}`} className={'highlight-marker'} onMouseEnter={this.highlightBubbleEnter.bind(this, highlightKey)} onMouseLeave={this.highlightBubbleLeave.bind(this, highlightKey)} onClick={this.openDiscussion.bind(this, this.state.highlightsMade[highlightKey][0])} style={{ right: 18, top: this.state.highlightsMade[highlightKey][1] }} />;
				})}	
			</div>
		);
	},

});

export default Radium(PubHighlights);

styles = {
	
};
