// app/_layout.tsx
import { Slot } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
// import { initDb } from 'expo/lib/db/schema.ts'; // Removed invalid import

// Provide a no-op or custom initialization function if needed
const initDb = async () => {};

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={initDb}>
      <Slot />
    </SQLiteProvider>
  );
}
