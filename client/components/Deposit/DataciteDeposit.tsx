import { apiFetch } from 'client/utils/apiFetch';
import React, { useEffect, useState } from 'react';
import { Collection, Community, InitialCommunityData } from 'types';
import community from 'utils/crossref/transform/community';

type Props = {
	communityData: InitialCommunityData;
	collection: Collection;
};

type Node = {
	type: 'element' | 'text';
	name: string;
	attributes: { [key: string]: unknown };
	children: Node[];
};

function Node(props: Node) {
	return (
		<dl>
			<dt>name</dt>
			<dd>{props.name}</dd>
			{props.attributes &&
				Object.entries(props.attributes).map(([attributeKey, attributeValue]) => {
					return (
						<>
							<dt>{attributeKey}</dt>
							<dd>{String(attributeValue)}</dd>
						</>
					);
				})}
			{props.children?.length > 0 && (
				<>
					<dt>children</dt>
					<dd>
						{props.children.map((child) => (
							<Node {...child} />
						))}
					</dd>
				</>
			)}
		</dl>
	);
}

export default function DataciteDeposit(props: Props) {
	const [result, setResult] = useState();
	const { communityData, collection } = props;
	useEffect(() => {
		apiFetch(
			`/api/deposit?communityId=${communityData.id}&collectionId=${collection.id}&target=collection`,
		).then((json) => {
			setResult(json);
		});
	}, []);
	return <div>{result && <Node {...result} />}</div>;
}
