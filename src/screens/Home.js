import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Modal,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Background} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

export default function Home({navigation, route}) {
  const token = route.params.token;

  const [loading, setLoading] = useState(true);

  const [isModalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  function confirmLogOut() {
    Alert.alert(
      'Apakah anda ingin LogOut ?',
      'Anda akan keluar dari aplikasi',
      [
        {
          text: 'Keluar',
          onPress: () => logOut(),
        },
        {
          text: 'Batal',
        },
      ],
    );
  }

  async function logOut() {
    try {
      await EncryptedStorage.removeItem('credential');
      navigation.replace('SignIn');
    } catch (error) {
      console.log(error);
    }
  }

  const daftarBulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const [indexMonth, setIndexMonth] = useState(new Date().getMonth());

  const [dataValue, setDataValue] = useState([]);
  async function getData() {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://dev.pondokdigital.pondokqu.id/api/get-data-user-in-year',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLoading(false);
      setDataValue(response.data);
      // console.log(response.data);
    } catch (error) {
      setLoading(false);
      console.log(error.data);
    }
  }

  const [name, setName] = useState([]);
  const [email, setEmail] = useState([]);
  async function getName() {
    try {
      const responseName = await axios.get(
        'https://dev.pondokdigital.pondokqu.id/api/user',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setName(responseName.data.user.name);
      setEmail(responseName.data.user.email);
      // console.log(responseName.data.user.name);
    } catch (error) {}
  }
  useFocusEffect(
    useCallback(() => {
      getData();
      getName();
    }, []),
  );

  return (
    <View style={styles.container}>
      <Background />
      <View style={styles.header}>
        <TouchableOpacity onPress={confirmLogOut}>
          <Icon
            style={styles.logOutIcon}
            name={'logout'}
            size={35}
            color={'black'}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CheckInEase</Text>
      </View>

      <Text style={{color: 'black', fontStyle: 'italic', paddingLeft: 20}}>
        Selamat Datang,
      </Text>

      <View style={styles.userProfile}>
        <Icon name={'account-circle'} color={'black'} size={60} />
        <View style={{paddingLeft: 15, justifyContent: 'center'}}>
          <Text style={styles.userName}>{name}</Text>
          <Text>{email}</Text>
        </View>
      </View>

      {/* Navigasi Bulan */}
      <View style={styles.calendarContainer}>
        <TouchableNativeFeedback
          useForeground
          onPress={() => setIndexMonth(indexMonth != 0 ? indexMonth - 1 : 0)}>
          <View style={styles.calendarBack}>
            <Icon name={'chevron-left'} color={'black'} size={30} />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback useForeground>
          <View style={styles.calendarText}>
            <Text
              style={{fontWeight: 'bold', color: 'black', textAlign: 'center'}}>
              {daftarBulan[indexMonth]}
            </Text>
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback
          useForeground
          onPress={() =>
            setIndexMonth(
              indexMonth != new Date().getMonth()
                ? indexMonth + 1
                : new Date().getMonth(),
            )
          }>
          <View style={styles.calendarBack}>
            <Icon name={'chevron-right'} color={'black'} size={30} />
          </View>
        </TouchableNativeFeedback>
        {/* Navigasi Bulan */}

        <View style={{flex: 1}}>
          <TouchableNativeFeedback useForeground onPress={openModal}>
            <View style={styles.calendarSelect}>
              <Icon name={'calendar-month'} color={'black'} size={30} />
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={loading} />}>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          {dataValue[daftarBulan[indexMonth]]?.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  ...styles.absensiContainer,
                  backgroundColor:
                    item.statusPresence != 'Hadir' ? 'black' : 'dodgerblue',
                }}>
                <View style={{paddingLeft: 5, paddingTop: 2}}>
                  <Text style={{color: 'white', fontSize: 12}}>
                    {index + 1}
                  </Text>
                </View>
                <View style={{alignItems: 'center', paddingTop: 5}}>
                  <Text style={{color: 'white', fontSize: 15}}>
                    {item.statusPresence}
                  </Text>
                </View>
                <Text
                  style={{
                    color: 'white',
                    position: 'absolute',
                    bottom: 5,
                    alignSelf: 'center',
                    fontSize: 10,
                  }}>
                  {item.in}
                </Text>
                {item.out != ' ' && item.out != null && (
                  <Icon
                    style={{position: 'absolute', right: 5, top: 5}}
                    name={'bookmark-check-outline'}
                    color={'white'}
                  />
                )}
              </View>
            );
          })}
        </View>
        <View style={{height: 100}} />
      </ScrollView>

      <View style={styles.qrCodeScanContainer}>
        <TouchableNativeFeedback
          useForeground
          onPress={() =>
            navigation.navigate('Camera', {data: {token: token, name: name}})
          }>
          <View style={styles.qrCodeScan}>
            <Icon name={'qrcode-scan'} color={'white'} size={30} />
          </View>
        </TouchableNativeFeedback>
      </View>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}>
        {/* Isi modal */}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Icon name={'calendar-month'} color={'black'} size={25} />
              <Text style={{color: 'black'}}>Pilih Bulan</Text>
              <Icon
                onPress={closeModal}
                name={'close'}
                color={'black'}
                size={25}
              />
            </View>
            <ScrollView
              contentContainerStyle={{alignItems: 'center', paddingTop: 15}}>
              {daftarBulan
                .slice(0, new Date().getMonth() + 1)
                .map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.pilihBulan}
                      onPress={() => {
                        setIndexMonth(index);
                        closeModal();
                      }}>
                      <Text>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  logOutIcon: {
    transform: [{rotate: '180deg'}],
  },
  headerTitle: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    paddingLeft: 30,
  },
  userProfile: {
    paddingLeft: 20,
    paddingTop: 15,
    flexDirection: 'row',
  },
  userName: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  calendarContainer: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingLeft: 40,
    alignItems: 'center',
  },
  calendarBack: {
    backgroundColor: 'white',
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 5,
  },
  calendarText: {
    flex: 1,
    backgroundColor: 'white',
    width: 120,
    height: 21,
    marginHorizontal: 10,
    elevation: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  calendarSelect: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    position: 'absolute',
    top: -25,
    right: 25,
    elevation: 5,
    overflow: 'hidden',
  },
  absensiContainer: {
    width: 70,
    height: 70,
    borderRadius: 5,
    backgroundColor: 'black',
    // marginTop: 25,
    // marginHorizontal: 40,
    margin: 15,
  },
  qrCodeScanContainer: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
  qrCodeScan: {
    backgroundColor: '#D4CB00',
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  pilihBulan: {
    backgroundColor: 'white',
    width: '80%',
    height: 50,
    marginBottom: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
