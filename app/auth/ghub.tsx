import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import React, { useEffect } from 'react';
import { Button, View, Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: '', // GitHub does not provide a revocation endpoint
};

export default function GhubAuth() {
  const useProxy = true; // Set to false if using a dev client/standalone

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Ov23liStAcDficiTmWmY',
      scopes: ['read:user', 'user:email'],
      redirectUri: makeRedirectUri({
        scheme: 'mymovieapp',
        path: 'redirect',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params as { code: string };
      // Send `code` to your backend to exchange for an access token.
      Alert.alert('GitHub Code Received', code);
    } else if (response?.type === 'error') {
      Alert.alert('Auth Error', JSON.stringify(response.params ?? {}));
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        disabled={!request}
        title="Login with GitHub"
        onPress={() => promptAsync()}
      />
    </View>
  );
}
