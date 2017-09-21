import React from 'react';
import Loading from 'components/Loading/Loading';

const UserLoading = function() {
	return (
		<div className={'user'}>
			<div className={'container narrow user-header-wrapper'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<Loading float={'right'} width={'150px'} height={'150px'} borderRadius={'150px'} />
						<Loading height={'32px'} width={'calc(80% - 150px)'} />
						<Loading width={'calc(60% - 150px)'} />
						<Loading margin={'2.5em 0em 0.25em'} width={'calc(90% - 150px)'} height={'10px'} />
						<Loading margin={'0.25em 0em 0.25em'} width={'calc(90% - 150px)'} height={'10px'} />
					</div>
				</div>
			</div>
			<div className={'container narrow nav'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<hr />
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserLoading;
