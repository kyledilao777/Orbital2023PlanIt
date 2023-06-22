import { View, StyleSheet } from "react-native";
import { Text, Button } from 'react-native-paper';
import { Link, Stack } from "expo-router";
import { useLayoutEffect } from "react";
import { useState } from "react";

export default function HomeScreen() {
    const [count, setCount] = useState(0);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.mainText}>You currently have no timetable.</Text>
            <Link href="../(newTable)/addTimetable">
                <Button 
                    textColor="#272727"
                    mode='contained' 
                    style={styles.button}>Add a new timetable</Button>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    mainText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        width: '70%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FADF70'
    }
});
