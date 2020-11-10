import { map } from 'underscore';

export default function(modules) {
  const paths = window.require.s.contexts._.config.paths;

  return map(modules, (value, key) => {
    paths[key] = value
      .split('.')
      .slice(0, -1)
      .join('.');
    return key;
  });
}
