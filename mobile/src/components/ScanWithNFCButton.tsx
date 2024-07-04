import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

export enum ScanMode {
  OFF = 'OFF',
  SCANNING = 'SCANNING',
  SUCCESS = 'SCANNED',
  ERROR = 'ERROR',
}

interface ScanWithNFCButtonProps {
  mode: ScanMode;
  onClick?: () => void;
}

const buttonImage = (mode: ScanMode) => {
  switch (mode) {
    case ScanMode.OFF:
      return require('../assets/scan.png');
    case ScanMode.SCANNING:
      return require('../assets/scanning.png');
    case ScanMode.SUCCESS:
      return require('../assets/tick.png');
    case ScanMode.ERROR:
      return require('../assets/x.png');
  }
};

const buttonStyle = (mode: ScanMode) => {
  switch (mode) {
    case ScanMode.SCANNING:
      return styles.scanningbuttonImage;
    default:
      return styles.scanbuttonImage;
  }
};

export const ScanWithNFCButton = ({mode, onClick}: ScanWithNFCButtonProps) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <Image source={buttonImage(mode)} style={buttonStyle(mode)} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
