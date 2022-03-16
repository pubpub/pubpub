import React, { useRef } from 'react';

import { getJSON } from 'components/Editor';
import { useSticky } from 'client/utils/useSticky';

import { getTocHeadings } from '../PubHeader/headerUtils';
import { usePubContext } from '../pubHooks';
import PubHeader from '../PubHeader';
import PubHeaderSticky from '../PubHeader/PubHeaderSticky';

require('./dummySpubHeader.scss');

const getPubHeadings = (pubData, collabData) => {
	let docJson = pubData.initialDoc;
	if (collabData.editorChangeObject && collabData.editorChangeObject.view) {
		docJson = getJSON(collabData.editorChangeObject.view);
	}
	return docJson ? getTocHeadings(docJson) : [];
};

const DummySpubHeader = () => {
	const headerRef = useRef<HTMLDivElement>(null);
	const { pubData, collabData } = usePubContext();
	// TODO(ian): Move this computation to usePubBodyState()
	const pubHeadings = getPubHeadings(pubData, collabData);

	useSticky({
		isActive: !!headerRef.current,
		target: '.dummy-spub-header-component',
		offset: headerRef?.current?.offsetHeight ? 37 - headerRef.current.offsetHeight : 0,
	});

	return (
		<div className="dummy-spub-header-component" ref={headerRef}>
			<div className="content-container">
				<PubHeader sticky={false} />
			</div>
			<PubHeaderSticky pubData={pubData} pubHeadings={pubHeadings} />
		</div>
	);
};

export default DummySpubHeader;
