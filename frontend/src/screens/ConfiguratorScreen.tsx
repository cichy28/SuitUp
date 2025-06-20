import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConfiguratorScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Configurator Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ConfiguratorScreen;