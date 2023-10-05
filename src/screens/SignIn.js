import {
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {Background} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function SignIn({navigation}) {
  const [hiddenPassword, setHiddenPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://dev.pondokdigital.pondokqu.id/api/login',
        {email, password},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      EncryptedStorage.setItem('credential', JSON.stringify({email, password}));
      // console.log(response.data.token);
      setLoading(false);
      navigation.navigate('Home', {token: response.data.token});
    } catch (error) {
      setLoading(false);
      // console.log(error.response.data);
      ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
    }
  }

  return (
    <View style={styles.container}>
      <Background />

      <Text style={styles.textSignIn}>Masuk</Text>

      <View style={{height: 15}} />

      <View style={styles.inputContainer}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Email</Text>
        <View style={styles.inputText}>
          <Icon name="gmail" color="black" size={30} />
          <TextInput
            style={{paddingHorizontal: 10}}
            placeholder="Email@gmail.com"
            onChangeText={email => setEmail(email)}
          />
        </View>
      </View>

      <View style={{height: 20}} />

      <View style={styles.inputContainer}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>Password</Text>
        <View style={styles.inputText}>
          <Icon name="lock" color="black" size={30} />
          <TextInput
            style={{flex: 1, paddingHorizontal: 10}}
            placeholder="Masukan Password"
            secureTextEntry={hiddenPassword}
            onChangeText={password => setPassword(password)}
          />
          <TouchableOpacity onPress={() => setHiddenPassword(!hiddenPassword)}>
            <Icon
              name={hiddenPassword ? 'eye-off' : 'eye'}
              color="black"
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <TouchableNativeFeedback useForeground onPress={handleLogin}>
          <View style={styles.btnMasuk}>
            {loading ? (
              <ActivityIndicator color={'white'} />
            ) : (
              <Text style={styles.textBtnMasuk}>Masuk</Text>
            )}
          </View>
        </TouchableNativeFeedback>
      </View>

      <View>
        <TouchableNativeFeedback
          useForeground
          onPress={() => navigation.navigate('SignUp')}>
          <View style={styles.btnDaftar}>
            <Text style={styles.textBtnDaftar}>Daftar</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSignIn: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '80%',
    borderBottomWidth: 2,
    borderColor: '#B8BC00',
  },
  inputText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  btnMasuk: {
    backgroundColor: '#D4CB00',
    width: 240,
    height: 40,
    marginTop: 35,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  textBtnMasuk: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    elevation: 3,
  },
  btnDaftar: {
    backgroundColor: '#3ADE00',
    width: 150,
    height: 40,
    marginTop: 13,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
  },
  textBtnDaftar: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    elevation: 3,
  },
});
