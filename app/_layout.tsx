import { Stack } from "expo-router";
import { useEffect } from "react";
import { setUpDataBase } from "./db/schema";

export default function RootLayout() {
  useEffect(() => {
    setUpDataBase().then(() => {
      // this should appear if everything was loaded up correctly
      console.log("Local Database is ready");
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