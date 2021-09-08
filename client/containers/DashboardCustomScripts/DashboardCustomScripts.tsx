import React, { useEffect, useState } from 'react';
import { Spinner, Tabs, Tab } from '@blueprintjs/core';

import { communityCanUseCustomScripts } from 'utils/customScripts';
import { DashboardFrame } from 'components';
import { CustomScripts, Community } from 'types';

import { EditorComponentType } from './types';
import CustomScriptPanel from './CustomScriptPanel';

require('./dashboardCustomScripts.scss');

type Props = {
	customScripts: CustomScripts;
	communityId: Community;
};

const DashboardCustomScripts = (props: Props) => {
	const { customScripts, communityId } = props;
	const { js, css } = customScripts;
	const { id } = communityId;
	const [Editor, setEditor] = useState<null | EditorComponentType>(null);

	useEffect(() => {
		import('@monaco-editor/react').then(({ default: EditorComponent }) =>
			setEditor(EditorComponent),
		);
	}, []);

	const renderLoading = () => {
		return (
			<div className="loading-indicator">
				<Spinner size={14} /> Loading editor
			</div>
		);
	};

	const renderTabs = () => {
		return (
			<Tabs id="custom-scripts-tabs">
				<Tab
					id="css"
					title="CSS"
					panel={
						<CustomScriptPanel
							initialContent={css}
							type="css"
							language="css"
							label="CSS"
							EditorComponent={Editor!}
						/>
					}
				/>
				{communityCanUseCustomScripts(id) && (
					<Tab
						id="js"
						title="JavaScript"
						panel={
							<CustomScriptPanel
								initialContent={js}
								type="js"
								language="javascript"
								label="JavaScript"
								EditorComponent={Editor!}
							/>
						}
					/>
				)}
			</Tabs>
		);
	};

	return (
		<DashboardFrame className="dashboard-custom-scripts-container" title="Custom Scripts">
			{!Editor && renderLoading()}
			{Editor && renderTabs()}
		</DashboardFrame>
	);
};

export default DashboardCustomScripts;
