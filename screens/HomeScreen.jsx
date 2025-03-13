import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const HomeScreen = () => {

  // Začasno shranjevanje taskov
  const [tasks, setTasks] = useState([]);

  const navigation = useNavigation();

  // Da se lahk prebere nov task iz AddTaskScreen
  const route = useRoute();

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Ko se route.params.NovoOpravilo spremeni se doda nov task
  useEffect(() => {
    if (route.params?.NovoOpravilo) {
      setTasks((prevTasks) => [...prevTasks, route.params.NovoOpravilo]);
      navigation.setParams({ NovoOpravilo: null })
    }
  }, [route.params?.NovoOpravilo])

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
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTask(index)}>
              <Text style={styles.deleteButtonText}>Izbriši</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddTask")}>
        <Text style={styles.buttonText}>Dodaj Opravilo</Text>
      </TouchableOpacity>
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
    marginVertical: 8,  
    backgroundColor: '#ffffff', 
    borderRadius: 10,   
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4, 
  },
  taskContent: {
    flex: 1,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  deleteButton: {
    backgroundColor: "red", 
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  deleteButtonText: {
    color: "white", 
    fontWeight: "bold",
  },
});


export default HomeScreen;
