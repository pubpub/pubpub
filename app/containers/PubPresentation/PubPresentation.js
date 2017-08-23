import React, { Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';

import PubHeader from 'components/PubHeader/PubHeader';
import PubDetails from 'components/PubDetails/PubDetails';
import Footer from 'components/Footer/Footer';

require('./pubPresentation.scss');

const propTypes = {
	dispatch: PropTypes.func.isRequired,
	match: PropTypes.object.isRequired,
	appData: PropTypes.object.isRequired,
};

class PubPresentation extends Component {
	componentWillMount() {
		// Check that it's a valid page slug
		// If it's not - show 404
		// Grab the data for the page
	}

	render() {

		const description = 'A virtual representation of the space of an event and provide tools by which a producer can draw upon images, graphics, data, and live cameras to create a video stream equivalent to a broadcast';
		const collaborators = [
			{
				id: 0,
				slug: 'userslug',
				userInitials: 'TR',
				userAvatar: '/dev/trich.jpg',
				fullName: 'Travis Rich',
				isAuthor: true,
			},
			{
				id: 1,
				slug: 'userslug',
				userInitials: 'MW',
			},
			{
				id: 2,
				slug: 'userslug',
				userInitials: 'TW',
				userAvatar: '/dev/tomer.jpg',
				fullName: 'Tomer Weller',
				isAuthor: true,
			},
			{
				id: 3,
				slug: 'userslug',
				userInitials: 'FF',
				userAvatar: '/dev/danny.jpg',
				fullName: 'Danny Hillis',
				isAuthor: true,
			},
			{
				id: 4,
				slug: 'userslug',
				userInitials: 'WL',
			},
			{
				id: 5,
				slug: 'userslug',
				userInitials: 'PL',
				userAvatar: '/dev/lip.jpg',
			},
		];

		const pubData = {
			slug: 'myslug',
			numDiscussions: '3',
			numCollaborators: '6',
			numSuggestions: '11',
		};

		const versions = [
			{
				id: 0,
				date: new Date() - 1000000000,
				active: true,
			},
			{
				id: 1,
				date: new Date() - 2000000000,
			},
			{
				id: 3,
				date: new Date() - 5000000000,
			},
			{
				id: 2,
				date: new Date() - 3000000000,
			},
			
		];
		return (
			<div className={'pub-presentation'}>

				<Helmet>
					<title>Pub</title>
				</Helmet>

				<PubHeader
					title={'Soundscapes'}
					description={description}
					backgroundImage={'/dev/pubHeader3.jpg'}
				/>
				<PubDetails
					collaborators={collaborators}
					pubData={pubData}
					versions={versions}
				/>
				<div className={'container pub'}>
					<div className={'row'}>
						<div className={'col-12'}>
							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut proverbia non nulla veriora sint quam vestra dogmata. <code>Est, ut dicis, inquit;</code> <b>Duo Reges: constructio interrete.</b> Nam memini etiam quae nolo, oblivisci non possum quae volo. <mark>At enim hic etiam dolore.</mark> <a href='http://loripsum.net/' target='_blank'>Quo tandem modo?</a> Nec vero alia sunt quaerenda contra Carneadeam illam sententiam. </p>

						<ol>
							<li>Beatus sibi videtur esse moriens.</li>
							<li>Legimus tamen Diogenem, Antipatrum, Mnesarchum, Panaetium, multos alios in primisque familiarem nostrum Posidonium.</li>
							<li>Quicquid porro animo cernimus, id omne oritur a sensibus;</li>
							<li>In ipsa enim parum magna vis inest, ut quam optime se habere possit, si nulla cultura adhibeatur.</li>
						</ol>


						<p>Quid, si etiam iucunda memoria est praeteritorum malorum? Itaque nostrum est-quod nostrum dico, artis est-ad ea principia, quae accepimus. Ut proverbia non nulla veriora sint quam vestra dogmata. Videamus igitur sententias eorum, tum ad verba redeamus. Et ille ridens: Video, inquit, quid agas; In his igitur partibus duabus nihil erat, quod Zeno commutare gestiret. Pudebit te, inquam, illius tabulae, quam Cleanthes sane commode verbis depingere solebat. Hinc ceteri particulas arripere conati suam quisque videro voluit afferre sententiam. </p>

						<ul>
							<li>Quod non faceret, si in voluptate summum bonum poneret.</li>
							<li>Atque haec ita iustitiae propria sunt, ut sint virtutum reliquarum communia.</li>
							<li>Nam quibus rebus efficiuntur voluptates, eae non sunt in potestate sapientis.</li>
							<li>Quid enim tanto opus est instrumento in optimis artibus comparandis?</li>
							<li>Certe nihil nisi quod possit ipsum propter se iure laudari.</li>
						</ul>


						<pre>
						Modo enim fuit Carneadis, quem videre videor-est, enim nota
						imago -, a sedeque ipsa tanta ingenii, magnitudine orbata
						desiderari illam vocem puto.

						Non dolere, inquam, istud quam vim habeat postea videro;
						</pre>


						<blockquote cite='http://loripsum.net'>
							Tum ille: Finem, inquit, interrogandi, si videtur, quod quidem ego a principio ita me malle dixeram hoc ipsum providens, dialecticas captiones.
						</blockquote>


						<p>Summum ením bonum exposuit vacuitatem doloris; Reguli reiciendam; Nam Pyrrho, Aristo, Erillus iam diu abiecti. Eorum enim omnium multa praetermittentium, dum eligant aliquid, quod sequantur, quasi curta sententia; <a href='http://loripsum.net/' target='_blank'>Reguli reiciendam;</a> Quae cum dixisset, finem ille. Occultum facinus esse potuerit, gaudebit; Conclusum est enim contra Cyrenaicos satis acute, nihil ad Epicurum. </p>

						<p>Mihi enim erit isdem istis fortasse iam utendum. Hoc est dicere: Non reprehenderem asotos, si non essent asoti. <a href='http://loripsum.net/' target='_blank'>Igitur ne dolorem quidem.</a> Hoc enim constituto in philosophia constituta sunt omnia. At iam decimum annum in spelunca iacet. Verum tamen cum de rebus grandioribus dicas, ipsae res verba rapiunt; Callipho ad virtutem nihil adiunxit nisi voluptatem, Diodorus vacuitatem doloris. Velut ego nunc moveor. Atqui haec patefactio quasi rerum opertarum, cum quid quidque sit aperitur, definitio est. </p>

						<p>Nos paucis ad haec additis finem faciamus aliquando; <b>Primum quid tu dicis breve?</b> Hoc loco tenere se Triarius non potuit. Non igitur de improbo, sed de callido improbo quaerimus, qualis Q. </p>



							
							
							
						</div>
					</div>
				</div>

				<Footer />
			</div>
		);
	}
}

PubPresentation.propTypes = propTypes;
export default withRouter(connect(state => ({ appData: state.app }))(PubPresentation));
