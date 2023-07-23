import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { Link, useRouter } from "expo-router";

export default function NewTimetable() {
    const [title, setTitle] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async () => {
        setErrMsg('');
        if (title === '') {
            setErrMsg('Title cannot be empty')
            return;
        }
        setLoading(true);
        
        const { error } = await supabase.from('timetables').insert({ 
            timetable_name: title, 
            user_id: user.id
        }).select().single();

        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }
        setLoading(false);
        router.push('../../(tabsExisting)/existing');
    }

    return (
        <View style={{ backgroundColor:"white", flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.header}> Name your timetable:</Text>
            <TextInput style={styles.textInput} value={title} onChangeText={setTitle} />
            {errMsg !== '' && <Text>{errMsg}</Text>}
            <Button onPress={() => handleSubmit()} textColor="black" mode="contained" style={styles.button}> Create </Button>
            {loading && <ActivityIndicator />}
            
    </View>);
}

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FADF70',
    },
    header:{
        marginRight: 73,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: 'bold'
    },

    textInput: {
        width: '80%',
        height: 45,
        marginTop: -5,
        marginBottom: 20,
        backgroundColor: 'transparent',
        paddingHorizontal:-20,
        fontSize: 20,
    },
    create: {
        fontSize: 20,
        color: "black",
    },
});