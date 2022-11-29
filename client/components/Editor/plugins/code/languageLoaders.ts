// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { StreamLanguage } from '@codemirror/language';

import { LanguageLoaders } from './types';

const languageLoaders: LanguageLoaders = {
	cpp: () => import('@codemirror/lang-cpp').then((i) => i.cpp()),
	css: () => import('@codemirror/lang-css').then((i) => i.css()),
	html: () => import('@codemirror/lang-html').then((i) => i.html()),
	php: () => import('@codemirror/lang-php').then((i) => i.php()),
	sql: () => import('@codemirror/lang-sql').then((i) => i.sql()),
	xml: () => import('@codemirror/lang-xml').then((i) => i.xml()),
	javascript: () => import('@codemirror/lang-javascript').then((i) => i.javascript()),
	java: () => import('@codemirror/lang-java').then((i) => i.java()),
	json: () => import('@codemirror/lang-json').then((i) => i.json()),
	lezer: () => import('@codemirror/lang-lezer').then((i) => i.lezer()),
	markdown: () => import('@codemirror/lang-markdown').then((i) => i.markdown()),
	python: () => import('@codemirror/lang-python').then((i) => i.python()),
	rust: () => import('@codemirror/lang-rust').then((i) => i.rust()),
	wast: () => import('@codemirror/lang-wast').then((i) => i.wast()),
};

export const legacyLanguageLoaders: LanguageLoaders = {
	apl: () =>
		import('@codemirror/legacy-modes/mode/apl').then(({ apl }) => StreamLanguage.define(apl)),
	asciiarmor: () =>
		import('@codemirror/legacy-modes/mode/asciiarmor').then(({ asciiArmor }) =>
			StreamLanguage.define(asciiArmor),
		),
	asn1: () =>
		import('@codemirror/legacy-modes/mode/asn1').then(({ asn1 }) =>
			StreamLanguage.define(asn1),
		),
	asterisk: () =>
		import('@codemirror/legacy-modes/mode/asterisk').then(({ asterisk }) =>
			StreamLanguage.define(asterisk),
		),
	brainfuck: () =>
		import('@codemirror/legacy-modes/mode/brainfuck').then(({ brainfuck }) =>
			StreamLanguage.define(brainfuck),
		),
	clike: () =>
		import('@codemirror/legacy-modes/mode/clike').then(({ clike }) =>
			StreamLanguage.define(clike),
		),
	clojure: () =>
		import('@codemirror/legacy-modes/mode/clojure').then(({ clojure }) =>
			StreamLanguage.define(clojure),
		),
	cmake: () =>
		import('@codemirror/legacy-modes/mode/cmake').then(({ cmake }) =>
			StreamLanguage.define(cmake),
		),
	cobol: () =>
		import('@codemirror/legacy-modes/mode/cobol').then(({ cobol }) =>
			StreamLanguage.define(cobol),
		),
	coffeescript: () =>
		import('@codemirror/legacy-modes/mode/coffeescript').then(({ coffeeScript }) =>
			StreamLanguage.define(coffeeScript),
		),
	commonlisp: () =>
		import('@codemirror/legacy-modes/mode/commonlisp').then(({ commonLisp }) =>
			StreamLanguage.define(commonLisp),
		),
	crystal: () =>
		import('@codemirror/legacy-modes/mode/crystal').then(({ crystal }) =>
			StreamLanguage.define(crystal),
		),
	cypher: () =>
		import('@codemirror/legacy-modes/mode/cypher').then(({ cypher }) =>
			StreamLanguage.define(cypher),
		),
	d: () => import('@codemirror/legacy-modes/mode/d').then(({ d }) => StreamLanguage.define(d)),
	diff: () =>
		import('@codemirror/legacy-modes/mode/diff').then(({ diff }) =>
			StreamLanguage.define(diff),
		),
	dockerfile: () =>
		import('@codemirror/legacy-modes/mode/dockerfile').then(({ dockerFile }) =>
			StreamLanguage.define(dockerFile),
		),
	dtd: () =>
		import('@codemirror/legacy-modes/mode/dtd').then(({ dtd }) => StreamLanguage.define(dtd)),
	dylan: () =>
		import('@codemirror/legacy-modes/mode/dylan').then(({ dylan }) =>
			StreamLanguage.define(dylan),
		),
	ebnf: () =>
		import('@codemirror/legacy-modes/mode/ebnf').then(({ ebnf }) =>
			StreamLanguage.define(ebnf),
		),
	ecl: () =>
		import('@codemirror/legacy-modes/mode/ecl').then(({ ecl }) => StreamLanguage.define(ecl)),
	eiffel: () =>
		import('@codemirror/legacy-modes/mode/eiffel').then(({ eiffel }) =>
			StreamLanguage.define(eiffel),
		),
	elm: () =>
		import('@codemirror/legacy-modes/mode/elm').then(({ elm }) => StreamLanguage.define(elm)),
	erlang: () =>
		import('@codemirror/legacy-modes/mode/erlang').then(({ erlang }) =>
			StreamLanguage.define(erlang),
		),
	factor: () =>
		import('@codemirror/legacy-modes/mode/factor').then(({ factor }) =>
			StreamLanguage.define(factor),
		),
	fcl: () =>
		import('@codemirror/legacy-modes/mode/fcl').then(({ fcl }) => StreamLanguage.define(fcl)),
	forth: () =>
		import('@codemirror/legacy-modes/mode/forth').then(({ forth }) =>
			StreamLanguage.define(forth),
		),
	fortran: () =>
		import('@codemirror/legacy-modes/mode/fortran').then(({ fortran }) =>
			StreamLanguage.define(fortran),
		),
	gas: () =>
		import('@codemirror/legacy-modes/mode/gas').then(({ gas }) => StreamLanguage.define(gas)),
	gherkin: () =>
		import('@codemirror/legacy-modes/mode/gherkin').then(({ gherkin }) =>
			StreamLanguage.define(gherkin),
		),
	go: () =>
		import('@codemirror/legacy-modes/mode/go').then(({ go }) => StreamLanguage.define(go)),
	groovy: () =>
		import('@codemirror/legacy-modes/mode/groovy').then(({ groovy }) =>
			StreamLanguage.define(groovy),
		),
	haskell: () =>
		import('@codemirror/legacy-modes/mode/haskell').then(({ haskell }) =>
			StreamLanguage.define(haskell),
		),
	haxe: () =>
		import('@codemirror/legacy-modes/mode/haxe').then(({ haxe }) =>
			StreamLanguage.define(haxe),
		),
	http: () =>
		import('@codemirror/legacy-modes/mode/http').then(({ http }) =>
			StreamLanguage.define(http),
		),
	idl: () =>
		import('@codemirror/legacy-modes/mode/idl').then(({ idl }) => StreamLanguage.define(idl)),
	jinja2: () =>
		import('@codemirror/legacy-modes/mode/jinja2').then(({ jinja2 }) =>
			StreamLanguage.define(jinja2),
		),
	julia: () =>
		import('@codemirror/legacy-modes/mode/julia').then(({ julia }) =>
			StreamLanguage.define(julia),
		),
	livescript: () =>
		import('@codemirror/legacy-modes/mode/livescript').then(({ liveScript }) =>
			StreamLanguage.define(liveScript),
		),
	lua: () =>
		import('@codemirror/legacy-modes/mode/lua').then(({ lua: legacyLua }) =>
			StreamLanguage.define(legacyLua),
		),
	mathematica: () =>
		import('@codemirror/legacy-modes/mode/mathematica').then(({ mathematica }) =>
			StreamLanguage.define(mathematica),
		),
	mbox: () =>
		import('@codemirror/legacy-modes/mode/mbox').then(({ mbox }) =>
			StreamLanguage.define(mbox),
		),
	mirc: () =>
		import('@codemirror/legacy-modes/mode/mirc').then(({ mirc }) =>
			StreamLanguage.define(mirc),
		),
	mllike: () =>
		import('@codemirror/legacy-modes/mode/mllike').then(({ oCaml }) =>
			StreamLanguage.define(oCaml),
		),
	modelica: () =>
		import('@codemirror/legacy-modes/mode/modelica').then(({ modelica }) =>
			StreamLanguage.define(modelica),
		),
	mscgen: () =>
		import('@codemirror/legacy-modes/mode/mscgen').then(({ mscgen }) =>
			StreamLanguage.define(mscgen),
		),
	mumps: () =>
		import('@codemirror/legacy-modes/mode/mumps').then(({ mumps }) =>
			StreamLanguage.define(mumps),
		),
	nginx: () =>
		import('@codemirror/legacy-modes/mode/nginx').then(({ nginx }) =>
			StreamLanguage.define(nginx),
		),
	nsis: () =>
		import('@codemirror/legacy-modes/mode/nsis').then(({ nsis }) =>
			StreamLanguage.define(nsis),
		),
	ntriples: () =>
		import('@codemirror/legacy-modes/mode/ntriples').then(({ ntriples }) =>
			StreamLanguage.define(ntriples),
		),
	octave: () =>
		import('@codemirror/legacy-modes/mode/octave').then(({ octave }) =>
			StreamLanguage.define(octave),
		),
	oz: () =>
		import('@codemirror/legacy-modes/mode/oz').then(({ oz }) => StreamLanguage.define(oz)),
	pascal: () =>
		import('@codemirror/legacy-modes/mode/pascal').then(({ pascal }) =>
			StreamLanguage.define(pascal),
		),
	perl: () =>
		import('@codemirror/legacy-modes/mode/perl').then(({ perl }) =>
			StreamLanguage.define(perl),
		),
	pig: () =>
		import('@codemirror/legacy-modes/mode/pig').then(({ pig }) => StreamLanguage.define(pig)),
	powershell: () =>
		import('@codemirror/legacy-modes/mode/powershell').then(({ powerShell }) =>
			StreamLanguage.define(powerShell),
		),
	properties: () =>
		import('@codemirror/legacy-modes/mode/properties').then(({ properties }) =>
			StreamLanguage.define(properties),
		),
	protobuf: () =>
		import('@codemirror/legacy-modes/mode/protobuf').then(({ protobuf }) =>
			StreamLanguage.define(protobuf),
		),
	puppet: () =>
		import('@codemirror/legacy-modes/mode/puppet').then(({ puppet }) =>
			StreamLanguage.define(puppet),
		),
	q: () => import('@codemirror/legacy-modes/mode/q').then(({ q }) => StreamLanguage.define(q)),
	r: () => import('@codemirror/legacy-modes/mode/r').then(({ r }) => StreamLanguage.define(r)),
	rpm: () =>
		import('@codemirror/legacy-modes/mode/rpm').then(({ rpmSpec }) =>
			StreamLanguage.define(rpmSpec),
		),
	ruby: () =>
		import('@codemirror/legacy-modes/mode/ruby').then(({ ruby }) =>
			StreamLanguage.define(ruby),
		),
	sas: () =>
		import('@codemirror/legacy-modes/mode/sas').then(({ sas }) => StreamLanguage.define(sas)),
	scheme: () =>
		import('@codemirror/legacy-modes/mode/scheme').then(({ scheme }) =>
			StreamLanguage.define(scheme),
		),
	shell: () =>
		import('@codemirror/legacy-modes/mode/shell').then(({ shell }) =>
			StreamLanguage.define(shell),
		),
	smalltalk: () =>
		import('@codemirror/legacy-modes/mode/smalltalk').then(({ smalltalk }) =>
			StreamLanguage.define(smalltalk),
		),
	solr: () =>
		import('@codemirror/legacy-modes/mode/solr').then(({ solr }) =>
			StreamLanguage.define(solr),
		),
	sparql: () =>
		import('@codemirror/legacy-modes/mode/sparql').then(({ sparql }) =>
			StreamLanguage.define(sparql),
		),
	spreadsheet: () =>
		import('@codemirror/legacy-modes/mode/spreadsheet').then(({ spreadsheet }) =>
			StreamLanguage.define(spreadsheet),
		),
	stex: () =>
		import('@codemirror/legacy-modes/mode/stex').then(({ stex }) =>
			StreamLanguage.define(stex),
		),
	stylus: () =>
		import('@codemirror/legacy-modes/mode/stylus').then(({ stylus }) =>
			StreamLanguage.define(stylus),
		),
	swift: () =>
		import('@codemirror/legacy-modes/mode/swift').then(({ swift }) =>
			StreamLanguage.define(swift),
		),
	tcl: () =>
		import('@codemirror/legacy-modes/mode/tcl').then(({ tcl }) => StreamLanguage.define(tcl)),
	textile: () =>
		import('@codemirror/legacy-modes/mode/textile').then(({ textile }) =>
			StreamLanguage.define(textile),
		),
	tiddlywiki: () =>
		import('@codemirror/legacy-modes/mode/tiddlywiki').then(({ tiddlyWiki }) =>
			StreamLanguage.define(tiddlyWiki),
		),
	tiki: () =>
		import('@codemirror/legacy-modes/mode/tiki').then(({ tiki }) =>
			StreamLanguage.define(tiki),
		),
	toml: () =>
		import('@codemirror/legacy-modes/mode/toml').then(({ toml }) =>
			StreamLanguage.define(toml),
		),
	troff: () =>
		import('@codemirror/legacy-modes/mode/troff').then(({ troff }) =>
			StreamLanguage.define(troff),
		),
	ttcn: () =>
		import('@codemirror/legacy-modes/mode/ttcn').then(({ ttcn }) =>
			StreamLanguage.define(ttcn),
		),
	turtle: () =>
		import('@codemirror/legacy-modes/mode/turtle').then(({ turtle }) =>
			StreamLanguage.define(turtle),
		),
	vb: () =>
		import('@codemirror/legacy-modes/mode/vb').then(({ vb }) => StreamLanguage.define(vb)),
	vbscript: () =>
		import('@codemirror/legacy-modes/mode/vbscript').then(({ vbScript }) =>
			StreamLanguage.define(vbScript),
		),
	velocity: () =>
		import('@codemirror/legacy-modes/mode/velocity').then(({ velocity }) =>
			StreamLanguage.define(velocity),
		),
	verilog: () =>
		import('@codemirror/legacy-modes/mode/verilog').then(({ verilog }) =>
			StreamLanguage.define(verilog),
		),
	vhdl: () =>
		import('@codemirror/legacy-modes/mode/vhdl').then(({ vhdl }) =>
			StreamLanguage.define(vhdl),
		),
	webidl: () =>
		import('@codemirror/legacy-modes/mode/webidl').then(({ webIDL }) =>
			StreamLanguage.define(webIDL),
		),
	xquery: () =>
		import('@codemirror/legacy-modes/mode/xquery').then(({ xQuery }) =>
			StreamLanguage.define(xQuery),
		),
	yacas: () =>
		import('@codemirror/legacy-modes/mode/yacas').then(({ yacas }) =>
			StreamLanguage.define(yacas),
		),
	yaml: () =>
		import('@codemirror/legacy-modes/mode/yaml').then(({ yaml }) =>
			StreamLanguage.define(yaml),
		),
	z80: () =>
		import('@codemirror/legacy-modes/mode/z80').then(({ z80 }) => StreamLanguage.define(z80)),
};

export default languageLoaders;
