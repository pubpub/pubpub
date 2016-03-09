import {expect} from 'chai';

function mapUrl(availableActions = {}, url = []) {
  const notFound = {action: null, params: []};

  // test for empty input
  if (url.length === 0 || Object.keys(availableActions).length === 0) {
    return notFound;
  }
  /*eslint-disable */
  const reducer = (prev, current) => {
    if (prev.action && prev.action[current]) {
      return {action: prev.action[current], params: []}; // go deeper
    } else {
      if (typeof prev.action === 'function') {
        return {action: prev.action, params: prev.params.concat(current)}; // params are found
      } else {
        return notFound;
      }
    }
  };
  /*eslint-enable */

  const actionAndParams = url.reduce(reducer, {action: availableActions, params: []});

  return (typeof actionAndParams.action === 'function') ? actionAndParams : notFound;
}

describe('API', () => {
  describe('mapUrl', () => {
    it('extracts nothing if both params are undefined', () => {
      expect(mapUrl(undefined, undefined)).to.deep.equal({
        action: null,
        params: []
      });
    });

    it('extracts nothing if the url is empty', () => {
      const url = '';
      const splittedUrlPath = url.split('?')[0].split('/').slice(1);
      const availableActions = {a: 1, widget: {c: 1, load: () => 'baz'}};

      expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
        action: null,
        params: []
      });
    });

    it('extracts nothing if nothing was found', () => {
      const url = '/widget/load/?foo=bar';
      const splittedUrlPath = url.split('?')[0].split('/').slice(1);
      const availableActions = {a: 1, info: {c: 1, load: () => 'baz'}};

      expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
        action: null,
        params: []
      });
    });

    it('extracts the available actions and the params from an relative url string with GET params', () => {
      const url = '/widget/load/param1/xzy?foo=bar';
      const splittedUrlPath = url.split('?')[0].split('/').slice(1);
      const availableActions = {a: 1, widget: {c: 1, load: () => 'baz'}};

      expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
        action: availableActions.widget.load,
        params: ['param1', 'xzy']
      });
    });

    it('extracts the available actions from an url string without GET params', () => {
      const url = '/widget/load/?foo=bar';
      const splittedUrlPath = url.split('?')[0].split('/').slice(1);
      const availableActions = {a: 1, widget: {c: 1, load: () => 'baz'}};

      expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
        action: availableActions.widget.load,
        params: ['']
      });
    });

    it('does not find the avaialble action if deeper nesting is required', () => {
      const url = '/widget';
      const splittedUrlPath = url.split('?')[0].split('/').slice(1);
      const availableActions = {a: 1, widget: {c: 1, load: () => 'baz'}};

      expect(mapUrl(availableActions, splittedUrlPath)).to.deep.equal({
        action: null,
        params: []
      });
    });
  });
});