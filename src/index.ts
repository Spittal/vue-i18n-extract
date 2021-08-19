export * from './config-file';
export * from './create-report';
export * from './types';

process.on('uncaughtException', (err) => {
  console.error('[vue-i18n-extract]', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('[vue-i18n-extract]', err);
  process.exit(1);
});
