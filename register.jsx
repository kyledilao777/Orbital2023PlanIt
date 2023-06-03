import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Image, TouchableOpacity } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

export default function Register() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [job, setJob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [image, setImage] = useState(null);

    const handleAddImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    }

    const handleSubmit = async () => {
        if (fname === '') {
            setErrMsg('Name cannot be empty');
            return;
        }
        if (job === '') {
            setErrMsg('Please indicate your current occupation');
            return;
        }
        if (email === '') {
            setErrMsg('Email cannot be empty');
            return;
        }
        if (password === '') {
            setErrMsg('Password cannot be empty');
            return;
        }
        setLoading(true);

        let uploadedImage = null;
        if (image !== null) {
            const { data, error } = await supabase.storage
                .from('images')
                .upload(`${new Date().getTime()}`, { // explore ulid
                    uri: image, // need to have this format
                    type: 'jpg',
                    name: 'name.jpg',
                });

            if (error != null) {
                console.log(error);
                setLoading(false);
                setErrMsg(error.message);
                return;
            }

            const { data: { publicUrl } } = await supabase.storage
                .from('images')
                .getPublicUrl(data.path);

            uploadedImage = publicUrl;
        }

        const { user, error } = await supabase.auth.signUp(
            { email, password },
            {
                data: {
                    fname, // doesn't work yet
                },
            }
        );

        if (error) {
            setLoading(false);
            setErrMsg(error.message);
            return;
        }

        if (user) {
            const { data: user, error: insertError } = await supabase
                .from('images')
                .insert({ user_id: user.id, image_url: uploadedImage })
                .single();

            if (insertError) {
                setLoading(false);
                setErrMsg(insertError.message);
                return;
            }
        }

        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
                    <Text style={styles.signUpHeader}>Welcome To Plan It!</Text>
                    <Text style={styles.subHeader}>Begin your journey with Plan It! today.</Text>
                    {image ? (
                        <TouchableOpacity onPress={handleAddImage}>
                            <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
                        </TouchableOpacity>
                    ) : (
                        <Button
                            textColor='black'
                            mode='contained'
                            style={styles.addImage}
                            onPress={handleAddImage}>+</Button>
                    )}
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
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    addImage: {
        borderRadius: 0,
        width: 150,
        height: 150,
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
    },
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