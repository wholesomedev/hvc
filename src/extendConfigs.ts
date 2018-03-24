import * as _ from 'lodash';
import {
  isArrayOfObjects,
  isArrayOfUnmergeables,
  isUnmergeable,
} from './utils';
import { extendArraysOfObjects } from './extendArraysOfObjects';

export function extendConfigs(destination: any, source: any) {
  const configs = [destination, source];

  if (_.every(configs, isUnmergeable)) {
    return source;
  }

  if (_.every(configs, isArrayOfUnmergeables)) {
    return _.uniq([...destination, ...source]);
  }

  if (_.every(configs, isArrayOfObjects)) {
    return extendArraysOfObjects(destination, source, extendConfigs);
  }

  if (_.every(configs, _.isPlainObject)) {
    return _.mapValues({ ...destination, ...source }, (val, key) => {
      if (destination[key] === undefined) {
        return source[key];
      }

      if (source[key] === undefined) {
        return destination[key];
      }

      return extendConfigs(destination[key], source[key]);
    });
  }

  /* If we don't explicitly handle the case in one of the branches above, just
  return the source as the value of the merge. */
  return source;
}
