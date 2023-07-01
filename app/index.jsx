import { Text, Button } from "react-native-paper"
import { supabase } from "../../../lib/supabase";
import { React, useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Image, Alert } from 'react-native';
import { useAuth } from "../../../contexts/auth";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const [table, setTable] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [ errMsg, setErrMsg ] = useState('');
    const user  = useAuth();
    
    useEffect(() => {
        async function handleLoad() {
            setRefreshing(true);

            let { data } = await supabase
                .from('timetables')
                .select('*')
                .eq("user_id", user.id)

            setRefreshing(false);
            setTable(data);
        }
        console.log(table);
        handleLoad(); 
      }, []);

    return (
        {table.map((table) => !table.length ? <Redirect href = "/(tabsEmpty)" /> : <Redirect href = "/(tabsExisting)"/>)}
    )
};