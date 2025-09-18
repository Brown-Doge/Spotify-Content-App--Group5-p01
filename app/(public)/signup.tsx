import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';
import { addUser } from '../db/queries';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  const checkUser1 = async () => {
    if (username.length === 0 || password.length === 0 || email.length === 0 || firstName.length === 0 || lastName.length === 0) {
      alert('Please enter username, email, and password.');
      return;
    }
  
    if(password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }
    
      try{
        await addUser(username, email, password, firstName, lastName);
        alert('Sign-up successful! You can now log in.');
        router.push({ pathname: '/Login' });
      } catch (error) {
        console.error('Error during sign-up:', error);
        alert('Sign-up failed. Please try again.');

      }
    }
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
        <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            />
        <TextInput
            style={styles.input}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            />
        <TextInput

            style={styles.input}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            />
        <View style={{ height: 16 }} />
        <Button title="Sign Up" onPress={checkUser1}/>
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
