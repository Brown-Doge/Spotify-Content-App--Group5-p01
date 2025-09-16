import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

const [request, response, promptAsync] = useAuthRequest(
  {
    clientId: '<YOUR_CLIENT_ID>',   // ← paste here
    redirectUri: makeRedirectUri({ scheme: 'mymovieapp', path: 'redirect' }), // e.g. mymovieapp://redirect
    // scopes are provider-specific; `usePKCE` defaults to true per API
  },
  discovery
);
