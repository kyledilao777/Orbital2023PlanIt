import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { View, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Text, TextInput, ActivityIndicator, Button } from 'react-native-paper';
import * as ImagePicker from "expo-image-picker"

function ImageViewer({ placeholderImageSource, selectedImage }) {
    const imageSource = selectedImage !== null
      ? { uri: selectedImage }
      : placeholderImageSource;
  
    return <Image source={imageSource} style={styles.image} />;
}

export default function Register() {
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [job, setJob] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const router  = useRouter();

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
        
        const { error1 } = await supabase.auth.signUp({ email, password }); // call signup instead

        setLoading(false);

        if (error1) {
            setErrMsg(error1.message);
            return;
        }

        Alert.alert(
            "Please verify your email.",
            ""
        )
    }

    const addProfile = async () => {
        setErrMsg('');
        if (fname === '') {
            setErrMsg('First name cannot be empty')
            return;
        }

        if (lname === '') {
            setErrMsg('Last name cannot be empty')
            return;
        }

        if (job === '') {
            setErrMsg('Occupation cannot be empty')
            return;
        }

        const { error } = await supabase.from('profiles').insert({
            first_name: fname,
            last_name: lname,
            occupation: job,
            email: email,
            photo_url: selectedImage
        });

        setLoading(true);
            
        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message);
            return;
        }
        
        setLoading(false);
        router.push('../(tabsEmpty)/empty');
    }

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }

    };

    const imageSource = selectedImage !== null
    ? { uri: selectedImage }
    : require('./images/user.jpeg');

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
            <Text style={styles.signUpHeader}>Welcome To Plan It!</Text>
            <Text style={styles.subHeader}>Begin your journey with Plan It! today.</Text>
            <TouchableOpacity onPress={pickImageAsync}>
                <Image style={styles.imagepicker} source={imageSource}/>
            </TouchableOpacity>
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
                placeholder="Email"
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
                onPress={() => { addProfile(); handleSubmit();} }>Create Account</Button>
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
        marginTop: -50,
        paddingBottom: 5,
    },
    subHeader: {
        marginBottom: 10,

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
    },
    imagepicker: {
        height:130,
        width:130,
        marginTop:10,
        marginBottom: -10,
        borderRadius:100
    }
});

/* native layouts
- stack: every layout created is pushed on top of each other; if we go back
the layout is popped off the stack
*/