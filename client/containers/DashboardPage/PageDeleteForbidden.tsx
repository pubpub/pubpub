import React from 'react';

type Props = {
	pageData: {
		title?: string;
	};
};

const PageDeleteForbidden = (props: Props) => {
	const {
		pageData: { title },
	} = props;
	return (
		<div className="bp3-callout bp3-intent-danger">
			<h5>Delete Page from Community</h5>
			<p>
				<b>{title}</b> cannot be deleted because it is the home page for this community.
			</p>
		</div>
	);
};

export default PageDeleteForbidden;
