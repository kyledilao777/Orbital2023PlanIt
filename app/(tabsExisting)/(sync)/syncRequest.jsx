import { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useSearchParams } from "expo-router";
import { useAuth } from "../../../contexts/auth";

export default function SyncTimeout() {
    const { email } = useSearchParams();
    const [name, setName] = useState('');
    const [tblName, setTblName] = useState ('')
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        async function fetchName() {
            setRefreshing(true);
            // Fetch events based on current user email
            let { data } = await supabase
                .from('profiles')
                .select("first_name")
                .eq("email", email);
            
            setRefreshing(false);

            setName(data[0].first_name);
            
        }
        
        fetchName(); 
    }, [email]);

    const nameformatted = <Text style={{ fontWeight:"bold" }}>{name} ({email})</Text>;

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}> 
                        You have successfully sent a sync request to {nameformatted}.
                    </Text>
                    <Image style={styles.image} source={require('./images/greentick.png')}/>
                    <Text style={styles.text}>
                        We will notify you once your sync request has been accepted.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 23,
        marginBottom: 50
    },
    image:{
        height:200,
        width:200,
        marginTop:-20,
        marginBottom:20,
        alignSelf:"center"
    },
    subHeader: {
        marginRight: 73,
        textAlign: 'left',
        fontSize: 25,
        fontWeight: 'bold',
        paddingLeft: 35
    },
    emailInput: {
        width: '80%',
        height: 45,
        marginTop: -50,
        marginBottom:10,
        marginLeft:25,
        backgroundColor: 'transparent',
        fontSize: 20,
    },
    syncButton: {
        alignItems: 'center',
    }
})