import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Switch } from 'react-native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import * as Icon from "react-native-feather";
import { MMKV } from 'react-native-mmkv';
import {PermissionsAndroid} from 'react-native';

export const storage = new MMKV();

const MOTIVATION_TOPIC = 'motivational_messages';

const AccountSettingsScreen = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(storage.getBoolean("agreeTerms") || false);
  const [motivationMessages, setMotivationMessages] = useState(storage.getBoolean("motivationMessages") || false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
    if (currentUser?.displayName) {
      setDisplayName(currentUser.displayName);
    }

    // Check initial subscription status when component mounts
    checkTopicSubscription();
  }, []);

  const checkTopicSubscription = async () => {
    try {
      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await auth().currentUser.updateProfile({
        displayName: displayName,
      });
      Alert.alert("Uspešno", "Profil je bil posodobljen.");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Napaka", "Profila ni bilo mogoče posodobiti.");
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Sprememba gesla",
      "Poslali vam bomo povezavo za spremembo gesla na vaš e-poštni naslov.",
      [
        { text: "Prekliči", style: "cancel" },
        {
          text: "Pošlji",
          onPress: async () => {
            try {
              await auth().sendPasswordResetEmail(user.email);
              Alert.alert("Uspešno", "E-pošta za ponastavitev gesla je bila poslana.");
            } catch (error) {
              Alert.alert("Napaka", "E-pošte ni bilo mogoče poslati.");
              console.error("Error sending reset email:", error);
            }
          },
        },
      ]
    );
  };

  // Handle agreement toggle
  const toggleAgreement = () => {
    const newValue = !agreeTerms;
    setAgreeTerms(newValue);
    storage.set("agreeTerms", newValue); // Save to MMKV
  };

  const toggleMotivationMessages = async () => {
    const newValue = !motivationMessages;
    
    try {
      if (newValue) {


      /*   const permission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS); */
       
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Dovoljenje zavrnjeno", "Za prejem motivacijskih sporočil morate omogočiti obvestila.");
          return;
        }
        
       /*  if (!permission) {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert("Dovoljenje zavrnjeno", "Za prejem motivacijskih sporočil morate omogočiti obvestila.");
            return;
          }
        } */

        await messaging().subscribeToTopic(MOTIVATION_TOPIC).then(() => {
          console.log('Subscribed to topic!');}
        );
        Alert.alert('Naročeno', 'Naročeni ste na motivacijska sporočila.');
      } else {
        await messaging().unsubscribeFromTopic(MOTIVATION_TOPIC);
        Alert.alert('Odjavljeno', 'Odjavljeni ste od motivacijskih sporočil.');
      }

      setMotivationMessages(newValue);
      storage.set("motivationMessages", newValue);
    } catch (error) {
      console.error('Error toggling motivation messages:', error);
      Alert.alert('Napaka', 'Prišlo je do napake pri spreminjanju nastavitev.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Nalaganje podatkov...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon.User size={64} color="#000" />
        <Text style={styles.title}>Nastavitve računa</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>E-pošta:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Ime:</Text>
        {isEditing ? (
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
            autoFocus
          />
        ) : (
          <Text style={styles.value}>{displayName || 'Ni nastavljeno'}</Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (isEditing) {
              handleUpdateProfile();
            } else {
              setIsEditing(true);
            }
          }}
          style={styles.iconButton}
        >
          <Icon.Edit2 size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Spremeni geslo</Text>
      </TouchableOpacity>

      {/* Terms Agreement Toggle */}
      <View style={styles.agreementContainer}>
        <Text style={styles.label}>Strinjam se s pogoji</Text>
        <Switch value={agreeTerms} onValueChange={toggleAgreement} />
      </View>

      <View style={styles.agreementContainer}>
        <Text style={styles.label}>Motivacijska sporočila</Text>
        <Switch value={motivationMessages} onValueChange={toggleMotivationMessages} />
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  label: {
    width: 150,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    borderRadius: 4,
  },
  iconButton: {
    padding: 5,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  agreementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: "space-between"
  }
});

export default AccountSettingsScreen;