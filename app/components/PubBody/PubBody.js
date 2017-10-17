import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';
import Image from '@pubpub/editor/addons/Image';
import Video from '@pubpub/editor/addons/Video';
import File from '@pubpub/editor/addons/File';
import Iframe from '@pubpub/editor/addons/Iframe';
import Latex from '@pubpub/editor/addons/Latex';
import Footnote from '@pubpub/editor/addons/Footnote';
import Citation from '@pubpub/editor/addons/Citation';
import Discussion from 'components/DiscussionAddon/DiscussionAddon';
import { getResizedUrl } from 'utilities';

require('./pubBody.scss');

const propTypes = {
	versionId: PropTypes.string.isRequired,
	content: PropTypes.object.isRequired,
	threads: PropTypes.array,
	slug: PropTypes.string,
};
const defaultProps = {
	threads: [],
	slug: '',
};
const contextTypes = {
	router: PropTypes.object,
};

const PubBody = function(props, context) {
	return (
		<div className={'pub-body'}>
			<div className={'container pub'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<Editor
							key={`render-${props.versionId}`}
							initialContent={props.content}
							isReadOnly={true}
						>
							<Image handleResizeUrl={(url)=> { return getResizedUrl(url, 'fit-in', '800x0'); }} />
							<Video />
							<File />
							<Iframe />
							<Latex />
							<Footnote />
							<Citation />
							<Discussion
								threads={props.threads}
								routerContext={context.router}
								slug={props.slug}
							/>
						</Editor>
					</div>
				</div>
			</div>
		</div>
	);
};

PubBody.propTypes = propTypes;
PubBody.defaultProps = defaultProps;
PubBody.contextTypes = contextTypes;
export default PubBody;
