import {
	Project,
	Node,
	ObjectLiteralExpression,
	PropertyAssignment,
	JSDoc,
	PropertyDeclaration,
	ts,
	SyntaxKind,
} from 'ts-morph';
import { execSync } from 'child_process';
import { argv } from 'process';

function updateJSDocComments(dir: string) {
	const project = new Project({
		tsConfigFilePath: 'tsconfig.json',
	});

	const sourceFiles = project.getSourceFiles(`${dir.replace(/\/$/, '')}/*.ts`);

	sourceFiles.forEach((sourceFile) => {
		let paths: string[] = [];

		sourceFile.forEachDescendant((node, traversal) => {
			if (!ts.isObjectLiteralExpression(node.compilerNode)) {
				return;
			}
			const objL = node.asKind(SyntaxKind.ObjectLiteralExpression)!;

			const properties = objL.getProperties();

			properties.forEach((prop, idx) => {
				if (prop.getKind() !== SyntaxKind.PropertyAssignment) {
					return;
				}
				const propertyAssignment = prop.asKind(SyntaxKind.PropertyAssignment)!;
				const initializer = propertyAssignment.getInitializerIfKind(
					SyntaxKind.ObjectLiteralExpression,
				)!;
				const name = propertyAssignment.getName();
				if (paths.includes(name)) {
					return;
				}

				if (!initializer || !initializer.getProperty('path')) {
					return;
				}
				const newJsDocComment = template(initializer);

				const ogText = propertyAssignment.getText();
				// Determine position for inserting the new JSDoc comment

				const newThing = propertyAssignment.replaceWithText(
					`${newJsDocComment}\n${ogText}`,
				);
				// Insert the new JSDoc comment
				// sourceFile.insertText(startPos, newJsDocComment);
				// paths.push(name);

				// traversal.stop();
			});
		});
		sourceFile.saveSync();
	});

	execSync(`npx prettier ${dir} -w`);
}

const ifLine = (arg: string | undefined | boolean, template = arg, noNewline = false) =>
	arg ? ` * ${template}${noNewline ? '' : '\n *'}` : '';

const getText = (initializer: ObjectLiteralExpression | undefined, prop: string) => {
	const thing = initializer?.getProperty(prop)?.getChildAtIndex(2);

	if (
		!thing?.isKind(SyntaxKind.NoSubstitutionTemplateLiteral) &&
		!thing?.isKind(SyntaxKind.StringLiteral)
	) {
		return;
	}

	return thing.compilerNode.text?.replace(/\t/g, '').replace(/\n/g, '\n * ');
};

function template(initializer: ObjectLiteralExpression) {
	const [summary, description, path, method] = ['summary', 'description', 'path', 'method'].map(
		(prop) => getText(initializer, prop),
	);

	const metadataRaw = initializer
		.getProperty('metadata')
		?.getChildAtIndex(2)
		?.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression);

	const metadata = metadataRaw?.[0];

	const [loggedIn, example, since] = ['loggedIn', 'example', 'since'].map((prop) =>
		getText(metadata, prop),
	);

	const result = [
		`/**`,
		` * \`${method} ${path}\``,
		` *`,
		ifLine(description),
		ifLine(example, `@example\n * ${example}`),
		ifLine(since),
		ifLine(
			loggedIn !== 'false',
			`@access ${
				loggedIn === 'admin'
					? 'You need to be an **admin** of this community in order to access this resource.'
					: 'You need to be **logged in** and have access to this resource.'
			}`,
		),
		` * @routeDocumentation
* {@link https://pubpub.org/apiDocs#/paths/${path
			?.replace(/^\//, '')
			.replace(/\//g, '-')
			.replace(/:(\w+)-/g, '$1-')
			.replace(/:(\w+)/g, '$1')}/${method?.toLowerCase()}}`,
		' */',
	]
		.filter(Boolean)
		.join('\n');

	return result;
}

// Usage Example
updateJSDocComments(argv[2]);
