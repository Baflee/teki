import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
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
    <View style={[styles.container]}>
      <Image
        source={require('../assets/teki-logo.png')}
        style={styles.imageStyle}
      />
      <View>
        <Text style={styles.title}>Connect to browser</Text>
        <Text style={styles.underText}>
          Link this phone as card scanner for authentication
        </Text>
      </View>
      <View style={styles.status}>
        <Text style={styles.statusTitle}>Connected</Text>
        <Text style={styles.statusUnderText}>
          Ready to scan with this phone to authenticate on the following browser
        </Text>
        <Text style={styles.statusUnderText}>
          LAPTOP-N8HEFEIG Brave V 1.67.123
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252C40',
  },
  imageStyle: {
    marginTop: 20,
    width: 150,
    height: 150,
  },
  title: {
    marginLeft: 20,
    fontSize: 30,
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#fff',
  },
  underText: {
    marginLeft: 20,
    fontSize: 16,
    marginBottom: 20,
    color: '#858CA7',
    fontWeight: '500',
  },
  status: {
    flex: 1,
    marginTop: 40,
    alignItems: 'center',
  },
  statusTitle: {color: '#00C6BF', fontWeight: 'bold', fontSize: 30},
  statusUnderText: {textAlign: 'center', paddingHorizontal: 40, marginTop: 20},
});

export default ConnectScreen;
