// this file will be executed automatically by umi.

import { putToRegistry } from './common/registry';

export function render(oldRender) {
  oldRender();

  const store = window.g_app._store;

  putToRegistry('store', store);
}
