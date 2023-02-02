import * as models from '../../server/models';

const { facetModels, ...restModels } = models;

export const modelDefinitions = { ...facetModels, ...restModels };
