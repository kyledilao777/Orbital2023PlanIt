import { useState } from 'react';
import { StyleSheet} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button } from 'react-native-paper';

export default function App() {
  const [counter, setCounter] = useState(0);
  const onIncrementPressed = () => {
    setCounter((previousValue) => { return previousValue + 1 });
    console.log(`increment pressed ${counter}`);
  }
  const onDecrementPressed = () => {
    setCounter(counter - 1); // a function to tell react to update state
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text>Counter #{counter}</Text>
        <Button mode='contained' onPress={ onIncrementPressed }>Increment</Button>
        <Button mode='contained' onPress={ onDecrementPressed }>Decrement</Button>
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