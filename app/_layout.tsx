import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)/index" />
      <Stack.Screen name="(tabs)/login" />
      <Stack.Screen name="(tabs)/top-user-picks" />
      <Stack.Screen name="(tabs)/search"/>
    </Stack>
  ); 
}