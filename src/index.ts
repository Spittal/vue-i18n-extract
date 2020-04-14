import * as report from './report-command';

export * from './types';
export * from './report-command';

// Needed for compatibility with versions < 1.1.0 of vue-i18n-extract.
export default {
  ...report
};
