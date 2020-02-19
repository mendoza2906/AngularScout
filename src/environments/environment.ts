// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

/**
 * LVT Campos adicionales para la seguridad.
 */
export const environment = {
  production: false,
  appVersion: '1.01',
  baseUrl: 'http://localhost:8000',
  apiResource: '/api',
  clientId: 'upse-webapp-client',
  clientSecret: 'UpseWebAppRestAPI',
  appName: 'Upse'
};
