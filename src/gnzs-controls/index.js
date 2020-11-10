import '@babel/polyfill/noConflict';

import { modules, styles } from '../widget.config.json';
import mapExternalModules from './utilities/mapExternalModules';
import mapExternalStyles from './utilities/mapExternalStyles';

window.define([...mapExternalStyles(styles), ...mapExternalModules(modules)], () => {
  try {
    return require('./widget').default;
  } catch (e) {
    console.debug(e);
  }
});
