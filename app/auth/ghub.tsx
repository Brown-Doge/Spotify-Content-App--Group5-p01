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
      redirectUri: makeRedirectUri({ scheme: 'mymovieapp', path: 'redirect' }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params as { code: string };
      fetch('http://localhost:8081/api/auth/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          // Save session/token as you do for normal login
          // e.g., setCurrentUserId(data.userId)
          Alert.alert('Login Success', `User ID: ${data.userId}`);
        })
        .catch(err => {
          Alert.alert('Login Failed', err.message);
        });
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