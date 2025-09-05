import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebase';

// Screens
import LoginScreen from './src/screens/Login/Login';
import RegisterScreen from './src/screens/Register/Register';
import HomeScreen from './src/screens/Home/Home';
import EditProfileScreen from './src/screens/EditProfile/EditProfile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [showSplash, setShowSplash] = useState(true); // Control splash screen

  // Splash screen duration
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500); // 1.5 segundos
    return () => clearTimeout(timer);
  }, []);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsubscribe;
  }, []);

  // Mostrar loader mientras inicializa Firebase o splash activo
  if (initializing || showSplash) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Image source={require('./assets/Logo.png')} style={{ width: 120, height: 120, marginBottom: 20 }} />
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // Auth stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // App stack
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
