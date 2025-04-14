import { Button, Classes } from '@blueprintjs/core';
import { apiFetch } from 'client/utils/apiFetch';
import { pingTask } from 'client/utils/pingTask';
import React, { useState } from 'react';

export const ExportCommunityDataButton = ({ disabled }: { disabled?: boolean }) => {
	const [isExporting, setIsExporting] = useState(false);
	const [exportUrl, setExportUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	return (
		<div>
			<div>
				<Button
					disabled={isExporting || disabled}
					onClick={() => {
						setExportUrl(null);
						setError(null);
						setIsExporting(true);
						apiFetch('/api/communities/archive', {
							method: 'POST',
							body: JSON.stringify({ dontWait: true }),
						})
							.then(({ workerTaskId }) => {
								return pingTask(workerTaskId, 1000);
							})
							.then((output) => {
								if (typeof output !== 'string') {
									console.error('Invalid output', output);
									setError('Invalid output');
									return;
								}

								setExportUrl(output);
								setIsExporting(false);
							})
							.catch((e) => {
								setIsExporting(false);
								console.error(e);
							});
					}}
				>
					{isExporting ? 'Exporting...' : 'Export Community Data'}
				</Button>
			</div>

			{exportUrl && (
				<p>
					<a href={exportUrl} target="_blank" rel="noopener noreferrer">
						Download
					</a>
				</p>
			)}
			{error && <p className={Classes.INTENT_DANGER}>{error}</p>}
		</div>
	);
};
