import { useState, useEffect } from "react";
import * as Notifications from 'expo-notifications';
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/auth";

export default function Sync() {
    const router = useRouter();
    const { user } = useAuth();
    const [tblName, setTblName] = useState([]);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [count, setCount] = useState(0);
  

    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Sync Request",
            body: 'You have successfully made a sync request. Great work! 🎉 ',
        },
          trigger: { seconds: 4 },
        });
    }

    const handleSyncPress = async () => {
        let { data } = await supabase  
            .from('timetables')
            .select('timetable_name')
            .eq("user_id", user.id);


        setTblName(data[0].timetable_name)
        
        if (user.email === userEmail) {
            setErrMsg("Unable to sync with yourself!");
            return;
        }

        const { error } = await supabase
            .from("syncRequests")
            .insert({
                user_id: user.id,
                sender: user.email,
                timetable_name: tblName,
                receipient: userEmail,
                status:"Pending",
            })
        .select();

        if (error != null) {
            console.log(error);
            setErrMsg(error.message); // can only be string, so need .message
            return;
        }
        
        if (count === 0) {
            schedulePushNotification();
            setCount(1);
        }
        
        router.push({ pathname: "/syncRequest", params: { email: userEmail }});
        
    };

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.text}>Who do you want to sync with?</Text>
                </View>
                <View style={styles.input}>
                    <TextInput
                        style={styles.emailInput}
                        value={userEmail}
                        onChangeText={setUserEmail}
                        placeholder="User's email"
                        placeholderTextColor='#9E9E9E'
                        autoCapitalize="none" />
                    {errMsg !== "" && <Text style={{color:"red", marginLeft:41, paddingBottom:10,}}>{errMsg}</Text>}
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
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    text: {
        marginLeft: 25,
        textAlign: 'left',
        fontSize: 23,
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