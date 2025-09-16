// app/_layout.tsx
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { initDb } from '.expo/lib/db/schemas.ts';

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={initDb}>
      <Slot />
    </SQLiteProvider>
  );
}
