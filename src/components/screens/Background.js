import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export default function Background() {
  return <Image source={require('../../assets/images/bg.png')} style={styles.backgroundContainer} />
}

const styles = StyleSheet.create({
  backgroundContainer: {
    width:'100%', 
    height:'100%', 
    position:'absolute'
  }
})