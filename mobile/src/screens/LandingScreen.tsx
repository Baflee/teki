import React, {useEffect, useState} from 'react';
import {View, Text, Button, StyleSheet, Image} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {LandingScreenNavigationProp} from '../types/navigation.ts';
type Props = {
  navigation: LandingScreenNavigationProp;
};
const LandingScreen: React.FC<Props> = ({navigation}) => {
  const [tagData, setTagData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsScanning(false);
    });

    return unsubscribe;
  }, [navigation]);

  const readNfcTag = async () => {
    setIsScanning(true);
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag && tag.ndefMessage) {
        const ndefRecord = tag.ndefMessage[0];
        if (ndefRecord && ndefRecord.payload) {
          const payload = new Uint8Array(ndefRecord.payload);
          const text = Ndef.text.decodePayload(payload);
          setTagData(text);
          setIsScanning(false);
        } else {
          setTagData('No NDEF message payload found');
        }
      } else {
        setTagData('No NDEF message found');
      }
    } catch (ex) {
      console.warn(ex);
      setTagData('Error reading NFC tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/teki-logo.png')}
        style={styles.imageStyl}></Image>
      {isScanning ? (
        <View>
          <Text style={styles.scanningTitle}>Scanning ...</Text>
          <Text style={styles.underText}>
            Keep your card close to your phone...
          </Text>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Scan your card</Text>
          <Text style={styles.underText}>
            Authenticate with your physical card
          </Text>
        </View>
      )}
      <Button title="Scan NFC Tag" onPress={readNfcTag} />
      {tagData && <Text style={styles.text}>Tag Data: {tagData}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#252C40',
  },
  title: {
    fontSize: 24,

    color: '#fff',
  },
  underText: {
    fontSize: 13,
    marginBottom: 20,
    color: '#858CA7',
  },
  scanningTitle: {
    fontSize: 24,

    color: '#D5A419',
  },
  text: {
    marginTop: 20,
  },
  imageStyl: {
    height: 80,
  },
});

export default LandingScreen;
