import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {ConnectScreenNavigationProp} from '../types/navigation';

type Props = {
  navigation: ConnectScreenNavigationProp;
};

const ConnectScreen: React.FC<Props> = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect Page</Text>
      <Button
        title="Go to Landing Page"
        onPress={() => navigation.navigate('Landing')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ConnectScreen;
