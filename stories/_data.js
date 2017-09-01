/* eslint-disable global-require */
import React from 'react';

export const accentDataDark = {
	accentColor: '#D13232',
	accentTextColor: '#FFF',
	accentActionColor: '#A72828',
	accentHoverColor: '#BC2D2D',
	accentMinimalColor: 'rgba(209, 50, 50, 0.15)',
};

export const accentDataLight = {
	accentColor: '#26E0D0',
	accentTextColor: '#000',
	accentActionColor: '#51E6D9',
	accentHoverColor: '#3BE3D4',
	accentMinimalColor: 'rgba(38, 224, 208, 0.15)',
};

// The following data should match the API routes they are associated with. 

/*  api.pubpub.org/communities/:hostname  */
export const communityData = require('./_dataCommunity.js').default;

/*  api.pubpub.org/users/:slug  */
export const userData = require('./_dataUser.js').default;

/*  api.pubpub.org/pubs/:slug  */
export const pubData = require('./_dataPub.js').default;

// export const navItems = [
// 	{
// 		slug: '/',
// 		title: 'Home',
// 		id: 1,
// 	},
// 	{
// 		slug: '/sensors',
// 		title: 'Sensors',
// 		id: 2,
// 	},
// 	{
// 		id: 3.5,
// 		title: 'Issues',
// 		children: [
// 			{
// 				slug: '/2017',
// 				title: '2017',
// 				id: 21,
// 			},
// 			{
// 				slug: '/2016',
// 				title: '2016',
// 				id: 22,
// 			},
// 			{
// 				slug: '/2018',
// 				title: 'Super Long 2018 Edition Extravaganza',
// 				id: 23,
// 			},
// 		]
// 	},
// 	{
// 		slug: '/meeting-notes',
// 		title: 'Meeting-Notes',
// 		id: 3,
// 	},
// 	{
// 		slug: '/blockchain',
// 		title: 'Blockchain',
// 		id: 4,
// 	},
// 	{
// 		slug: '/new-ideas',
// 		title: 'New Ideas',
// 		id: 5,
// 	},
// 	{
// 		slug: '/bad-ideas',
// 		title: 'Bad-Ideas',
// 		id: 6,
// 	},
// 	{
// 		slug: '/submissions',
// 		title: 'Submissions',
// 		id: 7,
// 	},
// 	{
// 		slug: '/about',
// 		title: 'About',
// 		id: 8,
// 	},
// ];


export const collectionData = {
	title: 'Sensor Hardware',
	slug: 'sensors',
	description: 'An open collection dedicated to the free discussion of new topics relating to elephants and whales that create hardware.',
	isPrivate: true,
	isOpenSubmissions: true,
	isPage: false,
	pubs: [
		{
			id: 0,
			title: 'Open Schematics',
			slug: 'open-schematics',
			lastModified: String(new Date()),
			status: 'published',
			numCollaborators: 12,
			numSuggestions: 8,
			numDiscussions: 4,
		},
		{
			id: 1,
			title: 'Regulatory Endeavors of Mammals',
			slug: 'regulatory',
			lastModified: String(new Date()),
			status: 'unpublished',
			numCollaborators: 7,
			numSuggestions: 0,
			numDiscussions: 13,
		},
		{
			id: 2,
			title: 'A Lesson in Pedagogy',
			slug: 'pedagogy',
			lastModified: String(new Date()),
			status: 'submitted',
			numCollaborators: 8,
			numSuggestions: 24,
			numDiscussions: 1,
		},
	],
};

export const pubBody = (
	<div className={'article-content'}>
		<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duo Reges: constructio interrete. Eam stabilem appellas. Consequens enim est et post oritur, ut dixi. Te enim iudicem aequum puto, modo quae dicat ille bene noris. Compensabatur, inquit, cum summis doloribus laetitia. <b>Hoc simile tandem est?</b> </p>

		<h2>Amicitiam autem adhibendam esse censent, quia sit ex eo genere, quae prosunt.</h2>

		<p>Idemne, quod iucunde? <b>Si quae forte-possumus.</b> Omnes enim iucundum motum, quo sensus hilaretur. Respondent extrema primis, media utrisque, omnia omnibus. Qua ex cognitione facilior facta est investigatio rerum occultissimarum. Respondent extrema primis, media utrisque, omnia omnibus. Laelius clamores sofòw ille so lebat Edere compellans gumias ex ordine nostros. </p>

		<pre>
		Cum sciret confestim esse moriendum eamque mortem ardentiore
		studio peteret, quam Epicurus voluptatem petendam putat.

		Atqui haec patefactio quasi rerum opertarum, cum quid
		quidque sit aperitur, definitio est.
		</pre>


		<ol>
			<li>Quae similitudo in genere etiam humano apparet.</li>
			<li>Servari enim iustitia nisi a forti viro, nisi a sapiente non potest.</li>
		</ol>


		<p>Idemne, quod iucunde? <b>Si quae forte-possumus.</b> Omnes enim iucundum motum, quo sensus hilaretur. Respondent extrema primis, media utrisque, omnia omnibus. Qua ex cognitione facilior facta est investigatio rerum occultissimarum. Respondent extrema primis, media utrisque, omnia omnibus. Laelius clamores sofòw ille so lebat Edere compellans gumias ex ordine nostros. </p>

		<img src="/dev/banner3.jpg" alt="Hello" />

		<h2>Ipse Epicurus fortasse redderet, ut Sextus Peducaeus, Sex.</h2>

		<p>Summum ením bonum exposuit vacuitatem doloris; Quorum sine causa fieri nihil putandum est. Itaque his sapiens semper vacabit. Ergo, si semel tristior effectus est, hilara vita amissa est? <a href="http://loripsum.net/" target="_blank" rel="noopener noreferrer">Summus dolor plures dies manere non potest?</a> Itaque dicunt nec dubitant: mihi sic usus est, tibi ut opus est facto, fac. Qui ita affectus, beatum esse numquam probabis; Memini vero, inquam; Omnia contraria, quos etiam insanos esse vultis. Quae qui non vident, nihil umquam magnum ac cognitione dignum amaverunt. Nunc haec primum fortasse audientis servire debemus. </p>

		<ul>
			<li>Minime vero istorum quidem, inquit.</li>
			<li>Non quaeritur autem quid naturae tuae consentaneum sit, sed quid disciplinae.</li>
			<li>Atqui iste locus est, Piso, tibi etiam atque etiam confirmandus, inquam;</li>
			<li>Quamquam tu hanc copiosiorem etiam soles dicere.</li>
		</ul>


		<p>At ille pellit, qui permulcet sensum voluptate. Quid ait Aristoteles reliquique Platonis alumni? Quorum sine causa fieri nihil putandum est. Suo genere perveniant ad extremum; </p>

		<blockquote cite="http://loripsum.net">
			Dicuntur ista, Cato, magnifice, inquam, sed videsne verborum gloriam tibi cum Pyrrhone et cum Aristone, qui omnia exaequant, esse communem?
		</blockquote>

		<img src="/dev/tomer.jpg" alt="Hello" />

		<p>Itaque haec cum illis est dissensio, cum Peripateticis nulla sane. Sed quia studebat laudi et dignitati, multum in virtute processerat. Gerendus est mos, modo recte sentiat. Cur post Tarentum ad Archytam? Hanc quoque iucunditatem, si vis, transfer in animum; <a href="http://loripsum.net/" target="_blank" rel="noopener noreferrer">Laboro autem non sine causa;</a> Collatio igitur ista te nihil iuvat. Qui-vere falsone, quaerere mittimus-dicitur oculis se privasse; </p>

		<pre>
		Quae mihi ipsi, qui volo et esse et haberi gratus, grata non
		essent, nisi eum perspicerem mea causa mihi amicum fuisse,
		non sua, nisi hoc dicis sua, quod interest omnium recte
		facere.

		Aperiendum est igitur, quid sit voluptas;
		</pre>

		<img src="/dev/pubHeader3.jpg" alt="Hello" />

		<p>Bonum negas esse divitias, praeposìtum esse dicis? Quae diligentissime contra Aristonem dicuntur a Chryippo. Serpere anguiculos, nare anaticulas, evolare merulas, cornibus uti videmus boves, nepas aculeis. Immo videri fortasse. <code>Itaque contra est, ac dicitis;</code> Apud ceteros autem philosophos, qui quaesivit aliquid, tacet; </p>

		<ol>
			<li>Quia, si mala sunt, is, qui erit in iis, beatus non erit.</li>
			<li>Scientiam pollicentur, quam non erat mirum sapientiae cupido patria esse cariorem.</li>
			<li>Isto modo ne improbos quidem, si essent boni viri.</li>
			<li>Sed memento te, quae nos sentiamus, omnia probare, nisi quod verbis aliter utamur, mihi autem vestrorum nihil probari.</li>
		</ol>


		<p>Portenta haec esse dicit, neque ea ratione ullo modo posse vivi; Quamquam te quidem video minime esse deterritum. Sint modo partes vitae beatae. Audeo dicere, inquit. Immo videri fortasse. Ad quorum et cognitionem et usum iam corroborati natura ipsa praeeunte deducimur. <a href="http://loripsum.net/" target="_blank" rel="noopener noreferrer">Age, inquies, ista parva sunt.</a> <a href="http://loripsum.net/" target="_blank" rel="noopener noreferrer">Comprehensum, quod cognitum non habet?</a> Quid enim est a Chrysippo praetermissum in Stoicis? Nam de isto magna dissensio est. </p>

		<h5>Quid autem habent admirationis, cum prope accesseris?</h5>

		<p>Animi enim quoque dolores percipiet omnibus partibus maiores quam corporis. Vestri haec verecundius, illi fortasse constantius. Non est ista, inquam, Piso, magna dissensio. Sed quae tandem ista ratio est? <b>Eam stabilem appellas.</b> Non laboro, inquit, de nomine. </p>

		<pre>
		Quid autem sit, quod ita moveat itaque a natura in primo
		ortu appetatur, non constat deque eo est inter philosophos,
		cum summum bonum exquiritur, omnis dissensio.

		Non enim in ipsa sapientia positum est beatum esse, sed in
		iis rebus, quas sapientia comparat ad voluptatem.
		</pre>


		<ul>
			<li>Itaque hoc frequenter dici solet a vobis, non intellegere nos, quam dicat Epicurus voluptatem.</li>
			<li>Igitur neque stultorum quisquam beatus neque sapientium non beatus.</li>
			<li>Quamquam ab iis philosophiam et omnes ingenuas disciplinas habemus;</li>
			<li>Possumusne ergo in vita summum bonum dicere, cum id ne in cena quidem posse videamur?</li>
			<li>Sed non sunt in eo genere tantae commoditates corporis tamque productae temporibus tamque multae.</li>
		</ul>


		<p>Quis enim redargueret? Ita prorsus, inquam; Cur ipse Pythagoras et Aegyptum lustravit et Persarum magos adiit? Tum Quintus: Est plane, Piso, ut dicis, inquit. Si longus, levis; <a href="http://loripsum.net/" target="_blank" rel="noopener noreferrer">Explanetur igitur.</a> </p>

		<blockquote cite="http://loripsum.net">
			Attica pubes reliquique Graeci, qui hoc anapaesto citantur, hoc non dolere solum voluptatis nomine appellaret, illud Aristippeum contemneret, aut, si utrumque probaret, ut probat, coniungeret doloris vacuitatem cum voluptate et duobus ultimis uteretur.
		</blockquote>


		<h3>Si longus, levis dictata sunt.</h3>

		<p>Qua igitur re ab deo vincitur, si aeternitate non vincitur? Iam quae corporis sunt, ea nec auctoritatem cum animi partibus, comparandam et cognitionem habent faciliorem. <i>Quid ergo?</i> Ergo hoc quidem apparet, nos ad agendum esse natos. <a href="http://loripsum.net/" target="_blank" rel="noopener noreferrer">A mene tu?</a> </p>

		<p>Age nunc isti doceant, vel tu potius quis enim ista melius? Eaedem enim utilitates poterunt eas labefactare atque pervertere. Nummus in Croesi divitiis obscuratur, pars est tamen divitiarum. Quo modo autem optimum, si bonum praeterea nullum est? Quo modo autem philosophus loquitur? <i>Tu quidem reddes;</i> </p>

		<ol>
			<li>Sin aliud quid voles, postea.</li>
			<li>Tu autem inter haec tantam multitudinem hominum interiectam non vides nec laetantium nec dolentium?</li>
			<li>Quae tamen a te agetur non melior, quam illae sunt, quas interdum optines.</li>
			<li>Quid enim?</li>
		</ol>


		<h4>Quod ea non occurrentia fingunt, vincunt Aristonem;</h4>

		<p>Gloriosa ostentatio in constituendo summo bono. Quae diligentissime contra Aristonem dicuntur a Chryippo. <span>Et nemo nimium beatus est;</span> Quod ea non occurrentia fingunt, vincunt Aristonem; Rationis enim perfectio est virtus; </p>

		<p>Expressa vero in iis aetatibus, quae iam confirmatae sunt. In quibus doctissimi illi veteres inesse quiddam caeleste et divinum putaverunt. <b>Quis Aristidem non mortuum diligit?</b> <b>An haec ab eo non dicuntur?</b> Suo genere perveniant ad extremum; Non risu potius quam oratione eiciendum? </p>

		<p>Videmusne ut pueri ne verberibus quidem a contemplandis rebus perquirendisque deterreantur? Quibusnam praeteritis? Quae iam oratio non a philosopho aliquo, sed a censore opprimenda est. Quod quidem iam fit etiam in Academia. Quamquam haec quidem praeposita recte et reiecta dicere licebit. Portenta haec esse dicit, neque ea ratione ullo modo posse vivi; Quo modo autem optimum, si bonum praeterea nullum est? At ille non pertimuit saneque fidenter: Istis quidem ipsis verbis, inquit; </p>

		<blockquote cite="http://loripsum.net">
			Quid dubitas igitur, inquam, summo bono a te ita constituto, ut id totum in non dolendo sit, id tenere unum, id tueri, id defendere?
		</blockquote>


		<p>Minime vero, inquit ille, consentit. Si id dicis, vicimus. Omnes enim iucundum motum, quo sensus hilaretur. Omnia contraria, quos etiam insanos esse vultis. </p>

		<ul>
			<li>Cur id non ita fit?</li>
			<li>Placet igitur tibi, Cato, cum res sumpseris non concessas, ex illis efficere, quod velis?</li>
			<li>Etsi ea quidem, quae adhuc dixisti, quamvis ad aetatem recte isto modo dicerentur.</li>
			<li>Hoc non est positum in nostra actione.</li>
			<li>At iste non dolendi status non vocatur voluptas.</li>
		</ul>
	</div>
);
