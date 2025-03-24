import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const LoginScreen = () => {

  const navigation = useNavigation();

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);

    if (user) {
      navigation.replace('MainTabs');
    }
  }


  function loginUser() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.replace('MainTabs');
        console.log('User signed in successfully!');
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert(
                "Napaka pri prijavi",
                "No user found with this email!",
                [
                  { text: "Prekliči", style: "cancel" },
                ]
              );

          console.log('No user found with this email!');
        }
        if (error.code === 'auth/wrong-password') {
          console.log('Incorrect password!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('Invalid email address!');
        }
        console.error(error);
      });
  }



  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CheckMate</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          placeholderTextColor="#888"
          value={email} 
          onChangeText={setEmail} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Geslo" 
          placeholderTextColor="#888"
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={loginUser}>
          <Text style={styles.buttonText}>Prijavi se</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '90%',
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
