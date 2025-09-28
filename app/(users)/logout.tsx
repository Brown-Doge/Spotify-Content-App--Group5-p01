import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { logoutUser } from "../db/auth";

export default function Logout() {
  function handleLogout() {
    logoutUser();
    router.replace("/login"); 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Are you sure you want to log out?</Text>

      <TouchableOpacity style={styles.blackButton} onPress={handleLogout}>
        <Text style={styles.blackButtonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.blackButton, { backgroundColor: "#555" }]}
        onPress={() => router.back()}
      >
        <Text style={styles.blackButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 18, marginBottom: 20, fontWeight: "600" },
  blackButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    width: "100%",
  },
  blackButtonText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});
