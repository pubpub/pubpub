import React from 'react';
import Loading from 'components/Loading/Loading';

const DashboardCollectionLoading = function() {
	return (
		<div>
			<Loading margin={'3em 0em 16px'} width={'calc(95%)'} height={'13px'} />
			<Loading margin={'16px 0em 16px'} width={'calc(92%)'} height={'13px'} />
			<Loading margin={'16px 0em 16px'} width={'calc(98%)'} height={'13px'} />
			<Loading margin={'16px 0em 16px'} width={'calc(95%)'} height={'13px'} />
		</div>
	);
};

export default DashboardCollectionLoading;
