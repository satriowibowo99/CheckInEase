import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';

export default function ScanCamera({navigation}) {
  const device = useCameraDevice('back');

  const [conditionStatus, setconditionStatus] = useState(null);
  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    setconditionStatus(newCameraPermission);
    console.log(newCameraPermission);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      console.log(`Scanned ${codes.length} codes!`);
    },
  });

  useFocusEffect(
    useCallback(() => {
      checkPermission();
    }, []),
  );

  if (device == null)
    return (
      <Text style={{color: 'white', fontSize: 100}}>Camera Tidak Ada</Text>
    );
  return (
    <View style={{flex: 1}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
        fps={30}
      />
      <Modal
        onRequestClose={() => navigation.goBack()}
        animationType="fade"
        visible={conditionStatus == 'denied' || conditionStatus == null}
        transparent={true}>
        <View style={styles.modalPosition}>
          <View style={styles.modalContainer}>
            {conditionStatus == 'denied' ? (
              <Icon name={'alert-outline'} color={'black'} size={30} />
            ) : (
              <ActivityIndicator color={'black'} />
            )}

            <View style={{paddingLeft: 20}} />
            <Text style={{color: 'black'}}>
              {conditionStatus == 'denied'
                ? 'Izin Kamera diperlukan'
                : 'Memeriksa Perizinan...'}
            </Text>
            <View style={{width: 20}} />
            {conditionStatus == 'denied' && (
              <TouchableOpacity
                onPress={() => Linking.openSettings()}
                style={{
                  width: 50,
                  height: 50,
                  elevation: 5,
                  backgroundColor: 'white',
                  borderRadius: 50 / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name={'refresh'} color={'black'} size={30} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalPosition: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '80%',
    height: 100,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    flexDirection: 'row',
  },
});
