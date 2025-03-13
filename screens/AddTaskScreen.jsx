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
    navigation.navigate("Home", { NovoOpravilo: newTask });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Task</Text>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Task Name"
        placeholderTextColor="#6c757d"
        value={name}
        onChangeText={setName}
      />

      {/* Description Input */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Task Description"
        placeholderTextColor="#6c757d"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Category Picker */}
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Delo (Work)" value="Delo" />
          <Picker.Item label="Hobiji (Hobbies)" value="Hobiji" />
          <Picker.Item label="Nakupovanje (Shopping)" value="Nakupovanje" />
        </Picker>
      </View>

      {/* Due Date Picker */}
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setOpenDueDate(true)}
        >
          <Text style={styles.dateButtonText}>Select Due Date</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>📅 {dueDate.toDateString()}</Text>
        <DatePicker
          modal
          open={openDueDate}
          date={dueDate}
          onConfirm={(date) => {
            setOpenDueDate(false);
            setDueDate(date);
          }}
          onCancel={() => setOpenDueDate(false)}
        />
      </View>

      {/* Reminder Date Picker */}
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setOpenReminderDate(true)}
        >
          <Text style={styles.dateButtonText}>Select Reminder Date</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>⏰ {reminderDate.toDateString()}</Text>
        <DatePicker
          modal
          open={openReminderDate}
          date={reminderDate}
          onConfirm={(date) => {
            setOpenReminderDate(false);
            setReminderDate(date);
          }}
          onCancel={() => setOpenReminderDate(false)}
        />
      </View>

      {/* Add Task Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ced4da",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#495057",
  },
  dateContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  dateButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    marginTop: 5,
    fontSize: 16,
    color: "#6c757d",
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddTaskScreen;