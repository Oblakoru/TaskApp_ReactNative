import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleAddTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => navigation.navigate('Details', { task: item })}
          >
            <View style={styles.taskContent}>
              <Text>{item.name}</Text>
              <Text>{item.dueDate.toDateString()}</Text>
            </View>
            <Button title="Delete" onPress={() => handleDeleteTask(index)} />
          </TouchableOpacity>
        )}
      />
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask', { onAddTask: handleAddTask })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  taskContent: {
    flex: 1,
  },
});

export default HomeScreen;
