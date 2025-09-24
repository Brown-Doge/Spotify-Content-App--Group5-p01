import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { initializeDatabase } from '../lib/db/schema';

// this keeps the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbInitialized, setDbInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // this effect runs once when the component mounts
  useEffect(() => {
    async function setup() {
      try {
        // awwait the async database initialization
        await initializeDatabase();
        setDbInitialized(true);
      } catch (e) {
        console.error("Database initialization failed", e);
        if (e instanceof Error) {
          setError(e);
        }
      }
    }

    setup();
  }, []);

  // effect is hidden once db is initialized or if there was an error
  useEffect(() => {
    if (dbInitialized || error) {
      SplashScreen.hideAsync();
    }
  }, [dbInitialized, error]);

  // if error show it
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error initializing the app: {error.message}</Text>
      </View>
    );
  }

  // database is still initializing show nothing (splash screen is visible)
  if (!dbInitialized) {
    return null;
  }

  //once db is initialized, show the app
  return (
    <Stack>
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
    </Stack>
  );
}
