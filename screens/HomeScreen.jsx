import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

// Za swipeable
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';


// Za firestore 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {

  //const user = auth().currentUser;

  const [tasks, setTasks] = useState([]);

  const navigation = useNavigation();

  // Da se lahk prebere nov task iz AddTaskScreen
  const route = useRoute();

  const confirmDeleteTask = (id) => {
    Alert.alert(
      "Potrditev brisanja",
      "Ali ste prepričani, da želite izbrisati to opravilo?",
      [
        { text: "Prekliči", style: "cancel" },
        { text: "Izbriši", onPress: () => handleDeleteTask(id), style: "destructive" }
      ]
    );
  };

  /*  const handleDeleteTask = (index) => {
     setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
   }; */


  const handleDeleteTask = (taskId) => {
    const user = auth().currentUser;
    if (!user) return;

    firestore()
      .collection('users')
      .doc(user.uid)
      .collection('tasks')
      .doc(taskId)
      .delete()
      .then(() => {
        console.log(`🗑️ Task ${taskId} deleted from Firestore`);

        // Remove task from local state
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error("🔥 Error deleting task:", error));
  };

  // Za dodajanje
  useEffect(() => {
    const user = auth().currentUser;
    if (route.params?.NovoOpravilo && user) {
      console.log("🔥 Adding task to Firestore:", route.params.NovoOpravilo);

      const newTask = {
        ...route.params.NovoOpravilo,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      firestore()
        .collection('users')
        .doc(user.uid)
        .collection('tasks')
        .add(newTask)
        .then((docRef) => {
          console.log("✅ Task added with ID:", docRef.id);

          // Dodam ID v nov task
          setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...newTask }]);
        })
        .catch(error => console.error("🔥 Error adding task:", error));

      navigation.setParams({ NovoOpravilo: null });
    }
  }, [route.params?.NovoOpravilo]);

  useEffect(() => {
    const user = auth().currentUser; // Get the current user

    if (!user) return;

    console.log("📡 Setting up real-time listener for tasks...");

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('tasks')
      .orderBy('createdAt', 'desc') // Get tasks in descending order
      .onSnapshot(snapshot => {
        const fetchedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("🔥 Fetched tasks from Firestore:", fetchedTasks);
        setTasks(fetchedTasks);
      });

    return () => unsubscribe(); // Cleanup listener when unmounting
  }, []);

  const renderRightActions = (progress, dragX, index) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: dragX.value }],
    }));

    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity style={styles.rightAction} onPress={() => confirmDeleteTask(index)}>
          <Text style={styles.rightActionText}>Izbriši</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            friction={2}
            rightThreshold={40}
            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}
            onSwipeableOpen={() => confirmDeleteTask(item.id)}
          >
            <TouchableOpacity
              style={styles.taskItem}
              onPress={() => navigation.navigate('Details', { task: item })}
            >
              <View style={styles.taskContent}>
                <Text>{item.name}</Text>
                {/*   <Text>{item.dueDate.toDateString()}</Text> */}
                <Text>{item.dueDate ? new Date(item.dueDate._seconds * 1000).toDateString() : "No Date"}
                </Text>
              </View>
            </TouchableOpacity>
          </ReanimatedSwipeable>
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
  rightActionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightAction: {
    width: 80,
    height: '100%',
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  separator: {
    width: '100%',
    borderTopWidth: 1,
  },
});

export default HomeScreen;
