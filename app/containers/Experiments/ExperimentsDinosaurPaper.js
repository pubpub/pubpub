import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Button, Slider } from '@blueprintjs/core';
import Textarea from 'react-textarea-autosize';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

let styles = {};

export const ExperimentsDinosaurPaper = React.createClass({
	propTypes: {
		mode: PropTypes.number,
	},

	getInitialState() {
		return {
			width: 400,
			margin: 0,
			offsets: [
				3,
				3,
				4,
				5,
				5,
				8,
			],
			code: 'function generateOffsets() {\n  var femur1 = [{ age: 0, circumference: 104 }, { age: 1, circumference: 112 }, { age: 2, circumference: 119 }, { age: 3, circumference: 126 }, { age: 4, circumference: 134 }, { age: 5, circumference: 143 }, { age: 6, circumference: 153 }, { age: 7, circumference: 158 }, { age: 8, circumference: 162 }, { age: 9, circumference: 165 }, { age: 10, circumference: 190 }];\n  var femur2 = [{ age: 0, circumference: 110 }, { age: 1, circumference: 113 }, { age: 2, circumference: 120 }, { age: 3, circumference: 125 }]; \n  var femur3 = [{ age: 0, circumference: 138 }, { age: 1, circumference: 144 }, { age: 2, circumference: 146 }, { age: 3, circumference: 153 }];\n  var femur4 = [{ age: 0, circumference: 130 }, { age: 1, circumference: 158 }, { age: 2, circumference: 171 }, { age: 3, circumference: 182 }, { age: 4, circumference: 209 }];\n  var femur5 = [{ age: 0, circumference: 135 }, { age: 1, circumference: 152 }, { age: 2, circumference: 163 }, { age: 3, circumference: 202 }, { age: 4, circumference: 260 }, { age: 5, circumference: 262 }, { age: 6, circumference: 279 }, { age: 7, circumference: 286 }];\n  var femur6 = [{ age: 0, circumference: 172 }, { age: 1, circumference: 235 }, { age: 2, circumference: 265 }, { age: 3, circumference: 274 }, { age: 4, circumference: 335 }, { age: 5, circumference: 338 }];\n  \n  var offsets = [3, 3, 4, 5, 5, 8];\n  return offsets;\n};\n\ngenerateOffsets();',
			colors: [
				'#8884d8',
				'#82ca9d',
				'#a2ca9d',
				'#822a9d',
				'#82ca2d',
				'#222a9d',
			],
			data: [ 
				[
					{ age: 0, circumference: 104 },
					{ age: 1, circumference: 112 },
					{ age: 2, circumference: 119 },
					{ age: 3, circumference: 126 },
					{ age: 4, circumference: 134 },
					{ age: 5, circumference: 143 },
					{ age: 6, circumference: 153 },
					{ age: 7, circumference: 158 },
					{ age: 8, circumference: 162 },
					{ age: 9, circumference: 165 },
					{ age: 10, circumference: 190 },
				],	
				[
					{ age: 0, circumference: 110 },
					{ age: 1, circumference: 113 },
					{ age: 2, circumference: 120 },
					{ age: 3, circumference: 125 },
				],	
				[
					{ age: 0, circumference: 138 },
					{ age: 1, circumference: 144 },
					{ age: 2, circumference: 146 },
					{ age: 3, circumference: 153 },
				],
				[
					{ age: 0, circumference: 130 },
					{ age: 1, circumference: 158 },
					{ age: 2, circumference: 171 },
					{ age: 3, circumference: 182 },
					{ age: 4, circumference: 209 },
				],
				[
					{ age: 0, circumference: 135 },
					{ age: 1, circumference: 152 },
					{ age: 2, circumference: 163 },
					{ age: 3, circumference: 202 },
					{ age: 4, circumference: 260 },
					{ age: 5, circumference: 262 },
					{ age: 6, circumference: 279 },
					{ age: 7, circumference: 286 },
				],
				[
					{ age: 0, circumference: 172 },
					{ age: 1, circumference: 235 },
					{ age: 2, circumference: 265 },
					{ age: 3, circumference: 274 },
					{ age: 4, circumference: 335 },
					{ age: 5, circumference: 338 },
				],
			],
			
		};
	},

	componentDidMount() {
		window.addEventListener('resize', this.setWidth);
		this.setWidth();

	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.setWidth);
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.mode !== nextProps.mode) {
			setTimeout(this.setWidth, 1000);
		}
	},

	setWidth: function() {
		const element = document.getElementById('graph-wrapper');
		if (!element) { return false; }
		let width = Math.min(element.offsetWidth, 767);
		let margin = (element.offsetWidth - 767) / 2 + 20; 
		if (element && this.props.mode === 1) { 
			width = element.offsetWidth * 0.9; 
			margin = 0;
		}
		this.setState({ 
			width: width,
			margin: margin
		});	
		
	},

	sliderUpdate: function(index, value) {
		const offsets = this.state.offsets;
		offsets[index] = Math.floor(value * 10) / 10;
		this.setState({ offsets: offsets });
	},

	updateCode: function() {
		const element = document.getElementById('code-textarea');
		if (!element) { return false; }
		this.setState({ code: element.value });
	},
	render: function() {
		// Bone growth to understand size
		// These are the bones we have
		// This is our technique
		// Look at this result
		// Conclusion


		// Things that can be found: 
		// Integer offsets are silly
		// Least squares provides a more accurate overlap
		// The axes are a bit funky
		// This is suggesting exponential growth
		// Could be two graphs

		// TODO: Make review textarea not state bound - otherwise we keep re-rendering graph.
		// Store code and slider offsets on save
		// TODO: don't display on mobile

		return (
			<div id={'article-container'}>
				<h1 style={styles.header}>Assessing Growth Patterns of the Jurassic Theropod Dinosaur Allosaurus</h1>
				<h2 style={styles.header}>Abstract</h2>
				<p style={styles.p}>Allosaurus is one of the most common Mesozoic theropod dinosaurs. We present a histological analysis to assess its growth strategy and ontogenetic limbbone scaling. Based on an ontogenetic series of humeral, ulnar, femoral, and tibial sections of bone, we estimate the ages of the largest individuals in the sample to be between 13–19 years. Growth curve reconstruction suggests that maximum growth occurred at 15 years, when body mass increased 148 kg/year. Based on larger bones of Allosaurus, we estimate an upper age limit of between 22–28 years of age, which is similar to preliminary data for other large theropods. Analyses suggest that relative to the length of the femur, the lengths of the humerus, ulna, and tibia increase in length more slowly than isometry predicts. That pattern of limb scaling in Allosaurus is similar to those in other large theropods such as the tyrannosaurids. Phylogenetic optimization suggests that large theropods independently evolved reduced humeral, ulnar, andtibial lengths by a phyletic reduction in longitudinal growth relative to the femur.</p>
				<h2 style={styles.header}>Introduction</h2>
				<p style={styles.p}>
					The growth dynamics of some theropod dinosaursare well documented. Over the past decade, histo-logical studies of bones have estimated growth dy-namics for coelophysoids (Chinsamy, 1990; Padianet al., 2004), tyrannosaurids (Erickson et al., 2004;Horner and Padian, 2004), a troodontid (Varricchio,1993), extinct avians (Chinsamy et al., 1998; de Ric-qle`s et al., 2003; Turvey et al., 2005), and livingavians (Castanet et al., 2000; de Margerie et al.,2002, 2004). Those and other studies suggest thatsmall basal dinosaur taxa (e.g., Psittacosaurus, Mas-sospondylus, Scutellosaurus, and Orodromeus) grewat rates comparable to or exceeding rates in livingreptiles and marsupials (Erickson and Tumanova,2000; Erickson et al., 2001; Padian et al., 2001,2004), whereas large derived taxa (e.g., sauropods,hadrosaurids, tyrannosaurids, and ceratopsids)grew at least as rapidly as living birds and placentalmammals (Curry, 1999; Sander, 1999; Horner et al.,1999, 2000; Erickson et al., 2001; Horner and Pa-dian, 2004; Lee, 2004).Changes in size as well as in body proportionaccompany growth. For example, the femora of thelarge to gigantic tyrannosaurids lengthen more rap-idly than do the humeri, ulnae, and tibiae (Russell,1970; Currie, 2003). Such ontogenetic changes inlimb bone proportions have implications on locomo-tion: smaller and younger tyrannosaurids probablyran faster than larger and older ones (Hutchinsonand Garcia, 2002). That other large theropods showsimilar adult limb proportions as large tyrannosau-rids (Christiansen, 1999; Middleton and Gatesy,2000) suggests not only mechanical limits to locomo-tor performance at large size, but also raises thequestion of whether limb bone growth follows con-strained patterns of ontogenetic scaling in otherlarge theropods.Allosaurus is a large and common basal tetanurantheropod. Approximately 60–80% of theropod occur-rences from the Morrison Formation (Late Jurassic)are of Allosaurus (Dodson et al., 1980; Miller et al.,1996). Those occurrences are spread over a widegeographic range, including Colorado, Montana,New Mexico, Oklahoma, South Dakota, Wyoming,and Utah (Chure, 2000). One locality, the Cleveland-Lloyd Dinosaur Quarry (CLDQ) in east centralUtah, has produced over 10,000 bones that repre-sent the disarticulated remains of 44–60 individu-als of Allosaurus (Madsen, 1976). Despite poorrepresentation of extremely small and large individ-uals, the CLDQ locality preserves individuals of areasonably wide range in size. Those individualsrange in length from 3–12 m and range in height,when fully upright, from 1–4.5 m (Madsen, 1976).The availability of skeletal material at CLDQ, whichspans a broad size range and presumably ontogeny,presents an excellent opportunity to assess thegrowth dynamics of Allosaurus in the context ofother theropods.In this article we assess the growth dynamics ofAllosaurus by analyzing a histological proxy for age.Lines of arrested growth (LAGs) occur in the bonesof living poikilothermic and homeothermic tetrapodsand are known to have an annual periodicity (Mor-ris, 1970; Frylestam and Schantz, 1977; Fiala, 1978;Hemelaar and Van Gelder, 1980; Hutton, 1986; Cas-tanet et al., 1988, 1993, 2004; Tucker, 1997). Al-though that annual periodicity cannot be empiri-cally tested in the long bones of extinct tetrapods,inference by extant phylogenetic bracketing (Wit-mer, 1995) suggests that the presence of LAGs inextinct tetrapods also represents yearly intervals ofbone growth. 
					{/*Bone resorption and remodeling, how-ever, complicate age estimations. Resorption re-moves bone, and remodeling obscures the earliestLAGs. Both processes differ in extent across limbbones within an individual. Consequently, somebones will have more preserved LAGs than others,and age estimates will vary depending on the bonethat is used (Horner et al., 1999). The number ofmissing LAGs is approximated by using retrocalcu-lations, which use various models of periosteal bonegrowth rate (Chinsamy, 1993; Horner and Padian,2004). When possible, however, the reliance on ret-rocalculations should be minimized by an ontoge-netic series of bones (Horner et al., 1999). It is for-tuitous that, for Allosaurus, an ontogenetic series ofseveral limb bones is available. Here, we use bonehistology and image analysis to 1) test whether thegrowth strategy of Allosaurus is similar to similarlysized theropods (i.e., tyrannosaurids); 2) reconstructpatterns of limb bone scaling in Allosaurus; and 3)assess developmental mechanisms for evolutionarychanges in the limb length of theropods*/}
				</p>

				<h2 style={styles.header}>Methods</h2>
				<p style={styles.p}>A total of six humeri, ﬁve ulnae, six femora, and three tibiae ofAllosaurus (Marsh, 1877) was selected for histological analysis(Table 1). Those disarticulated limb bones came from the CLDQin Utah and were collected by crews from the University of Utah,Salt Lake City, UT (UUVP) (Madsen, 1976). The bones representa range of ontogenetic stages available at CLDQ from juveniles tosubadults. Our histological sample does not provide robust onto-genetic scaling relationships between bone length and circumfer-ence, so we also measured CLDQ specimens currently stored atUUVP and Dinosaur National Monument (DINO) in Vernal, UT,as well as non-CLDQ specimens at the American Museum ofNatural History (AMNH) in New York City and Brigham YoungUniversity (BYUVP) in Provo, UT (Appendix). The additionallimb bones not only increase the statistical power of our analyses,but also allow us to characterize growth of the species.Before sectioning, bone lengths and midshaft circumferenceswere measured. Because length as measured along the outercurve (Madsen, 1976) produces a measurement that is ⬃10%larger and not directly comparable with measurements of thero-pods in other studies (Table 2), we measured length of femora,humeri, and tibiae as the maximum linear distance that isroughly parallel to midshaft. To minimize variations in ulnarlength caused by individual variation in olecranon size, we mea-sured ulnar length between the proximal and distal articularsurfaces. Diaphyseal circumference was measured at 60% of theproximodistal length in the humerus and femur to avoid majorregions of muscle insertion and, in the ulna and tibia, circumfer-ence was measured at 50% of the length. Positions for measuringcircumference also helped to standardize positions for transversesectioning in each ontogenetic series. Transverse sections wereproduced by standard hard tissue histological techniques (Wilson,1994; Lamm, 1998). Photography of entire sections, which arequite large, under the high magniﬁcation of a microscope is space-and time-prohibitive. Instead, all 20 sections were backlit by a ﬁberoptic lightbox (Fostec, Auburn, NY) and imaged by digitalmacrophotography (DXC-330, Sony; D70, Nikon; 60 mm Micro-Nikkor, Nikon). Images of each section were digitally capturedwith some overlap and were reassembled in PhotoShop (Adobe,San Jose, CA). Periosteal borders, endosteal borders, and LAGswere digitally traced in Illustrator (Adobe) and exported for im-age analysis</p>

				<h2 style={styles.header}>Estimation of Age and Growth Curve</h2>
				<p style={styles.p}>Periosteal and LAG circumferences were measured by the pe-rimeter function in NIH ImageJ (NIH, Bethesda, MD). We preferto measure circumference because 1) estimates of circumferencebased on diameters are underestimates when sections are irreg-ular in shape; 2) circumference is used to predict body mass(Anderson et al., 1985); and 3) circumference is easily comparableacross sections of a given bone series. In Excel (Microsoft, Red-mond, WA), LAG circumferences were visually aligned acrosseach bone series and the circumferences of missing LAGs wereretrocalculated using a signiﬁcant power relationship. Thatpower relationship predicts rapid growth early in ontogeny fol-lowed by slower growth during late ontogeny. Although somevaranids can show rapid growth either during early or late on-togeny (de Buffre´nil and Castanet, 2000), all assessed dinosaurtaxa show higher periosteal growth rates earlier rather than laterin ontogeny (Chinsamy, 1993; Curry, 1999; Horner et al., 1999,2000; Erickson and Tumanova, 2000; Padian et al., 2004; Erick-son et al., 2004; Horner and Padian, 2004). Age estimates arepresented in Table 1.Estimates of body mass were calculated using both an inter-speciﬁc (Anderson et al., 1985) and a developmental (Develop-mental Mass Extrapolation sensu Erickson and Tumanova, 2000;Erickson et al., 2004) relationship between body mass and femo-ral circumference. Because our femoral specimens span only theearlier half of ontogeny, we also estimated body mass using tibial,humeral, and ulnar circumferences. A relationship between bodymass and age was determined by a nonconstrained three-parameter logistic regression (Zullinger et al., 1984) in SPSS(Chicago, IL), which uses an iterative least-squares criterion.Differences in growth curve parameters (i.e., asymptotic mass,growth rate constant, and inﬂection point) among Allosaurus andtyrannosaurids (Erickson et al., 2004) were considered signiﬁcantif the 95% conﬁdence intervals (CIs) of those parameters did notoverlap. Maximum growth rate was calculated by ﬁnding thederivative of each regression equation at the inﬂection point.</p>

				<h2 style={styles.header}>Results</h2>
				<div style={{ display: 'table', width: '100%' }}>
					<div style={styles.resultLeft(this.props.mode)} id={'graph-wrapper'}>
						<h6 style={{ textAlign: 'center' }}>Age vs Femur Circumference</h6>
							<ScatterChart width={this.state.width} height={this.state.width / 1.5} margin={{ top: 20, left: this.state.margin, right: 35, bottom: 20 }}>
								<XAxis dataKey={'circumference'} name='circumference' unit='mm' label={'mm'} domain={['dataMin - 4', 'dataMax + 10']} />
								<YAxis dataKey={'age'} name='Age' unit='years' label={'Years'} domain={['dataMin', 'dataMax + 1']} />
								<CartesianGrid />
								{/*<Tooltip cursor={{strokeDasharray: '3 3'}}/>*/}
								<Legend />
								{this.state.data.map((data, index)=> {
									const outputData = data.map((value)=> {
										let offsets = this.state.offsets;
										if (this.props.mode === 2) {
											try {
												offsets = eval(this.state.code);
											} catch (err) {
												console.log(err);
											}
										}
										return {
											age: value.age + offsets[index],
											circumference: value.circumference
										};
									});
									return <Scatter key={`plot-${index}`} name={`Femur ${index + 1}`} data={outputData} fill={this.state.colors[index]} line={{ strokeWidth: 3 }} />;
								})}
							</ScatterChart>
					</div>

					<div style={styles.resultRight(this.props.mode)}>
						{this.props.mode === 1 &&
							<div style={{ maxWidth: '400px', margin: '0 auto' }}>
								<div style={{ display: 'table', width: '100%', }}>
									{this.state.offsets.map((item, index)=> {
										return (
											<tr key={`slider-${index}`} style={{ paddingBottom: '1em' }}>
												<td style={{ width: '1%', whiteSpace: 'nowrap', verticalAlign: 'top', paddingRight: '1em' }}>Femur {index + 1} offset:</td>
												<td>
													<Slider min={0} max={20} stepSize={0.1} labelStepSize={5} value={item} onChange={this.sliderUpdate.bind(this, index)} />	
												</td>
												
											</tr>
										);
									})}
								</div>
							</div>
						}
						
					</div>
				</div>
				{this.props.mode === 2 &&
					<div style={{ maxWidth: '700px', margin: '0 auto' }}>
						<Textarea defaultValue={this.state.code} style={styles.codeInput(this.state.width / 1.5)} id={'code-textarea'}/>
						<Button onClick={this.updateCode} text={'Run Code'} />
					</div>

				}
				

				


				<h2 style={styles.header}>Conclusions</h2>
				<p style={styles.p}>Previous studies of the long bone histology of largedinosaurs report ﬁbrolamellar bony tissue (Reid,1996; Curry, 1999; Horner et al., 1999, 2000; Hornerand Padian, 2004). Our histological data from sec-tions of Allosaurus humeri, ulnae, femora, andtibiae are consistent with previous observations.Furthermore, as in large hadrosaurids and Tyran-nosaurus rex (Horner et al., 1999, 2000; Horner andPadian, 2004), vascular organization in Allosaurusvaries across a section, among different bones, andthrough ontogeny. In summary, vascular canals inhumeri, femora, and tibiae throughout ontogeny arepredominantly circumferentially oriented, whereasthose in ulnae are predominantly longitudinally ori-ented (Fig. 1). Secondary remodeling of ﬁbrolamellartissue also occurs in all sections but is particularlywidespread in the sections of humeri and ulnae. Incontrast, remodeling is localized to the anterior cor-tex in the femur and the lateral cortex in the tibia.Remodeling, which interrupts or removes ontogenet-ically older LAGs, is most extensive in the internalcortex.LAGs occur in the cortex of all the bone sections ofAllosaurus (Table 1). Although there is individualvariation, circumferences of LAGs for each bone se-ries generally overlap (Fig. 2). Estimates of age forour specimens range from 13–19 years. None of thesections, even the larger ones, have an external fun-damental system (EFS) (Fig. 1). On the contrary, theoutermost cortical bone remains highly vascular-ized, and only in the ulna does the spacing betweensuccessive LAGs decrease during ontogeny. All sec-tions appear to represent individuals that were stillactively growing before death.</p>
				<p style={styles.p}>The growth dynamics of Allosaurus are similar tothose in equally large theropods. Similarities ingrowth strategy suggest that the evolution of gigan-tism in those respective lineages might involve sim-ilar increases in maximum growth rate. Further-more, similarities in the ontogenetic scaling of limbbones and phylogenetic optimization suggest thatlarge theropods independently evolved reduced hu-meral, ulnar, and tibial lengths by a phyletic reduc-tion in longitudinal growth relative to the femur.We cannot directly reject or support the hypothe-sis of indeterminate growth in Allosaurus. There is,however, independent evidence to suggest thatgrowth was determinate. A large ﬁbula of Allosau-rus shows an incipient external fundamental system(Bybee, 1997), as do bones from closely relatedtheropods and other dinosaurs (Chinsamy, 1990;Varricchio, 1993; Horner et al., 1999, 2000; Ericksonet al., 2004; Horner and Padian, 2004).</p>


			</div>
		);
	}

});


export default Radium(ExperimentsDinosaurPaper);

styles = {
	header: {
		maxWidth: '650px',
		margin: '1em auto 0.5em',
	},
	p: {
		maxWidth: '650px',
		margin: '0em auto 1em',
		lineHeight: '1.6',
		fontSize: '16px',
		fontFamily: 'Merriweather, serif'
	},
	codeInput: function(height) {
		return {
			width: '100%',
			minHeight: '300px',
			maxHeight: 400 || height,
			maxWidth: '700px',
			margin: '0 auto',
			backgroundColor: '#272822',
			color: '#ddd',
			resize: 'none',
			fontFamily: 'Courier',
			padding: '0.5em',
			whiteSpace: 'nowrap',
		};
	},
	resultLeft: function(mode) {
		let width = '100%';
		const element = document.getElementById('article-container');
		if (element && mode === 1) { width = element.offsetWidth * 0.6; }

		return {
			// backgroundColor: 'green',
			display: 'table-cell',
			verticalAlign: 'middle',
			width: width,
		};
	},
	resultRight: function(mode) {
		let width = '0';
		const element = document.getElementById('article-container');
		if (element && mode === 1) { width = element.offsetWidth * 0.4; }

		return {
			// backgroundColor: 'red',
			display: mode === 0 ? 'hidden' : 'table-cell',
			verticalAlign: 'middle',
			width: width,
		};
	},
};
