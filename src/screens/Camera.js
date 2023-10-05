import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';

export default function ScanCamera() {
  const device = useCameraDevices('back');

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };

  useEffect(() => {
    checkPermission();
  }, []);

  if (device == null)
    return (
      <Text style={{color: 'white', fontSize: 100}}>Camera Tidak Ada</Text>
    );
  return (
    <View style={{flex: 1}}>
      <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
    </View>
  );
}
