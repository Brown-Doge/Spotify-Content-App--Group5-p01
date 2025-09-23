import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="search">
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