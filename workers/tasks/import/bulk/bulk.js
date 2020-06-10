import fs from 'fs-extra';
import path from 'path';
import YAML from 'yaml';

import { User } from 'server/models';

import { BulkImportError } from './errors';
import { directiveFileSuffix } from './config';
import { resolvePubDirective } from './directives';

const getDirectiveFilePriority = (fileName) => {
	if (fileName.startsWith('community')) {
		return 0;
	}
	if (fileName.startsWith('collection')) {
		return 1;
	}
	if (fileName.startsWith('pub')) {
		return 2;
	}
	return 3;
};

const findUserForSlug = async (slug) => {
	const user = await User.findOne({ where: { slug: slug } });
	if (!user) {
		throw new BulkImportError({}, `Could not find user by slug ${slug}`);
	}
};

const applyDirective = async (path, directive, context) => {
    const target = await createTargetForPath(path);
    if (directive.type === "pub") {
        await resolvePubDirective(directive, target, context);
    } else if (directive.type === "collection") {
    
    }
}

const applyDirectives = async (path, directives, context) => {
    const applicableDirectives = directives.filter(doesPathMatchDirective);
    await Promise.all(applicableDirectives.map(directive => applyDirectives(directive,  context))
};

const extractDirectives = (matchingPath, directive) => {
	const directives = [{ ...directive, path: matchingPath }];
	if (directive.files) {
		Object.entries(directive.files).forEach(([matchingSubPath, subdirective]) => {
			directives.push(
				...extractDirectives(`${matchingPath}/${matchingSubPath}`, subdirective),
			);
		});
	}
	return directives;
};

export const runBulkImportFromDirectory = async (root, args) => {
	const actor = await findUserForSlug(args.actorSlug);

	const visitDirectory = async (directory, context) => {
		const listing = await fs.readdir(directory);
		const directives = [...context.directives];
		const directiveFilesHere = listing
			.filter((fileName) => fileName.endsWith(directiveFileSuffix))
            .sort((a, b) => getDirectiveFilePriority(a) - getDirectiveFilePriority(b));
            
		await directiveFilesHere.map(async (fileName) => {
			const directivePath = path.join(directory, fileName);
			const contents = await fs.readFile(directivePath);
			const directive = YAML.parse(contents.toString());
			directives.push(...extractDirectives(directory, directive));
        });

        let childrenResolved = false;
        const resolveChildren = async () => {
            if (childrenResolved) {
                console.trace("Warning: already visited children");
            }
            childrenResolved = true;
            await listing.filter(entry => !directiveFilesHere.includes(entry)).map(entry => {
                const fullPath = path.join(directory, entry);
                const isDirectory = (await fs.lstat(fullPath)).isDirectory();
                if (isDirectory) {
                    visitDirectory(fullPath, context);
                }
            }
        }
        
		await applyDirectives(directory, directives, context);
	};
};
