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


  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }


  function loginUser() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('Home');
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

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
        <View style={styles.container}>
          <Text>Tukaj se lahko prijaviš</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput placeholder="Geslo" value={password} onChangeText={setPassword} />
          <TouchableOpacity onPress={() => loginUser()}>
            <Text>Prijavi se</Text>
          </TouchableOpacity>
        </View>
    );
  }
  
  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}

export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }

})
