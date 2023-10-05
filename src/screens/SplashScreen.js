import {StyleSheet, View, Image} from 'react-native';
import React, {useEffect} from 'react';
import {Background, ImgAppLogo} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

export default function SplashScreen({navigation}) {
  async function refreshToken() {
    try {
      const credential = await EncryptedStorage.getItem('credential');
      console.log(credential);
      if (credential != null) {
        const response = await axios.post(
          'https://dev.pondokdigital.pondokqu.id/api/login',
          JSON.parse(credential),
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        navigation.navigate('Home', {token: response.data.token});
        // console.log(response.data.token);
      } else {
        navigation.navigate('SignIn');
      }
      // console.log(credential);
    } catch (error) {
      navigation.replace('SignIn');
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    // setTimeout(() => {
    //   navigation.replace('SignIn');
    // }, 3000);
    refreshToken();
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Background />
      <Image source={ImgAppLogo} style={styles.ImgSplashLogo} />
    </View>
  );
}

const styles = StyleSheet.create({
  ImgSplashLogo: {
    width: 100,
    height: 100,
  },
});
