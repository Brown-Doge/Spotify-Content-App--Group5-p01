import { Stack } from "expo-router";
import { useEffect } from "react";
import { getDatabase } from "./db/schema";

export default function RootLayout() {
  useEffect(() => {
    getDatabase()
      .then(() => {
        // this should appear if everything was loaded up correctly
        console.log("Local Database is ready");
      })
      .catch((error: unknown) => {
        console.error("Failed to initialize database:", error);
        // You might want to show a user-friendly error message here
      });
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)/index" />
      <Stack.Screen name="(tabs)/login" />
      <Stack.Screen name="(tabs)/top-user-picks" />
      <Stack.Screen name="(tabs)/search"/>
      <Stack.Screen name="(tabs)/testDB" />
    </Stack>
  ); 
}