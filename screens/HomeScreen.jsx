import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRef } from 'react';

// Za swipeable
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  useAnimatedStyle,
} from 'react-native-reanimated';

// Za firestore 
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';



const HomeScreen = () => {

  const swipeableRefs = useRef({});
  const navigation = useNavigation();
  const route = useRoute();

  const [tasks, setTasks] = useState([]);


  const confirmDeleteTask = (id) => {
    Alert.alert(
      "Potrditev brisanja",
      "Ali ste prepričani, da želite izbrisati to opravilo?",
      [
        { text: "Prekliči", style: "cancel", onPress: () => swipeableRefs.current[id]?.close()},
        { text: "Izbriši", onPress: () => handleDeleteTask(id), style: "destructive" }
      ]
    );
  };


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
        })
        .catch(error => console.error("🔥 Error adding task:", error));

      navigation.setParams({ NovoOpravilo: null });
    }
  }, [route.params?.NovoOpravilo]);


  useEffect(() => {
    const user = auth().currentUser; 

    if (!user) return;

    console.log("📡 Setting up real-time listener for tasks...");

    const unsubscribe = firestore()
      .collection('users')
      .doc(user.uid)
      .collection('tasks')
      .orderBy('createdAt', 'desc') 
      .onSnapshot(snapshot => {

        if (!snapshot || !snapshot.docs) {
          console.error("🔥 Firestore snapshot is undefined or empty");
          return;
        }

        const fetchedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("🔥 Fetched tasks from Firestore:", fetchedTasks);
        setTasks(fetchedTasks);
      });

    return () => unsubscribe(); 
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
      <Text style={styles.title}>Seznam Opravil</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReanimatedSwipeable
            friction={1}
            rightThreshold={20}
            overshootRight={false}
            overshootLeft={false}
            ref={(ref) => (swipeableRefs.current[item.id] = ref)}
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
    backgroundColor: '#0A0A0A',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    shadowRadius: 4,
  },
  taskText: {
    color: '#000', 
    fontSize: 16,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginVertical: 30,
  },
  buttonText: {
    color: "#000",
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
    width: "100%",
    height: '80%',
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 10,
  },
  rightActionText: {
    color: '#fff',
    fontSize: 16,
    marginRight: 20,
    fontWeight: 'bold',
  },
  taskText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreen;

