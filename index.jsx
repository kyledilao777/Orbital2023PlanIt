import { View, StyleSheet } from "react-native";
import { Text, Button } from 'react-native-paper';
import { Link } from "expo-router";

export default function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.mainText}>You currently have no timetable.</Text>
            <Link href="/(home)/addTimetable">
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
/*
import { Alert, FlatList, Pressable, View } from 'react-native';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { Checkbox, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
    const [todos, setTodos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchTodos() {
        setRefreshing(true);
        // "from" allows us to access stuff in the database
        let { data } = await supabase.from('todos').select('*'); // list of data from the app
        setRefreshing(false);
        setTodos(data);
    }

    useEffect(() => {
        fetchTodos(); // function can be async
    }, []); // only run once when the components are rendered

    useEffect(() => {
        if (refreshing) {
            fetchTodos();
            setRefreshing(false);
        }
    }, [refreshing]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
                data={todos} // need to get the todos data from the online database
                renderItem={({ item }) => <TodoItem todo={item} />}
                onRefresh={() => setRefreshing(true)}
                refreshing={refreshing}
            />
        </View>
    );
}

function TodoItem({ todo }) {
    const [checked, setChecked] = useState(todo.is_complete)
    const router = useRouter();
    const handleCheckboxPress = async () => {
        const { error } = await supabase.from('todos').update({ is_complete: !checked }).eq('id', todo.id)
        if (error != null) {
            Alert.alert(error.message);
        }
        setChecked(!checked)
    }
    const handleItemPress = () => {
        router.push({ pathname: '/detailedTodo', params: { id: todo.id } }) // similar to directing to a link
    }
    return (
        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleItemPress}>
            <Text>{todo.task}</Text>
            <Checkbox.Android status={checked ? 'checked' : 'unchecked'} onPress={handleCheckboxPress} />
        </Pressable>
    )
}
*/