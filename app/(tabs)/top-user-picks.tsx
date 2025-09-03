import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TopUserPicks() {
  return (
    <View style={styles.container}>
      <View style={styles.square}>
        <Text style={styles.label}>Top Movie</Text>
      </View>
      <View style={styles.square}>
        <Text style={styles.label}>Top Director</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  square: {
    width: 120,
    height: 120,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginHorizontal: 12,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});