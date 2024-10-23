export const environment = {
  production: true,
  appApiUrl: '',
  configApiUrl: 'https://silabo-config.espe.edu.ec/api/v1',
  espematicoApiUrl: 'https://espematico-api.espe.edu.ec/reporteWs',
  imageApiUrl: 'https://image-api.espe.edu.ec/imagen/',
  sso: {
    serverUrl: 'https://srvcas.espe.edu.ec',
    clientId: 'qTAPPzovUtAimBRFBLIo8xpxZTsa',
    requireHttps: false,
    issuer: '/oauth2endpoints/token',
    redirectUri: window.location.origin,
    postRedirectUrL: window.location.origin,
    scope: 'openid profile email',
    logout: '/oidc/logout',
    tokenEndpoint: '/oauth2endpoints/token',
    userinfoEndpoint: '/oauth2/userinfo',
    authorizationEndpoint: '/oauth2/authorize',
    jwksEndpoint: '/oauth2/jwks',
    showDebugInformation: true,
    responseType: 'id_token token'
  }
};
