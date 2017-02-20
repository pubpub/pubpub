import React, { PropTypes } from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import Link from 'components/Link/Link';

let styles = {};

export const ExperimentsMain = React.createClass({
	propTypes: {
		params: PropTypes.object,
	},

	render: function() {
		const experiments = [
			{
				title: 'Impact of Review',
				description: 'We study the influence peer review has on the content of submitted peer-reviewed scientific papers. We ask for the first draft and final draft (after peer review) and anylyze the change in content. We will never share, publish, or release the raw before-and-after content - only measurements of differences.',
				image: 'https://i.imgur.com/PNhwsH3.jpg',
				link: '/experiments/reviewdiff',
			},
			{
				title: 'Impact of Review',
				description: 'We study the influence peer review has on the content of submitted peer-reviewed scientific papers. We ask for the first draft and final draft (after peer review) and anylyze the change in content. We will never share, publish, or release the raw before-and-after content - only measurements of differences.',
				image: 'https://i.imgur.com/PNhwsH3.jpg',
				link: '/experiments/reviewdiff',
			}
		];

		return (
			<div style={styles.container}>
				<Helmet title={'Experiments · PubPub'} />

				<h1>Experiments</h1>				
				<p>PubPub is being built as a platform that not only provides open and free publishing tools, but one that allows us to experiment and learn about the scientific publishing process.</p>
				<p>We invite you to participate in the experiments below. Your participation in these experiments is <b>not</b> linked to your PubPub profile in any way. The data collected in these experiments is self-contained and anonymized.</p>
				<p>The results of these experiments will be published and available on PubPub.</p>

				{experiments.map((item, index)=> {
					return (
						<div style={styles.wrapper} key={`experiment-${index}`}>
							<img src={item.image} style={styles.image} />
							<div style={styles.itemContent}>
								<div style={styles.buttonWrapper}>
									<Link to={item.link} className={'pt-button pt-intent-primary'}>Join Experiment</Link>
								</div>
								<div style={styles.title}>{item.title}</div>
								<div style={styles.description}>{item.description}</div>
							</div>
						</div>
					);
				})}

			</div>
		);
	}

});


export default Radium(ExperimentsMain);

styles = {
	container: {
		width: '767px',
		padding: '2em 1em',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},	
	wrapper: {
		margin: '2em 0em',
		padding: '2em 0em',
		borderTop: '1px solid #EEE',
	},
	image: {
		width: '100px',
		position: 'absolute',
	},
	itemContent: {
		paddingLeft: '125px',
	},
	title: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		lineHeight: 1,
		paddingBottom: '0.25em',
	},
	buttonWrapper: {
		float: 'right',
		padding: '0em 0em 1em 1em',
	},
};
