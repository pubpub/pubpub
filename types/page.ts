import { Page as PageModel } from 'server/models';
import { SerializedModel } from './recursiveAttributes';

export type Page = SerializedModel<PageModel>;
