import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

export default function ProfilePage() {
  const user = {
    name: 'John Doe',
    email: 'johndoe@email.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
});
