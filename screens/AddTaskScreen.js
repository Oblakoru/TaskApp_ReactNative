import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';

const AddTaskScreen = ({ route }) => {
  const { onAddTask } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Work');
  const [dueDate, setDueDate] = useState(new Date());
  const [reminderDate, setReminderDate] = useState(new Date());
  const [openDueDate, setOpenDueDate] = useState(false);
  const [openReminderDate, setOpenReminderDate] = useState(false);

  const navigation = useNavigation();

/*   const handleAddTask = () => {
    const newTask = { name, description, category, dueDate, reminderDate };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    navigation.goBack();
  }; */

  const handleAddTask = () => {
    const newTask = { name, description, category, dueDate, reminderDate };
    onAddTask(newTask);  
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Delo" value="Delo" />
          <Picker.Item label="Hobiji" value="Hobiji" />
          <Picker.Item label="Nakupovanje" value="Nakupovanje" />
        </Picker>
      </View>
      <View style={styles.dateSelector}>
        <Button title="Select Due Date" onPress={() => setOpenDueDate(true)} />
        <Text style={styles.dateText}>Selected Due Date: {dueDate.toDateString()}</Text>
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
      <View style={styles.dateSelector}>
        <Button title="Select Reminder Date" onPress={() => setOpenReminderDate(true)} />
        <Text style={styles.dateText}>Selected Reminder Date: {reminderDate.toDateString()}</Text>
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
      <Button title="Add Task" onPress={handleAddTask} style={styles.addButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#495057',
  },
  dateSelector: {
    marginBottom: 20,
  },
  dateText: {
    marginTop: 5,
    fontSize: 14,
    color: '#6c757d',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default AddTaskScreen;
