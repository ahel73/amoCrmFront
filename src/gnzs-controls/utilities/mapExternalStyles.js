import { map } from 'underscore';

const loader = 'require-css';

export default function(styles) {
  return map(styles, value => {
    return `${loader}!${value}`;
  });
}
