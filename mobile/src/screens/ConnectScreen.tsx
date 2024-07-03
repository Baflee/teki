import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const ConnectScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#252C40',
  },
  text: {
    fontSize: 20,
  },
});

export default ConnectScreen;
