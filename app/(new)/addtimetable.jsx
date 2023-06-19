import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { Link } from "expo-router";

export default function NewTimetable() {
    const [title, setTitle] = useState('');

    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.header}>Name your timetable:</Text>
        <TextInput style={styles.textInput} value={title} onChangeText={setTitle} />
        <Link href = "/existingtimetable">
            <Button 
                textColor='black'
                mode='contained'
                style={styles.createTimetable}>Create</Button>
        </Link>
    </View>;
}

const styles = StyleSheet.create({
    header:{
        marginRight: 73,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: 'bold'
    },

    textInput: {
        width: '75%',
        height: 45,
        marginTop: 10,
        marginBottom: 50,
        backgroundColor: 'transparent',
        fontSize: 20,
    },
    createTimetable: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FADF70',
    },
});