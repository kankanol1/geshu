// this file keeps all the information which is related to specific release versions.

const registry = {
  menuData: undefined,
  store: undefined,
  // the executing environment. see env.js
  env: undefined,
};

export function putToRegistry(key, value) {
  if (Object.keys(registry).includes(key)) {
    registry[key] = value;
  } else {
    // eslint-disable-next-line
    console.warn('could not put unkown key to registry: ', key);
  }
}

export function getFromRegistory(key) {
  if (Object.keys(registry).includes(key)) {
    return registry[key];
  } else {
    // eslint-disable-next-line
    console.warn('could not get unkown key from registry: ', key);
  }
}

export default {
  putToRegistry,
  getFromRegistory,
};
