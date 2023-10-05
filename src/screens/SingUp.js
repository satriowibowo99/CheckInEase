import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Background} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function SingUp({navigation}) {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [telepon, setTelepon] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [positionJob, setPositionJob] = useState('staff');
  const [hiddenPassword, setHiddenPassword] = useState(true);

  const [branches, setBranches] = useState([]);
  const [branchValue, setBranchValue] = useState(null);
  function getBranches() {
    axios
      .get('https://dev.pondokdigital.pondokqu.id/api/branches', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // console.log(response.data)
        setBranches(response.data);
      });
  }

  const [divisions, setDivisions] = useState([]);
  const [divisionsValue, setDivisionsValue] = useState(null);
  // console.log(divisionsValue);
  function getDivisions() {
    axios
      .get('https://dev.pondokdigital.pondokqu.id/api/getAllDivision', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        // console.log(response.data[2].id);
        setDivisions(response.data);
        getDepartment(response.data[0].id);
      });
  }

  const [departments, setDepartments] = useState([]);
  const [departmentValue, setDepartmentValue] = useState(null);
  function getDepartment(id) {
    axios
      .get(`https://dev.pondokdigital.pondokqu.id/api/getDepartment/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.data.data == 'Department belum tersedia') {
          setDepartments([{id: 0, name: 'Department belum tersedia'}]);
        } else {
          setDepartments(response.data);
        }
        // console.log(response.data);
      });
  }

  useEffect(() => {
    getBranches();
    getDivisions();
    // console.log(Math.random());
  }, []);

  async function submitSignUp() {
    try {
      setLoading(true);
      const response = await axios.post(
        'https://dev.pondokdigital.pondokqu.id/api/register',
        {
          name,
          gender,
          email,
          phone_number: telepon,
          password,
          division: divisionsValue,
          department: departmentValue,
          branch: branchValue,
          position: positionJob,
          device_model: Math.random(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const responseLogin = await axios.post(
        'https://dev.pondokdigital.pondokqu.id/api/login',
        {
          email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      setLoading(false);
      EncryptedStorage.setItem('credential', JSON.stringify({email, password}));
      if (response.data.status == 'OK') {
        navigation.navigate('Home', {token: responseLogin.data.token});
      }
      console.log(response.data);
    } catch (error) {
      setLoading(false);
      ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
      // console.log(error.response.data);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Background />

        <Text style={styles.textRegister}>Register</Text>

        <View style={{height: 15}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Nama Lengkap</Text>
          <View style={styles.inputText}>
            <Icon name="account-circle" color="black" size={30} />
            <TextInput
              style={{paddingHorizontal: 10}}
              placeholder="Masukan Nama..."
              onChangeText={name => setName(name)}
            />
          </View>
        </View>

        <View style={{height: 20}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Pilih Gender</Text>
          <View style={styles.inputText}>
            <Icon name="human-male-female" color="black" size={30} />
            <View style={{flex: 1}}>
              <Picker
                mode="dropdown"
                selectedValue={gender}
                onValueChange={itemValue => setGender(itemValue)}>
                <Picker.Item label="Pria" value={'male'} />
                <Picker.Item label="Wanita" value={'female'} />
              </Picker>
            </View>
          </View>
        </View>

        <View style={{height: 20}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Nomor Telepon
          </Text>
          <View style={styles.inputText}>
            <Icon name="phone" color="black" size={30} />
            <TextInput
              style={{paddingHorizontal: 10}}
              placeholder="08xxxxxxxxxx"
              onChangeText={telepon => setTelepon(telepon)}
            />
          </View>
        </View>

        <View style={{height: 20}} />

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
            <TouchableOpacity
              onPress={() => setHiddenPassword(!hiddenPassword)}>
              <Icon
                name={hiddenPassword ? 'eye-off' : 'eye'}
                color="black"
                size={30}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 20}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Pilih Divisi</Text>
          <View style={styles.inputText}>
            <Icon name="office-building" color="black" size={30} />
            <View style={{flex: 1}}>
              <Picker
                mode="dropdown"
                selectedValue={divisionsValue}
                onValueChange={itemValue => {
                  setDivisionsValue(itemValue);
                  getDepartment(itemValue);
                }}>
                {divisions.map(division => {
                  return (
                    <Picker.Item
                      key={division.id}
                      label={division.name}
                      value={division.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>

        <View style={{height: 20}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Pilih Departemen
          </Text>
          <View style={styles.inputText}>
            <Icon name="domain" color="black" size={30} />
            <View style={{flex: 1}}>
              <Picker
                mode="dropdown"
                selectedValue={departmentValue}
                onValueChange={itemValue => setDepartmentValue(itemValue)}>
                {departments.map(department => {
                  return (
                    <Picker.Item
                      key={department.id}
                      label={department.name}
                      value={department.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>

        <View style={{height: 20}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>Pilih Cabang</Text>
          <View style={styles.inputText}>
            <Icon name="source-merge" color="black" size={30} />
            <View style={{flex: 1}}>
              <Picker
                mode="dropdown"
                selectedValue={branchValue}
                onValueChange={itemValue => setBranchValue(itemValue)}>
                {branches.map(branch => {
                  return (
                    <Picker.Item
                      key={branch.id}
                      label={branch.name}
                      value={branch.id}
                    />
                  );
                })}
              </Picker>
            </View>
          </View>
        </View>

        <View style={{height: 20}} />

        <View style={styles.inputContainer}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            Pilih Jabatan
          </Text>
          <View style={styles.inputText}>
            <Icon name="human-male-male" color="black" size={30} />
            <View style={{flex: 1}}>
              <Picker
                mode="dropdown"
                selectedValue={positionJob}
                onValueChange={itemValue => setPositionJob(itemValue)}>
                <Picker.Item label="Staff" value={'staff'} />
                <Picker.Item label="Supervisor" value={'supervisor'} />
                <Picker.Item label="Manager" value={'manager'} />
              </Picker>
            </View>
          </View>
        </View>

        <View>
          <TouchableNativeFeedback useForeground onPress={submitSignUp}>
            <View style={styles.btnMasuk}>
              {loading ? (
                <ActivityIndicator color={'white'} />
              ) : (
                <Text style={styles.textBtnMasuk}>Daftar</Text>
              )}
            </View>
          </TouchableNativeFeedback>
        </View>

        <View style={styles.btnContainer}>
          <TouchableNativeFeedback
            useForeground
            onPress={() => navigation.goBack()}>
            <View style={styles.btnDaftar}>
              <Text style={styles.textBtnDaftar}>Kembali</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRegister: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    paddingTop: 30,
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
    justifyContent: 'center',
    alignItems: 'center',
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
  btnContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
});
