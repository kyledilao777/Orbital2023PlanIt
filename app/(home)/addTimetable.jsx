import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
import { useRouter } from "expo-router";


export default function NewTodo() {
    const [title, setTitle] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        setErrMsg('');
        if (title === '') {
            setErrMsg('Title cannot be empty! :(')
            return;
        }
        setLoading(true);
        const { error } = await supabase.from('events').insert({ event_name: title, user_id: user.id }).select().single();

        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }
        setLoading(false);
        router.push('/');
    }

    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: </Text>
        <TextInput value={title} onChangeText={setTitle} />
        {errMsg !== '' && <Text>{errMsg}</Text>}
        <Button 
                textColor='black'
                mode='contained'
                style={styles.createEvent} 
                onPress={handleSubmit}>Create Event</Button>
        {loading && <ActivityIndicator />}
    </View>;
}

const styles = StyleSheet.create({
    createEvent: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FADF70',
    },
});