import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from '@pubpub/editor';

require('./pubBody.scss');

const propTypes = {
	versionId: PropTypes.string.isRequired,
	content: PropTypes.object.isRequired,
};

const PubBody = function(props) {
	return (
		<div className={'pub-body'}>
			<div className={'container pub'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<Editor
							key={`render-${props.versionId}`}
							initialContent={props.content}
							isReadOnly={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

PubBody.propTypes = propTypes;
export default PubBody;
