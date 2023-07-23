import { Text, Button } from "react-native-paper"
import { supabase } from "../../../lib/supabase";
import { React, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Alert } from 'react-native';
import { useAuth } from "../../../contexts/auth";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const [data, setData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
          setRefreshing(true);
          let { data } = await supabase.from('profiles')
            .select('*')
            .eq("email", user.email)

          setRefreshing(false);
          setData(data);
        }
    
        fetchData();
      }, []);

    const handleLogOutPress = async () => {
        Alert.alert(
            "Confirm Log Out?",
            "",
            [
                {
                    text: "Log Out",
                    onPress: () => logOut(),
                    style: "destructive",
                },
                {
                    text: "Cancel",
                    style: "default",
                },
            ]
        );
    };
    
    const logOut = async () => {
        try {
          const { error } = await supabase.auth.signOut()
            if (error) {
              // Handle error
              console.error(error);
            } else {
                // Logged out successfully
                router.push("../(auth)/login");
            }
        } catch (error) {
          // Handle error
          console.error(error);
        }
    };

    const handleDeletePress = async () => {
        Alert.alert(
            "Are you sure?",
            "You are about to delete your profile. This change is permanent.",
            [
                {
                    text: "Delete user",
                    onPress: () => deleteUser(),
                    style: "destructive",
                },
                {
                    text: "Cancel",
                    style: "default",
                },
            ]
        );
      };
    
    const deleteUser = async () => {
        try {
          const { error } = await supabase.rpc('delete_user');
            if (error) {
              // Handle error
              console.error(error);
            } else {
                // Event deleted successfully
                logOut();
          }
        } catch (error) {
          // Handle error
          console.error(error);
        }
      };

    return (
        <SafeAreaView style={styles.bigcontainer}>
            <View style={styles.secondcontainer}>
            <View style={styles.profile}>
                {data.map((data) => <Image key="{data}" source={{ uri: data.photo_url }} style={styles.image}></Image>)}
            </View>
            <View style={styles.container}>
                <Image source={require('./images/name.png')} style={{width:30,height:30, resizeMode:"cover"}}/>
                {data.map((data) => <Text key="{data}" style={styles.name}>{`${data.first_name} ${data.last_name}`}</Text>)}
            </View>

            <View style={styles.container}>
                <Image source={require('./images/job.png')} style={{width:30,height:30, resizeMode:"cover"}} />
                {data.map((data) => <Text key="{data}" style={styles.job}>{data.occupation}</Text>)}
            </View>

            <View style={styles.container}>    
            <Image source={require('./images/email.png')} style={{width:30,height:30, resizeMode:"cover"}}/>
                {data.map((data) => <Text key="{data}" style={styles.email}>{data.email}</Text>)}
            </View>
            <View style={styles.buttons}>
                <Button style={styles.buttonWrapper} labelStyle={{ fontSize:20 }} textColor="#6ba1c4" mode="contained" onPress={handleLogOutPress}> Log Out </Button>
                <Button style={styles.buttonWrapper} labelStyle={{ fontSize:20 }} textColor="red" mode="contained" onPress={handleDeletePress}> Delete User </Button>
            </View>
            </View>
        </SafeAreaView>
    )
};


const styles = StyleSheet.create({
    name: { 
        fontSize: 23,
        textAlign: 'left',
        width: '100%',
        marginLeft: 20,
    },
    job: {
        fontSize: 23,
        textAlign: 'left',
        width: '100%',
        marginLeft: 20,
    },
    email: {
        fontSize: 23,
        textAlign: 'left',
        width: '100%',
        marginLeft: 20
    },
    image:{
        marginLeft:-200,
        height:150,
        width:150,
        borderRadius: 50,
    },
    profile:{
        alignSelf: 'center',
        flexDirection:'row',
        justifyContent:'center',
        width:"100%",
        marginLeft:40,
        marginTop:-70,
        marginBottom:10,
    },
    container:{
        alignSelf: 'center',
        flexDirection:'row',
        justifyContent:'left',
        width:"90%",
        padding:10,
        paddingBottom: 10,
        width:"75%"
    },
    secondcontainer:{
        marginTop:100,
        marginLeft:-30,
    },
    bigcontainer: {
        flex:1,
        backgroundColor:"white",
    },
    box: {
        marginTop:-150,
        width: 1000,
        height: 150,
        backgroundColor: 'lightblue'
    },
    buttonWrapper: {
        alignItems:"center",
        backgroundColor: "transparent"
    },
    buttons:{
        marginTop:20,
        marginLeft:40,
    }
});