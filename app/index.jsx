import { supabase } from "../lib/supabase";
import { React, Component, useState, useEffect, useRef } from 'react';
import { useAuth } from "../contexts/auth";
import { Redirect } from "expo-router";
import { Link, useRouter } from "expo-router";
import { SafeAreaView, View, Text, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function HomeScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [ errMsg, setErrMsg ] = useState('');
    const { user }  = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        const handleLoad = async () => {

            setRefreshing(true);
            const { data } = await supabase.from('timetables').select('*').eq("user_id", user.id).single();
            setRefreshing(false);

            if (data == null) {
                router.replace("/(tabsEmpty)/empty");
            } else {
                router.replace("/(tabsExisting)/existing");
            }
        }

        handleLoad(); 
      }, []);

      return (
        <SafeAreaView>
        <View style = {styles.text}>
            <Text style={{paddingBottom: 10}}> Please wait. Screen loading... </Text>
            <ActivityIndicator color="#1D49A7"/>
        </View>
        </SafeAreaView>
      )
};
const styles = StyleSheet.create({
    text: { 
        paddingVertical: 350,
        paddingHorizontal: 100,
    },
})
