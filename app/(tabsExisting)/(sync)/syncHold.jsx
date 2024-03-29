import { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/auth";
import * as Notifications from 'expo-notifications';

export default function SyncHold() {
    const [refreshing, setRefreshing] = useState(false);
    const [count, setCount] = useState(0);
    const { user } = useAuth();
    const router = useRouter();

    const [sentToEmail, setSentToEmail] = useState('null');
    const [sentToName, setSentToName] = useState ('null')
    const [sentStatus, setSentStatus] = useState('')

    const [rcvEmail, setRcvEmail] = useState('null');
    const [rcvName, setRcvName] = useState ('null')
    const [rcvStatus, setRcvStatus] = useState('');
    
    useEffect(() => {
        async function fetchSentRequests() {
            setRefreshing(true);

            const { data, error } = await supabase
                .from('syncRequests')
                .select(`receipient, status, profiles!receipient(first_name)`)
                .eq("user_id", user.id)
            
            setRefreshing(false);

            if (!data.length) {
                return;
            }

            setSentToEmail(data[0].receipient)
            setSentToName(data[0].profiles.first_name)
            setSentStatus(data[0].status)
        }

        async function fetchRcvRequests() {
            setRefreshing(true);
            
            const { data, error } = await supabase
                .from('syncRequests')
                .select(`sender, status, profiles!sender(first_name)`)
                .eq("receipient", user.email)

            setRefreshing(false);

            if (!data.length) {
                return;
            }

            setRcvEmail(data[0].sender);
            setRcvName(data[0].profiles.first_name);
            setRcvStatus(data[0].status);
        }

        fetchSentRequests(); fetchRcvRequests();
    }, []);


    const formatInfo = (name, email) => {
        return email === 'null' ? false : <Text style={{ fontSize:15 }}>- {name} ({ email })</Text>;
    }

    const formatStatus = (status) => {
        return <Text style = {{ color: 
            status === "Pending" ? "#ffe478"
            : status === "Rejected"  ? "red" 
            : status === "Accepted" ? "green"
            : "black",
            fontWeight:"bold"
        }}>{ status }</Text>
    }

    //status of sent requests
    const sentToInfo = formatInfo(sentToName, sentToEmail);
    const sentStatusFormat = formatStatus(sentStatus);

    //status of sent requests
    const rcvInfo = formatInfo(rcvName, rcvEmail);
    const rcvStatusFormat = formatStatus(rcvStatus);

    //as a sender
    const sentText = () => {
        return (
            sentToInfo === false 
            ? <Text style={styles.sentText}> You have no pending requests. </Text> 
            : sentStatus === "Accepted"
            ? accepted()
            : <Text style={styles.sentText}> {sentToInfo}: {sentStatusFormat}{"\n"}  </Text> 
        )
    }

    const accepted = () => {
        const handleOpenPress = async () => {
            router.push({ pathname: "/syncList", params: { email: sentToEmail }});
        }

        return (
            <View style={styles.pickWrapper}>
                <Text style={styles.sentText}> {sentToInfo}: {sentStatusFormat}{"\n"}  </Text> 
                <TouchableOpacity style={styles.pickButton} onPress={handleOpenPress}>
                    <Text style={{fontSize:15, color:"#6ba1c4"}}> Common Slots </Text>
                </TouchableOpacity>
            </View>
        )
    }
    
    //as a receipient
    async function schedulePushNotification() {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Sync Request",
            body: `${rcvName} has requested to sync timetables with you. Click to accept now! 🕐 `,
        },
          trigger: { seconds: 4 },
        });
    }

    if (rcvName != 'null' && rcvStatus === "Pending" && count === 1) {
        schedulePushNotification();
        setCount(1);
    }

    const handleDecision = () => {
        const acceptRequest = async () => {
            const { error } = await supabase
                .from(`syncRequests`)
                .update({ status:"Accepted" })
                .eq('sender', rcvEmail) 
                
            setRcvStatus("Accepted");
            router.push({ pathname: "/syncList", params: { email: rcvEmail }});;
        }

        const handleAcceptPress = async () => {
            Alert.alert(
                `Accept Sync Request?`,
                "",
                [
                    {
                        text: "Confirm",
                        onPress: () => acceptRequest(),
                        style: "default",
                    },
                    {
                        text: "Cancel",
                        style: "destructive",
                    },
                ]
            );
        }
    
        const rejectRequest = async () => {
            const { error } = await supabase
                .from(`syncRequests`)
                .update({ status:"Rejected" })
                .eq('sender', rcvEmail) 
                
            setRcvStatus("Rejected");
            router.push({ pathname: "./rejectionPage", params: { email: rcvEmail, name:rcvName }})
        }

        const handleRejectPress = async () => {
            Alert.alert(
                `Reject Sync Request?`,
                "",
                [
                    {
                        text: "Confirm",
                        onPress: () => rejectRequest(),
                        style: "default",
                    },
                    {
                        text: "Cancel",
                        style: "destructive",
                    },
                ]
            );
        }

        return (
            <View style={styles.buttonContainer}>
                <Text style ={styles.rcvText}> {rcvInfo} </Text>
                <View style={styles.acceptWrapper}>
                    <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptPress}>
                        <Image style={{height: 20, width:20,}} source={require('./images/accept.jpg')}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.rejectWrapper}>
                    <TouchableOpacity style={styles.rejectButton} onPress={handleRejectPress}>
                        <Image style={{height: 20, width:20,}} source={require('./images/reject.jpg')}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

        
    const rcvText = () => {
        const handleOpenPress = async () => {
            router.push({ pathname: "/syncList", params: { email: rcvEmail }});
        }

        return rcvInfo === false 
            ? <Text style={styles.rcvText}> You have no pending requests to accept. </Text> 
            : rcvStatus == "Pending"
            ? handleDecision()
            : rcvStatus != "Accepted" 
            ? <Text style={styles.rcvText}> {rcvInfo}: {formatStatus("Rejected") } </Text> 
            : 
            <View>
                <Text style={styles.rcvText}> {rcvInfo}: {formatStatus("Accepted") } </Text> 
                    <TouchableOpacity style={styles.secondPickButton} onPress={handleOpenPress}>
                        <Text style={{fontSize:15, color:"#6ba1c4"}}> Common Slots </Text>
                    </TouchableOpacity>
            </View>
    };

    return (
        <SafeAreaView style={{ flex:1, backgroundColor:"white" }}>
            <View style={styles.sentContainer}>
                <View style={styles.sentHeadWrapper}>
                    <Text style={styles.header}>
                        Status of requests sent
                    </Text>
                    {sentText()}
                </View>
            </View>
            <View style={styles.rcvContainer}>
                <View style={styles.receivedHeadWrapper}>
                    <Text style={styles.header}>
                        Status of requests received
                    </Text>
                    {rcvText()}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    sentContainer: {
        flex: 1,
        flexDirection:"column",
    },
    rcvContainer: {
        flex: 1,
        flexDirection:"column",
    },
    sentHeadWrapper: {
        marginLeft:30,
        marginTop:20,
    },
    receivedHeadWrapper: {
        marginLeft:30,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color:"black",
    },
    sentText: {
        fontSize: 15,
    },
    rcvText: {
        fontSize: 15,
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
    },
    buttonContainer: {
        flexDirection:'row',
        width:"100%",
    },
    acceptWrapper:{
        flex:1,
    },
    rejectWrapper:{
        flex:1,
        marginLeft:-90,
    },
    pickButton: {
        marginTop:-10,
        marginLeft:5,
    },
    secondPickButton: {
        marginTop:5,
        marginLeft:8,
    },
})