import React from 'react';

import { usePageContext } from 'utils/hooks';

import './honeypot.scss';

type HoneypotProps = {
	name: string;
};

const Honeypot = (props: HoneypotProps) => {
	const { name } = props;
	const { locationData } = usePageContext();
	const devMode = !locationData.isProd;

	if (devMode) {
		return (
			<div
				className="honeypot-dev"
				style={{
					border: '2px dashed orange',
					padding: 8,
					margin: '8px 0',
					borderRadius: 4,
				}}
			>
				<label style={{ fontSize: 11, color: 'orange', fontWeight: 600 }}>
					Honeypot ({name}) - visible in dev only
					<input
						type="text"
						name={name}
						autoComplete="off"
						style={{ display: 'block', marginTop: 4, width: '100%' }}
					/>
				</label>
			</div>
		);
	}

	return (
		<input
			type="text"
			className="honeypot-input"
			name={name}
			tabIndex={-1}
			autoComplete="off"
			aria-hidden="true"
		/>
	);
};

export default Honeypot;
