import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';
import {jwtDecode} from 'jwt-decode';
import {LandingScreenNavigationProp} from '../types/navigation.ts';
import {TouchableOpacity} from 'react-native-gesture-handler';

type Props = {
  navigation: LandingScreenNavigationProp;
  setIsScanning: (value: boolean) => void;
  setIsScanned: (value: boolean) => void;
  setIsError: (value: boolean) => void;
  setDecoded: (value: any) => void;
  isScanning: boolean;
  isScanned: boolean;
  isError: boolean;
  decoded: any;
};

const LandingScreen: React.FC<Props> = ({
  navigation,
  isScanning,
  isScanned,
  isError,
  decoded,
  setIsScanning,
  setIsError,
  setIsScanned,
  setDecoded,
}) => {
  const [tagData, setTagData] = useState<string | null>(null);

  const [animationOpacity] = useState(new Animated.Value(1));

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cancelReadNfc();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isScanning) {
      startAnimation();
    } else {
      animationOpacity.setValue(1);
      animationOpacity.stopAnimation();
    }
  }, [isScanning]);

  const cancelReadNfc = async () => {
    setIsScanning(false);
    setIsScanned(false);
    setTagData(null);
    setDecoded(null);
  };
  const cancelError = async () => {
    setIsError(false);
  };

  const readNfcTag = async () => {
    if (!isError) {
      setIsScanning(true);
    }
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag && tag.ndefMessage) {
        const ndefRecord = tag.ndefMessage[0];
        if (ndefRecord && ndefRecord.payload) {
          const payload = new Uint8Array(ndefRecord.payload);
          const text = Ndef.text.decodePayload(payload);
          setTagData(text);
          setIsError(false);
          setIsScanned(true);
          const decodedtext: any = jwtDecode(text);
          setDecoded(decodedtext);
        } else {
          cancelReadNfc();
          setIsError(true);
          readNfcTag();
          setTagData('No NDEF message payload found');
        }
      } else {
        cancelReadNfc();
        setIsError(true);
        readNfcTag();
        setTagData('No NDEF message found');
      }
    } catch (ex) {
      cancelReadNfc();
      setIsError(true);
      readNfcTag();
      setTagData('Error reading NFC tag');
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationOpacity, {
          toValue: 0.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animationOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      {iterations: -1},
    ).start();
  };

  return (
    <View
      style={[
        styles.container,
        isScanned && decoded ? styles.scannedContainer : null,
        isError ? styles.errorContainer : null,
      ]}>
      <Image
        source={require('../assets/teki-logo.png')}
        style={styles.imageStyle}
      />
      {isScanning ? (
        isScanned ? (
          <View>
            {decoded && (
              <View>
                <Text style={styles.title}>{decoded.name}</Text>
                <Text
                  style={[
                    styles.underText,
                    isScanned && decoded ? styles.scannedUnderText : null,
                  ]}>
                  Thanks ! Your card is valid
                </Text>
              </View>
            )}
          </View>
        ) : !isError ? (
          <View>
            <Text style={styles.scanningTitle}>Scanning ...</Text>
            <Text style={styles.underText}>
              Keep your card close to your phone...
            </Text>
          </View>
        ) : null
      ) : !isError ? (
        <View>
          <Text style={styles.title}>Scan your card</Text>
          <Text style={styles.underText}>
            Authenticate with your physical card
          </Text>
        </View>
      ) : null}
      {isError ? (
        <View>
          <Text style={styles.title}>Unknown card</Text>
          <Text
            style={[
              styles.underText,
              isError ? styles.scannedUnderText : null,
            ]}>
            Please try scanning again
          </Text>
        </View>
      ) : null}

      <View style={styles.centeredButtonContainer}>
        {isScanning ? (
          isScanned ? (
            <View>
              {decoded && (
                <Image
                  source={require('../assets/tick.png')}
                  style={styles.scanbuttonImage}
                />
              )}
            </View>
          ) : !isError ? (
            <Animated.View style={{opacity: animationOpacity}}>
              <TouchableOpacity onPress={cancelReadNfc}>
                <Image
                  source={require('../assets/scanning.png')}
                  style={styles.scanningbuttonImage}
                />
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <TouchableOpacity onPress={cancelError}>
              <Image
                source={require('../assets/x.png')}
                style={styles.scanbuttonImage}
              />
            </TouchableOpacity>
          )
        ) : !isError ? (
          <TouchableOpacity onPress={readNfcTag}>
            <Image
              source={require('../assets/scan.png')}
              style={styles.scanbuttonImage}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={cancelError}>
            <Image
              source={require('../assets/x.png')}
              style={styles.scanbuttonImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252C40',
  },
  scannedContainer: {
    backgroundColor: '#00C6BF',
  },
  errorContainer: {
    backgroundColor: '#E73A14',
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
  scannedUnderText: {
    color: '#252C40',
  },
  scanningTitle: {
    fontSize: 30,
    marginLeft: 20,
    color: '#D5A419',
    fontWeight: 'bold',
  },
  text: {
    marginTop: 20,
    color: '#fff',
  },
  centeredButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    marginTop: 20,
    width: 150,
    height: 150,
  },
  scanbuttonImage: {
    marginBottom: 40,
    width: 150,
    height: 150,
  },
  scanningbuttonImage: {
    marginBottom: 50,
    width: 250,
    height: 250,
  },
});

export default LandingScreen;
