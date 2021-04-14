import React, { useEffect, useState } from 'react';

import { DashboardFrame } from 'components';
import { CustomScripts } from 'utils/types';

type Props = {
	customScripts: CustomScripts;
};

const DashboardCustomScripts = (props: Props) => {
	const { customScripts } = props;
	const [Editor, setEditor] = useState<any>(null);

	useEffect(() => {
		import('@monaco-editor/react').then((module) => {
			console.log(module);
			setEditor(module);
		});
	}, []);

	return <DashboardFrame title="Custom Scripts">Hello.</DashboardFrame>;
};

export default DashboardCustomScripts;
