import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';


export const ImageViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	render: function() {
		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const imageSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const scaledURL = 'https://jake.pubpub.org/unsafe/fit-in/650x0/' + imageSource; // To learn about jake.pubpub fit-in, see Thumbor docs: http://thumbor.readthedocs.io/en/latest/usage.html#fit-in
		return (
			<img src={scaledURL} alt={title} />
		);
	}
});

export default Radium(ImageViewer);

