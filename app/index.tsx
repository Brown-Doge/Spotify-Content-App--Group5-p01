import { View, StyleSheet, Image } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/Mivra_Logo.png')}
        style={{ width: 120, height: 120, marginBottom: 16 }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
