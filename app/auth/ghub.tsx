import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import React, { useEffect } from 'react';
import { Button, View, Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export default function GhubAuth() {
  // Use the Expo proxy in Expo Go; set to false if using a dev client/standalone
  const useProxy = true;

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '<YOUR_CLIENT_ID>',
      // Optional but common scope for user identity
      scopes: ['read:user', 'user:email'],
      redirectUri: makeRedirectUri({
        scheme: 'mymovieapp',
        path: 'redirect',
        useProxy, // critical for Expo Go
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params as { code: string };
      // Send `code` to YOUR backend to exchange for an access token.
      // e.g. await fetch('https://your.api/oauth/github', { method: 'POST', body: JSON.stringify({ code }) })
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
        onPress={() => promptAsync({ useProxy })}
      />
    </View>
  );
}
