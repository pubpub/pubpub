import React, { PropTypes } from 'react';
import Radium from 'radium';
// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, NonIdealState } from 'components/Blueprint';

let styles;

export const PubContent = React.createClass({
	propTypes: {
		versionData: PropTypes.object,
	},

	render: function() {
		const versionData = this.props.versionData || {};

		return (
			<div style={styles.pubBody} className={'pub-body'}>
				{!versionData.files.length &&
					<NonIdealState
						action={
							<Popover 
								content={<Menu>
									<li><Link to={'/pubs/create'} className="pt-menu-item pt-popover-dismiss pt-icon-application">
										Import Document
									</Link></li>
									<li><Link to={'/journals/create'} className="pt-menu-item pt-popover-dismiss pt-icon-applications">
										Create new document in Editor
									</Link></li>
									<li><Link to={'/journals/create'} className="pt-menu-item pt-popover-dismiss pt-icon-applications">
										Upload files
									</Link></li>
								</Menu>}
								interactionKind={PopoverInteractionKind.CLICK}
								position={Position.BOTTOM}
								transitionDuration={200}
							>
								<button type="button" className="pt-button pt-intent-primary">
									Add File
									<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
								</button>
								
							</Popover>
						}
						description={'There are no files associated with this pub yet.'}
						title={'No Files'}
						visual={'folder-open'} />
				}
				
				{versionData.files.length &&
					<div>
						{versionData.files[0].name}
					</div>
				}		
			</div>
		);
	},


	// render: function() {
	// 	let md = this.props.versionData.files.reduce((previous, current, index)=> {
	// 		if (current.name === 'main.md') {
	// 			return current.value;
	// 		} 
	// 		return previous;
	// 	}, '');

	// 	this.props.versionData.files.map((item)=> {
	// 		if (item.type === 'image') {
	// 			const regexp = new RegExp(item.name, "g");
	// 			md = md.replace(regexp, item.url);
	// 		}
	// 	});

	// 	return (
	// 		<div style={styles.pubBody} className={'pub-body'}>
	// 			<ReactMarkdown source={md} />
	// 			<p>On Professor Neri Oxman’s Krebs Cycle of Creativity of the relationship between the disciplines, design and science are opposite one another on the circle, and the output of one is not the input of the other as is often the case of engineering and design or science and engineering. I believe that by making a “lens” and a fusion of design and science, we can fundamentally advance both. This connection includes both the science of design and the design of science, as well as the dynamic relationship between these two activities.</p>
	// 			<p>For me, antidisciplinary research is akin to mathematician Stanislaw Ulam's famous observation that the study of nonlinear physics is like the study of "non-elephant animals." Antidisciplinary is all about the non-elephant animals.</p>
	// 			<p>I believe that by bringing together design and science we can produce a rigorous but flexible approach that will allow us to explore, understand and contribute to science in an antidisciplinary way.</p>
	// 			<p>The kind of scholars we are looking for at the Media Lab are people who don't fit in any existing discipline either because they are between--or simply beyond--traditional disciplines. I often say that if you can do what you want to do in any other lab or department, you should go do it there. Only come to the Media Lab if there is nowhere else for you to go. We are the new Salon des Refusés.</p>
	// 		</div>
	// 	);
	// }
});

export default Radium(PubContent);

styles = {
	pubBody: {
		padding: '1.25em',
		fontFamily: 'serif',
		lineHeight: '1.6em',
		fontSize: '1.2em',
		color: '#333',
		maxWidth: '700px',
	},
};
