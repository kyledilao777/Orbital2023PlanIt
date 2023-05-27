import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';

export default function Register() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [job, setJob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleSubmit = async () => {
        if (email == '') {
            setErrMsg("email cannot be empty")
            return;
        }
        if (password == '') {
            setErrMsg("password cannot be empty")
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password }); // call signup instead
        setLoading(false);
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Text style={styles.signUpHeader}>Welcome To Plan It!</Text>
            <Text style={styles.subHeader}>Begin your journey with Plan It! today.</Text>
            <TextInput
                autoCapitalize='none'
                placeholder="First Name"
                placeholderTextColor='#9E9E9E'
                textContentType='givenName'
                value={fname}
                onChangeText={setFname}
                style={styles.register} />
            <TextInput
                autoCapitalize='none'
                placeholder="Last Name"
                placeholderTextColor='#9E9E9E'
                textContentType='familyName'
                value={lname}
                onChangeText={setLname}
                style={styles.register} />
            <TextInput
                autoCapitalize='none'
                placeholder="Occupation"
                placeholderTextColor='#9E9E9E'
                textContentType='jobTitle'
                value={job}
                onChangeText={setJob}
                style={styles.register} />
            <TextInput
                autoCapitalize='none'
                placeholder="Username"
                placeholderTextColor='#9E9E9E'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                style={styles.register} />
            <TextInput
                secureTextEntry
                autoCapitalize='none'
                placeholder="Password"
                placeholderTextColor='#9E9E9E'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                style={styles.register} />
            <Button 
                textColor='black'
                mode='contained'
                style={styles.createAcc} 
                onPress={handleSubmit}>Create Account</Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
        </View>
    );
}

const styles = StyleSheet.create({
    signUpHeader: {
        fontWeight: 'bold', 
        fontSize: 30, 
        alignItems: 'center',
        paddingBottom: 5,
    },
    subHeader: {
        marginBottom: 20,

    },
    register: {
        width: '80%',
        height: 50,
        backgroundColor: 'transparent',
        marginTop: 5, 
        marginBottom: 5,
        paddingHorizontal: 0,
        fontSize: 14.5,
    },
    createAcc: {
        marginTop: 20,
        backgroundColor: '#FADF70',
    }
});

/* native layouts
- stack: every layout created is pushed on top of each other; if we go back
the layout is popped off the stack
*/