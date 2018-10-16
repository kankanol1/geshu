// this file will be executed automatically by umi.

import { putToRegistry } from './common/registry';

const store = window.g_app._store;

putToRegistry('store', store);
