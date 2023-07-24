import { Page as PageModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type Page = RecursiveAttributes<PageModel>;
