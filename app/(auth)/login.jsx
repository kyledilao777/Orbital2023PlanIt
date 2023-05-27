import { Image, View, StyleSheet } from "react-native";
import { useState } from "react";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { Link } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // asynchronous function; can call "await"
    const handleSubmit = async () => {
        setErrMsg('');
        if (email == '') {
            setErrMsg("email cannot be empty!")
            return;
        }
        if (password == '') {
            setErrMsg("password cannot be empty!")
            return;
        }
        setLoading(true); // after email and password are entered
        const { error } = await supabase.auth.signInWithPassword({ email, password }); // guide on supabase website
        setLoading(false); // wait for supabase to finish then set loading to "false"
        if (error) {
            setErrMsg(error.message);
            return;
        }
    }
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
            <View style={styles.imageContainer}>
                <Text style={styles.planitText}>Plan It!</Text>
                <Text style={styles.syncText}>Sync. Choose. Add.</Text>
                <Image
                    source={require('./images/login-icon.png')}
                    style={styles.image}
                />
            </View>
            <TextInput
                placeholder="Username"
                placeholderTextColor='#3C3C38'
                borderRadius='35'
                backgroundColor='#F4C06B'
                autoCapitalize='none'
                textContentType='emailAddress'
                value={email}
                onChangeText={setEmail}
                underlineColor='transparent'
                activeUnderlineColor='transparent'
                style={styles.emailInput} />
            <TextInput
                secureTextEntry
                placeholder="Password"
                placeholderTextColor='#3C3C38'
                borderRadius='35'
                backgroundColor='#F4C06B'
                autoCapitalize='none'
                textContentType='password'
                value={password}
                onChangeText={setPassword}
                underlineColor='transparent'
                activeUnderlineColor='transparent'
                caretHidden={false}
                style={styles.passwordInput} />
            <Button mode='contained' onPress={handleSubmit} style={styles.signInButton}>Sign In</Button>
            {errMsg !== "" && <Text>{errMsg}</Text>}
            {loading && <ActivityIndicator />}
            <Link href="/register">
                <Button 
                    mode='text'
                    style={styles.signUpButton}>or Sign Up</Button>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    planitText: {
        fontSize: 45,
        fontWeight: 'bold',
        paddingBottom: 10,
    },
    syncText: {
        fontSize: 20,
        paddingBottom: 30,
    },
    emailInput: {
        width: '80%',
        height: 45,
        marginBottom: 10,
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        fontSize: 14.5,
    },
    passwordInput: {
        width: '80%',
        height: 45,
        marginBottom: 10,
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        fontSize: 14.5,
    },
    signInButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    // need edit
    signUpButton: {
    },
    image: {
        width: 140,
        height: 140,
    },
    imageContainer: {
        width: 250,
        height: 250,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 30
    }
});