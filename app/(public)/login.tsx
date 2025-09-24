import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { setCurrentUserId } from '../../lib/db/auth';
import { verifyLogin } from '../../lib/db/queries';
import { initializeDatabase } from '../../lib/db/schema';
import { setFavorite } from '../../lib/db/favorites';


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};
export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await initializeDatabase();
      } catch (e) {
        console.error(e);
        Alert.alert('Database error', 'Could not initialize database.');
      }
    })();
  }, []);


  const checkUser = async () => {
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Please enter both username and password.');
      return;
    }
   
    try {
      const user = await verifyLogin(username.trim(), password);
      if (user) {
        setCurrentUserId(user.user_id);  
        router.replace('/search'); 
      } else {
        Alert.alert('Login failed', 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('An error occurred during login. Please try again.');
    }
  }; 


  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Ov23liStAcDficiTmWmY', // <-- your real client ID
      scopes: ['read:user', 'user:email'],
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
      <Text>Login Page</Text>
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
      <Button title="Sign Up" onPress={() => router.push('/(public)/signup')} />
      <View style={{ height: 16 }} />
      
      <Button
        disabled={!request}
        title="Sign in with GitHub"
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