import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../../config/firebase.js';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

export default function Home({ navigation }) {
  const [userData, setUserData] = useState(null);

  // Se ejecuta cada vez que la pantalla recibe el foco
  useFocusEffect(
    React.useCallback(() => {
      const fetch = async () => {
        try {
          const u = auth.currentUser;
          if (!u) return;
          const snap = await getDoc(doc(firestore, 'users', u.uid));
          if (snap.exists()) setUserData(snap.data());
          else setUserData({ name: u.displayName, email: u.email });
        } catch (err) {
          console.error(err);
        }
      };
      fetch();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // El efecto onAuthStateChanged en App.js se encargará de mostrar Login/Register
    } catch (err) {
      Alert.alert('Error', 'No se pudo cerrar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido,</Text>
      <Text style={styles.name}>{userData?.name || 'Usuario'}</Text>
      <Text style={styles.info}>Correo: {userData?.email}</Text>
      <Text style={styles.info}>Título: {userData?.title || 'No especificado'}</Text>
      <Text style={styles.info}>Año graduación: {userData?.gradYear || 'No especificado'}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile', { userData })}
      >
        <Text style={styles.btnText}>Editar información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ef4444' }]}
        onPress={handleLogout}
      >
        <Text style={styles.btnText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  welcome: { fontSize: 18 },
  name: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  info: { fontSize: 16, marginBottom: 4 },
  button: { width: '100%', padding: 14, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnText: { color: '#fff', fontWeight: '600' }
});
