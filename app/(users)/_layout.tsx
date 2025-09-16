import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />      
      <Tabs.Screen
        name="top-user-picks"
        options={{
          title: 'Top User Picks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
    name="search"
    options={{
      title: 'Search',
      tabBarIcon: ({ color, size }) => (
        <Ionicons name="search" color={color} size={size} />
      ),
    }}
  />
</Tabs>
    
    
  );
}