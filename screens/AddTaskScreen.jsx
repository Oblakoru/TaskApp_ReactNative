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
    navigation.popTo("Home", { NovoOpravilo: newTask });
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
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    height: 60,
    backgroundColor: '#fff',
  },
  picker: {
    height: 60,
    width: '100%',
  },
  dateButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  dateText: {
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AddTaskScreen;