import ReactDOMServer from 'react-dom/server';
import React from 'react';
import About from 'containers/About/About';
import Html from '../Html';
import app from '../server';
import { Pub} from '../models';

app.get('/about', (req, res)=> {
	return Pub.findOne()
	.then((pub)=> {
		const initialData = { text: pub.title };
		return ReactDOMServer.renderToNodeStream(
			<Html
				chunkName="About"
				initialData={initialData}
				headerComponents={[
					<title key="meta-title">Whatss</title>,
					<meta key="meta-desc" name="description" content="Nested component" />,
				]}
			>
				<About {...initialData} />
			</Html>
		)
		.pipe(res);
	})
	.catch((err)=> {
		console.log('Err', err);
		return res.status(500).json('Error');
	});
});
