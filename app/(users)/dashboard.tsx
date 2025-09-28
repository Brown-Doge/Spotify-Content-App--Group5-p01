import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCurrentUserId } from '../db/auth';
import { getUserById, PublicUserRow } from '../db/queries';

export default function Dashboard() {

  const router = useRouter();
  const [userId, setUserId] = React.useState<PublicUserRow | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userId =  await getCurrentUserId();
      if (userId) {
        try {
          const userData = await getUserById(userId);
          setUserId(userData);
        }
        catch (error) {
          console.error('Error fetching user data:', error);
          alert('Error fetching user data. Please try again.');
          router.replace('/(public)/login'); 
      }
      finally {
      setLoading(false);
        
      }
      }
    };
    fetchUser();
  }, []);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
   const switchProfile = () => {
    router.replace("/(users)/profile");
      
  
    };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}> Welcome Back {userId?.first_name}</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>12</Text>
          <Text style={styles.cardLabel}>Tasks</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>5</Text>
          <Text style={styles.cardLabel}>Messages</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>3</Text>
          <Text style={styles.cardLabel}>Alerts</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardNumber}>8</Text>
          <Text style={styles.cardLabel}>Projects</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={switchProfile}>
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
