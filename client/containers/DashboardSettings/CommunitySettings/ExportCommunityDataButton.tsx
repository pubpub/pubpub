import { Button } from '@blueprintjs/core';
import { apiFetch } from 'client/utils/apiFetch';
import { pingTask } from 'client/utils/pingTask';
import React, { useState } from 'react';

export const ExportCommunityDataButton = ({ disabled }: { disabled?: boolean }) => {
	const [isExporting, setIsExporting] = useState(false);
	const [exportUrl, setExportUrl] = useState<string | null>(null);

	return (
		<div>
			{exportUrl && (
				<a href={exportUrl} target="_blank" rel="noopener noreferrer">
					Download
				</a>
			)}
			<Button
				disabled={isExporting || disabled}
				onClick={() => {
					setIsExporting(true);
					apiFetch('/api/communities/archive', {
						method: 'POST',
						body: JSON.stringify({ dontWait: true }),
					})
						.then(({ url, workerTaskId }) => {
							setExportUrl(url);
							return pingTask(workerTaskId, 1000);
						})
						.then(() => {
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
	);
};
