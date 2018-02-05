import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import { getResizedUrl } from 'utilities';

require('./layoutText.scss');

const propTypes = {
	content: PropTypes.object.isRequired,
	/* Expected content */
	/* title, html */
};

const LayoutText = function(props) {
	if (!props.content.text && !props.content.title) { return null; }
	const wrapperStyle = {
		textAlign: props.content.align || 'left',
		maxWidth: props.content.width === 'narrow' ? '800px' : 'none',
		margin: props.content.align === 'center' && props.content.width === 'narrow' ? '0 auto' : '0',
	};
	return (
		<div className="layout-text-component">
			<div className="block-content">
				{props.content.title &&
					<div className="row">
						<div className="col-12">
							<h3>{props.content.title}</h3>
						</div>
					</div>
				}
				<div className="row">
					<div className="col-12">
						<div style={wrapperStyle}>
							<Editor
								initialContent={props.content.text || undefined}
								isReadOnly={true}
							>
								<Image
									handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '1200x0'); }}
								/>
								<Video />
								<Iframe />
								<File />
							</Editor>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

LayoutText.propTypes = propTypes;
export default LayoutText;
