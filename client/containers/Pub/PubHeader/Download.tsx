import React, { useState, useEffect, useCallback } from 'react';
import { Button, Classes, Icon, Spinner, Tooltip } from '@blueprintjs/core';

import { Menu, MenuItem } from 'components/Menu';
import { apiFetch } from 'client/utils/apiFetch';
import { pingTask } from 'client/utils/pingTask';
import { usePageContext } from 'utils/hooks';
import { ExportFormat } from 'utils/export/formats';
import { useAnalytics } from 'utils/analytics/useAnalytics';

import { usePubHistory } from '../pubHooks';
import { getFormattedDownload } from './headerUtils';

require('./download.scss');

type Props = {
	pubData: any;
	children: React.ReactNode;
};

type FormatType = {
	format: ExportFormat;
	title: string;
};

const formatTypes: FormatType[] = [
	{ format: 'pdf', title: 'PDF' },
	{ format: 'docx', title: 'Word' },
	{ format: 'markdown', title: 'Markdown' },
	{ format: 'epub', title: 'EPUB' },
	{ format: 'html', title: 'HTML' },
	{ format: 'odt', title: 'OpenDocument' },
	{ format: 'plain', title: 'Plain Text' },
	{ format: 'jats', title: 'JATS XML' },
	{ format: 'tex', title: 'LaTeX' },
];

const mustShowDownloadButton = () => navigator.userAgent.match(/iP(ad|hone|od)/i);

const Download = (props: Props) => {
	const { pubData, children } = props;
	const { downloads = [] } = pubData;
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [selectedType, setSelectedType] = useState<null | FormatType>(null);
	const [selectedKey, setSelectedKey] = useState<null | number>(null);
	const [downloadUrl, setDownloadUrl] = useState<null | string>(null);
	const { latestKey } = usePubHistory();
	const { communityData, locationData } = usePageContext();
	const { track } = useAnalytics();
	const formattedDownload = getFormattedDownload(downloads);

	const download = (url) => {
		setIsLoading(false);
		setDownloadUrl(null);
		window.open(url);
	};
	const getMatchingExport = useCallback(
		(format: string) =>
			pubData.exports.find((ex) => ex.format === format && ex.historyKey >= latestKey),
		[pubData.exports, latestKey],
	);
	// eslint-disable-next-line consistent-return
	const handleStartDownload = (type) => {
		track('download', {
			communityId: communityData.id,
			communityName: communityData.title,
			communitySubdomain: communityData.subdomain,
			format: type.format,
			pubId: pubData.id,
			isProd: locationData.isProd,
		});
		if (type.format === 'formatted') {
			return download(formattedDownload.url);
		}

		const matchingExport = getMatchingExport(type.format);

		if (matchingExport && matchingExport.url) {
			return download(matchingExport.url);
		}

		setSelectedType(type);
		setSelectedKey(latestKey);
		setIsError(false);
		setIsLoading(true);
	};

	useEffect(() => {
		const downloadOrShowButton = (url) => {
			if (mustShowDownloadButton()) {
				setDownloadUrl(url);
				setIsLoading(false);
			} else {
				download(url);
			}
		};

		if (!isLoading) {
			return;
		}
		setIsError(false);
		// Kicks off an export task on the backend
		apiFetch('/api/export', {
			method: 'POST',
			body: JSON.stringify({
				pubId: pubData.id,
				communityId: communityData.id,
				format: selectedType?.format,
				historyKey: selectedKey,
				accessHash: locationData.query.access,
			}),
		})
			.then(({ taskId, url }) => {
				if (url) {
					downloadOrShowButton(url);
				}
				if (taskId) {
					// @ts-expect-error ts-migrate(2345) FIXME: Argument of type '({ url: laterUrl }: { url: any; ... Remove this comment to see the full error message
					return pingTask(taskId, 1500).then(({ url: laterUrl }) =>
						downloadOrShowButton(laterUrl),
					);
				}
				return null;
			})
			.catch(() => {
				setIsError(true);
				setIsLoading(false);
			});
	}, [
		isLoading,
		selectedType,
		selectedKey,
		pubData.id,
		locationData.query.access,
		communityData.id,
	]);

	return (
		<>
			{/* hidden download links that are always rendered */}
			<div style={{ display: 'none' }}>
				{formattedDownload && (
					<a
						href={formattedDownload.url}
						download
						aria-hidden="true"
						data-export-format="formatted"
						data-export-available={formattedDownload.url}
					>
						Formatted Download
					</a>
				)}
				{formatTypes.map((type) => {
					const matchingExport = getMatchingExport(type.format);
					return (
						<a
							key={type.format}
							href={matchingExport?.url || '#'}
							download
							aria-hidden="true"
							data-export-format={type.format}
							data-export-available={Boolean(matchingExport?.url)}
						>
							{type.title} Download
						</a>
					);
				})}
			</div>
			<Menu
				disclosure={children}
				className="pub-download-component"
				aria-label="Pub download formats"
				placement="bottom-end"
			>
				{formattedDownload && (
					<React.Fragment>
						<li className={Classes.MENU_HEADER}>
							<h6 className={Classes.HEADING}>Formatted Download</h6>
						</li>
						<MenuItem
							dismissOnClick={false}
							labelElement={<Icon icon="star" />}
							className="formatted-button"
							// intent={Intent.PRIMARY}
							text={`Formatted ${formattedDownload.url
								.split('.')
								.pop()
								.toUpperCase()}`}
							// @ts-expect-error ts-migrate(2322) FIXME: Type '{ dismissOnClick: false; labelElement: Eleme... Remove this comment to see the full error message
							loading={isLoading && selectedType?.format === 'formatted'}
							onClick={() => handleStartDownload({ format: 'formatted' })}
						/>
					</React.Fragment>
				)}
				<li className={Classes.MENU_HEADER}>
					<h6 className={Classes.HEADING}>Auto Generated Download</h6>
				</li>
				{formatTypes.map((type, i) => {
					const shouldRenderButton = downloadUrl && selectedType?.format === type.format;
					return (
						<MenuItem
							// eslint-disable-next-line react/no-array-index-key
							key={`${i}-${type.format}`}
							dismissOnClick={false}
							disabled={isLoading && selectedType?.format !== type.format}
							rightElement={
								<span>
									{isLoading && selectedType?.format === type.format && (
										<Spinner size={Spinner.SIZE_SMALL} />
									)}
								</span>
							}
							onClick={() => handleStartDownload(type)}
							text={
								<Tooltip
									key={type.format}
									isOpen={isError && selectedType?.format === type.format}
									content="There was a problem generating the file."
								>
									{shouldRenderButton ? (
										<Button
											icon="download"
											onClick={() => download(downloadUrl)}
										>
											Download {type.title} file
										</Button>
									) : (
										type.title
									)}
								</Tooltip>
							}
						/>
					);
				})}
			</Menu>
		</>
	);
};
export default Download;
