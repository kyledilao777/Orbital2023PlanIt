/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { useRouter } from "expo-router";

export default function Sync() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState('');
 
    const handleSyncPress = () => {
        router.push({ pathname: "/syncList", params: { email: userEmail }});
    }; 

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.header}>Who do you want to sync with?</Text>
                <TextInput
                    style={styles.emailInput}
                    value={userEmail}
                    onChangeText={setUserEmail}
                    placeholder="User's email"
                    placeholderTextColor='#9E9E9E'
                    autoCapitalize="none" />
            </View>
            <View style={styles.syncButton}>
                <Button
                    onPress={handleSyncPress}
                    mode='contained'
                    textColor='black'
                    style={{ backgroundColor: '#FADF70', paddingHorizontal: 25 }}
                >Sync</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        marginLeft: 15,
        paddingRight:20,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 50
    },
    subHeader: {
        marginRight: 73,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: 'bold',
        paddingLeft: 35
    },
    emailInput: {
        padding:0,
        width: '90%',
        height: 45,
        marginTop: -50,
        marginBottom: 35,
        marginLeft:17,
        backgroundColor: 'transparent',
        fontSize: 20,
    },
    syncButton: {
        alignItems: 'center',
        justifyContent: 'center',
    }
})