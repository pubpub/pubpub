import React from 'react';
import Loading from 'components/Loading/Loading';

const PubPreviewLoading = function() {
	return (
		<div style={{ marginBottom: '2em' }}>
			<Loading float={'right'} width={'150px'} height={'150px'} />
			<Loading height={'32px'} width={'calc(60% - 150px)'} />
			<Loading margin={'2.5em 0em 0.25em'} width={'calc(70% - 150px)'} height={'10px'} />
			<Loading margin={'0.25em 0em 0.25em'} width={'calc(70% - 150px)'} height={'10px'} />
			<div className={'clearfix'} />
		</div>
	);
};

export default PubPreviewLoading;
