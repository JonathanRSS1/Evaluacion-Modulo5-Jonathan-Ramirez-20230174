import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


export default function Splash({ navigation }) {
useEffect(() => {
  const t = setTimeout(() => {
    // No navegar manualmente
    // App.js mostrará Login/Register automáticamente si user es null
  }, 1500);
  return () => clearTimeout(t);
}, []);



return (
<View style={styles.container}>
<Image source={require('../../../assets/Logo.png')} style={styles.logo} />
<Text style={styles.title}>Mi App - Evaluación Módulo 5</Text>
</View>
);
}


const styles = StyleSheet.create({
container: {flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'},
logo: {width:120,height:120,marginBottom:20,resizeMode:'contain'},
title: {fontSize:20,fontWeight:'700'}
});