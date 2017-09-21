import React from 'react';
import Loading from 'components/Loading/Loading';

const PubPresentationLoading = function() {
	return (
		<div className={'pub-presentation'} style={{ margin: '2.5em 0em' }}>
			<div className={'container pub'}>
				<Loading height={'32px'} width={'calc(85%)'} />
				<Loading height={'32px'} width={'calc(75%)'} />

				<Loading margin={'2.5em 0em 0.25em'} width={'calc(60%)'} height={'10px'} />
				<Loading margin={'0.25em 0em 0.25em'} width={'calc(60%)'} height={'10px'} />
				
				<Loading margin={'5em 0em 18px'} width={'calc(95%)'} height={'15px'} />
				<Loading margin={'18px 0em 18px'} width={'calc(92%)'} height={'15px'} />
				<Loading margin={'18px 0em 18px'} width={'calc(98%)'} height={'15px'} />
				<Loading margin={'18px 0em 18px'} width={'calc(95%)'} height={'15px'} />
				<Loading margin={'18px 0em 18px'} width={'calc(97%)'} height={'15px'} />
				<Loading margin={'18px 0em 18px'} width={'calc(92%)'} height={'15px'} />

			</div>
		</div>
	);
};

export default PubPresentationLoading;
