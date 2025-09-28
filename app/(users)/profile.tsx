import { useRouter } from 'expo-router';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { getCurrentUserId, logoutUser } from '../db/auth';
import { getUserById, PublicUserRow } from '../db/queries';

export default function ProfilePage() {
  const [user, setUser] = React.useState<PublicUserRow | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  

  React.useEffect(() => {
    const fetchUser = async () => {
      const userId =  await getCurrentUserId();
      if (userId) {
        try {
          const userData = await getUserById(userId);
          setUser(userData);
        }
        catch (error) {
          console.error('Error fetching user data:', error);
          alert('Error fetching user data. Please try again.');
          router.replace('/(public)/login'); 
      } finally {     
      setLoading(false);
        }
      }
    };
    fetchUser();
  }, []);


  const handleLogout = () => {
     logoutUser();
    router.replace("/login"); 
    console.log('User logged out');

  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
      <Text style={styles.email}>{user?.email}</Text>
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
