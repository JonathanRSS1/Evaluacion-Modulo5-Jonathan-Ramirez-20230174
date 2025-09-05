import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!name || !email || !password)
      return Alert.alert('Error', 'Completa los campos requeridos');
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const u = userCred.user;
      // update displayName
      await updateProfile(u, { displayName: name });
      // save extra info in Firestore
      await setDoc(doc(firestore, 'users', u.uid), {
        name,
        email,
        title,
        gradYear,
        createdAt: new Date().toISOString(),
      });
      Alert.alert('Éxito', 'Cuenta creada');
      navigation.replace('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Registro</Text>
      <TextInput placeholder="Nombre" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Correo" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Contraseña" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput placeholder="Título universitario" style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput placeholder="Año de graduación" style={styles.input} value={gradYear} onChangeText={setGradYear} keyboardType="numeric" />
      
      <TouchableOpacity style={styles.button} onPress={onRegister} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Creando...' : 'Registrar'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ marginTop: 16 }}>¿Ya tienes cuenta? Iniciar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: '700', marginBottom: 20 },
  input: { width: '100%', padding: 12, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  button: { width: '100%', padding: 14, backgroundColor: '#3b82f6', borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '600' }
});
