import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ConnectScreenNavigationProp} from '../types/navigation.ts';
type Props = {
  navigation: ConnectScreenNavigationProp;
  setIsScanning: (value: boolean) => void;
  setIsScanned: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  setDecoded: (value: any) => void;
};

const ConnectScreen: React.FC<Props> = ({
  navigation,
  setIsScanning,
  setIsScanned,
  setDecoded,
  setIsError,
}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsScanning(false),
        setIsScanned(false),
        setDecoded(null),
        setIsError(false);
    });

    return unsubscribe;
  }, [navigation]);

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
