import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(public)/login" />;
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

