import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import auth from '@react-native-firebase/auth';
import * as Icon from "react-native-feather";

const AccountSettingsScreen = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const currentUser = auth().currentUser;
    setUser(currentUser);
    if (currentUser && currentUser.displayName) {
      setDisplayName(currentUser.displayName);
    }
  }, []);

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
    width: 80,
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
});

export default AccountSettingsScreen;