import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.js';


export default function Login({ navigation }) {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);


const onLogin = async () => {
  if (!email || !password) return Alert.alert('Error', 'Completa los campos');
  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email, password);
    // ❌ No hagas navigation.replace aquí
    // El efecto onAuthStateChanged en App.js se encargará de redirigir al Home automáticamente
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};


return (
<View style={styles.container}>
<Text style={styles.title}>Iniciar sesión</Text>
<TextInput placeholder="Correo" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
<TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
<TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
<Text style={styles.btnText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
</TouchableOpacity>
<TouchableOpacity onPress={() => navigation.navigate('Register')}>
<Text style={{marginTop:16}}>¿No tienes cuenta? Regístrate</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: {flex:1,justifyContent:'center',alignItems:'center',padding:20,backgroundColor:'#fff'},
title: {fontSize:24,fontWeight:'700',marginBottom:20},
input: {width:'100%',padding:12,borderWidth:1,borderRadius:8,marginBottom:12},
button: {width:'100%',padding:14,backgroundColor:'#10b981',borderRadius:8,alignItems:'center'},
btnText: {color:'#fff',fontWeight:'600'}
});