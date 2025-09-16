import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();


// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};
export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const checkUser = async () => {
    if (username.length === 0 || password.length === 0) {
      alert('Please enter both username and password.');
      return;
    }
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'CLIENT_ID',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'mymovieapp',
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={checkUser}/>
      <View style={{ height: 16 }} />
      <Button title="Sign Up" onPress={() => {}} />
      <View style={{ height: 16 }} />
      
      <Button
        disabled={!request}
        title="github"
        onPress={() => {
        promptAsync();
      }}
    />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '80%',
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});