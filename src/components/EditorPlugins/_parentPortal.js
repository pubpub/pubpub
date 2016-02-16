import React, {PropTypes} from 'react';

function getParentByClassName(node, classname) {
	let parent;
	if (node === null || classname === '') return null;
	parent = node.parentNode;
	// const className = classname.toUpperCase();

	while (parent) {
		if (parent.className.indexOf(classname) !== -1) {
			return parent;
		}
		parent = parent.parentNode;
	}

	return parent;
}


const Portal = React.createClass({
	propTypes: {
		children: PropTypes.any,
		portalId: PropTypes.string
	},
	render: () => null,
	portalElement: null,
	parentNode: null,
	mountOnNode(node) {
		const pNode = getParentByClassName(node, 'p-block');
		let portal = this.props.portalId && document.getElementById(this.props.portalId);
		this.parentNode = pNode;
		if (!portal) {
			portal = document.createElement('div');
			portal.id = this.props.portalId;
			node.appendChild(portal);
		}
		this.portalElement = portal;
		this.componentDidUpdate();
	},
	componentWillUnmount() {
		document.body.removeChild(this.portalElement);
	},
	componentDidUpdate() {
		React.render(<div {...this.props}>{this.props.children}</div>, this.portalElement);
	}
});

export default Portal;
