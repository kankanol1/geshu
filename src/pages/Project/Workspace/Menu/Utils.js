export function renderIfInScope(c, scope, env) {
  if (env !== undefined && (env.includes(scope) || env.includes('*'))) {
    return c;
  } else return null;
}

export default {
  renderIfInScope,
};
