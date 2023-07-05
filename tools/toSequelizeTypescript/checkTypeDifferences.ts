import * as ts from 'typescript';

const sourceCode = `
  type Obj = { children: string[] }
  type Children = Obj['children']
`;

// Create a program

const compilerHost: ts.CompilerHost = {
	fileExists: () => true,
	getCanonicalFileName: (fileName) => fileName,
	getCurrentDirectory: () => '',
	getDefaultLibFileName: () => 'lib.d.ts',
	getDirectories: (path) => [],
	getNewLine: () => '\n',
	getSourceFile: (fileName) => (fileName.indexOf('dummy.ts') === -1 ? undefined : sourceFile),
	readFile: () => undefined,
	useCaseSensitiveFileNames: () => true,
	writeFile: () => {},
};

const program = ts.createProgram(['example.ts'], {
	emitDeclarationOnly: true,
});

const sourceFile = program.getSourceFile('example.ts', sourceCode, ts.ScriptTarget.Latest, true);
const checker = program.getTypeChecker();

sourceFile.forEachChild((node) => {
	if (ts.isTypeAliasDeclaration(node)) {
		const symbol = checker.getSymbolAtLocation(node.name);
		if (symbol) {
			console.log(symbol);
			const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
			console.log(`type ${symbol.name} = ${checker.typeToString(type)}`);
		}
	}
});
