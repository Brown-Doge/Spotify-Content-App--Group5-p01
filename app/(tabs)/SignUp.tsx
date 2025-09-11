import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { addUser } from '../db/queries';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading ] = useState(false);
  const router = useRouter();

  const checkSignup = async () => {
    if (username.length === 0 || password.length === 0 || email.length === 0) {
      Alert.alert('Please enter username, email, and password.');
      return;
    }
  
  try{
    setLoading(true);
    await addUser(firstName, lastName, username, email, password);
    setLoading(false);
    Alert.alert('Registration Successful', 'You have been registered successfully.');
    router.push({pathname: '/login'});
  }catch (error) {
    setLoading(false);
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed: users.username')) {
      Alert.alert('Registration Failed', 'Username already exists. Please choose a different username.');
    }
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
            keyboardType='email-address'
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
          {loading ? <Text>Registering...</Text> : null}

        <Button title="Sign Up" onPress={checkSignup}/>
        <Link href="/login">
        <Text>Back to Login</Text>
      </Link>
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
  