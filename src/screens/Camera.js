import {
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

export default function ScanCamera({navigation, route}) {
  console.log(route);
  const token = route.params.data.token;
  const name = route.params.data.name.toUpperCase();

  const device = useCameraDevice('back');

  const [cameraStatus, setCameraStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  const [conditionStatus, setconditionStatus] = useState(null);
  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    setconditionStatus(newCameraPermission);
    console.log(newCameraPermission);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      setLoading(true);
      if (codes[0].value == 'saya-hadir') {
        sayaHadir(codes);
      } else if (codes[0].value == 'saya-pulang') {
        sayaPulang(codes);
      } else {
        // setLoading(true);
        setTimeout(() => setLoading(false), 3000);
        console.log('qr-code-tidak-dikenali');
      }
      // console.log(codes[0].value);
    },
  });

  async function sayaHadir(codes) {
    try {
      const response = await axios.post(
        'https://dev.pondokdigital.pondokqu.id/api/presence-in',
        {
          status: 'Hadir',
          latitude: Math.random(),
          longitude: Math.random(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (
        response.data.message == `TERIMA KASIH ${name} SUDAH PRESENSI HARI INI`
      ) {
        navigation.goBack();
        ToastAndroid.show(response.data.message, ToastAndroid.LONG);
      } else if (
        response.data.message ==
        `${name} SUDAH PRESENSI HARI INI, CUKUP SEKALI AJA PRESENSINYA`
      ) {
        navigation.goBack();
        ToastAndroid.show(response.data.message, ToastAndroid.LONG);
      }
      console.log(response.data);
    } catch (error) {}
    // console.log(codes[0].value);
  }

  async function sayaPulang(codes) {
    try {
      const response = await axios.post(
        'https://dev.pondokdigital.pondokqu.id/api/presence-out',
        null,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response.data);
      if (
        response.data.message ==
        `HAI ${name} ANDA BELUM PRESENSI MASUK, SILAHKAN PRESENSI MASUK TERLEBIH DAHULU`
      ) {
        setLoading(false);
        ToastAndroid.show(response.data.message, ToastAndroid.LONG);
      } else if (
        response.data.message ==
        `TERIMA KASIH ${name} SUDAH PRESENSI PULANG HARI INI`
      ) {
        navigation.goBack();
        ToastAndroid.show(response.data.message, ToastAndroid.LONG);
      } else if (
        response.data.message ==
        `${name} SUDAH PRESENSI PULANG HARI INI, CUKUP SEKALI AJA PRESENSINYA`
      ) {
        navigation.goBack();
        ToastAndroid.show(response.data.message, ToastAndroid.LONG);
      }
    } catch (error) {}
    // console.log(codes[0].value);
  }

  useFocusEffect(
    useCallback(() => {
      checkPermission();
    }, []),
  );

  if (loading) {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000066',
        }}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
            borderRadius: 10,
          }}>
          <ActivityIndicator color={'black'} size={30} />
        </View>
      </View>
    );
  }

  if (device == null)
    return (
      <Text style={{color: 'white', fontSize: 100}}>Camera Tidak Ada</Text>
    );
  return (
    <View style={{flex: 1}}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={cameraStatus}
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
