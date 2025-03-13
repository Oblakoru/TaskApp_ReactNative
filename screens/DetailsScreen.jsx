import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DetailsScreen = ({ route }) => {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Naziv:</Text>
      <Text>{task.name}</Text>
      <Text style={styles.label}>Opis:</Text>
      <Text>{task.description}</Text>
      <Text style={styles.label}>Kategorija:</Text>
      <Text>{task.category}</Text>
      <Text style={styles.label}>Rok:</Text>
      <Text>{task.dueDate.toDateString()}</Text>
      <Text style={styles.label}>Datum opomnika:</Text>
      <Text>{task.reminderDate.toDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default DetailsScreen;
