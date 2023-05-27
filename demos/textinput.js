import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button } from 'react-native-paper';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TextInput value={username} onChangeText={(text) => { setUsername(text) }}/>
        <TextInput value={password} onChangeText={(text) => { setPassword(text) }}/>
        <Text>{username}</Text>
        <Button onPress={() => {
          console.log(username);
        }}>Submit</Button>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})