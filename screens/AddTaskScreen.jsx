import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

import { useNavigation, useRoute } from '@react-navigation/native';


import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

const AddTaskScreen = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Delo");
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderDate, setReminderDate] = useState(new Date());
  const [openDueDate, setOpenDueDate] = useState(false);
  const [openReminderDate, setOpenReminderDate] = useState(false);

  const navigation = useNavigation();

  const handleAddTask = () => {
    const newTask = { name, description, category, dueDate, reminderDate };
    console.log("Zgodil sem se 🔥🔥🔥🔥🔥🔥")
    navigation.popTo ("HomeScreen", { NovoOpravilo: newTask });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dodaj novo opravilo</Text>

      <TextInput
        style={styles.input}
        placeholder="Naziv"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Opis"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <View style={styles.pickerContainer}>
        <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={styles.picker}>
          <Picker.Item label="Služba" value="Služba" />
          <Picker.Item label="Hobiji" value="Hobiji" />
          <Picker.Item label="Nakupovanje" value="Nakupovanje" />
          <Picker.Item label="Dom" value="Dom" />
          <Picker.Item label="Šola" value="Šola" />
          <Picker.Item label="Zdravje" value="Zdravje" />
          <Picker.Item label="Finance" value="Finance" />
          <Picker.Item label="Družina" value="Družina" />
        </Picker>
      </View>

      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenDueDate(true)}>
        <Text style={styles.dateButtonText}>📅 Datum zapadlosti</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{dueDate.toDateString()}</Text>
      <DatePicker modal open={openDueDate} mode='date' date={dueDate} onConfirm={(date) => {
        setOpenDueDate(false);
        setDueDate(date);
      }} onCancel={() => setOpenDueDate(false)} />

      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenReminderDate(true)}>
        <Text style={styles.dateButtonText}>⏰ Datum opomnika</Text>
      </TouchableOpacity>
      <Text style={styles.dateText}>{reminderDate.toDateString()}</Text>
      <DatePicker modal open={openReminderDate} mode='date' date={reminderDate} onConfirm={(date) => {
        setOpenReminderDate(false);
        setReminderDate(date);
      }} onCancel={() => setOpenReminderDate(false)} />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Dodaj opravilo!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  picker: {
    color: '#fff',
  },
  dateButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#bbb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 30,
  },
  addButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AddTaskScreen;