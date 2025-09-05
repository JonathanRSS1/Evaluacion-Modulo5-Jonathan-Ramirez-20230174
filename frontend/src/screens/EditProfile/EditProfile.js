import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, firestore } from '../../config/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export default function EditProfile({ navigation, route }) {
  const current = route.params?.userData || {};
  const [name, setName] = useState(current.name || '');
  const [title, setTitle] = useState(current.title || '');
  const [gradYear, setGradYear] = useState(current.gradYear || '');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setLoading(true);
    try {
      const u = auth.currentUser;
      if (!u) throw new Error('No hay usuario conectado');

      // Actualizamos nombre en Firebase Auth
      await updateProfile(u, { displayName: name });

      // Actualizamos Firestore
      const userRef = doc(firestore, 'users', u.uid);
      await updateDoc(userRef, { name, title, gradYear });

      Alert.alert('Éxito', 'Información actualizada');
      navigation.goBack(); // Al regresar, Home se actualizará automáticamente
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar información</Text>
      <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Título universitario" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Año de graduación" style={styles.input} value={gradYear} onChangeText={setGradYear} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={onSave} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  button: { width: '100%', padding: 14, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' }
});
