import React from 'react';

import Html from 'server/Html';
import app from 'server/server';
import { EmailChangeToken } from 'server/models';
import { handleErrors } from 'server/utils/errors';
import { getInitialData } from 'server/utils/initData';
import { generateMetaComponents, renderToNodeStream } from 'server/utils/ssr';

app.get('/email-change/:token', (req, res, next) => {
	const findToken = EmailChangeToken.findOne({
		where: { token: req.params.token ?? null, usedAt: null },
	});

	return Promise.all([getInitialData(req), findToken])
		.then(([initialData, tokenData]) => {
			let tokenIsValid = true;
			let newEmail = '';

			if (!tokenData) {
				tokenIsValid = false;
			}
			if (tokenData && tokenData.expiresAt < new Date()) {
				tokenIsValid = false;
			}

			if (tokenIsValid && tokenData) {
				newEmail = tokenData.newEmail;
			}

			return renderToNodeStream(
				res,
				<Html
					chunkName="EmailChange"
					initialData={initialData}
					viewData={{
						emailChangeData: {
							tokenIsValid,
							token: req.params.token,
							newEmail,
						},
					}}
					headerComponents={generateMetaComponents({
						initialData,
						title: 'Confirm Email Change',
					})}
				/>,
			);
		})
		.catch(handleErrors(req, res, next));
});
