import OrderedMap from './collection/ordered-map';
import ParentBlot from './blot/parent/parent';
import { inherit } from './util';


var attributes = {};
var tags = {};
var types = new OrderedMap<any>();  // We would specify a class definition if we could


export enum Scope {
  CONTAINER = 4,
  BLOCK = 3,
  INLINE = 2,
  LEAF = 1
};

export function compare(typeName1: string, typeName2: string): number {
  var type1 = types.get(typeName1);
  var type2 = types.get(typeName2);
  if (type1.scope !== type2.scope) {
    return type1.scope - type2.scope;
  } else {
    return types.indexOf(typeName1) - types.indexOf(typeName2);
  }
};

export function create(name: string, value?:any) {
  var BlotClass = types.get(name);
  if (BlotClass == null) {
    throw new Error(`Unable to create ${name}`);
  }
  return new BlotClass(value, BlotClass);
};

export function define(BlotClass, SuperClass = types.get('parent')) {
  if (typeof BlotClass === 'object') {
    BlotClass = inherit(BlotClass, SuperClass);
  }
  // TODO warn of tag/type overwrite
  types.set(BlotClass.nodeName, BlotClass);
  if (typeof BlotClass.tagName === 'string') {
    tags[BlotClass.tagName.toUpperCase()] = BlotClass;
  }
  return BlotClass;
};

export function match(input) {
  if (typeof input === 'string') {
    return types.get(input);
  } else if (input instanceof HTMLElement) {
    return tags[node.tagName];
  } else if (input instanceof Text) {
    return types.get('text');
  } else {
    return null;
  }
};
