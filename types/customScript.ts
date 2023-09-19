import { SerializedModel } from './serializedModel';
import { CustomScript as CustomScriptModel } from 'server/models';

export type CustomScriptType = 'css' | 'js';
export type CustomScripts = { [type in CustomScriptType]: null | string };
export type CustomScript = SerializedModel<CustomScriptModel>;
