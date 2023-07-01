import { supabase } from "../lib/supabase";
import { React, Component, useState, useEffect } from 'react';
import { useAuth } from "../contexts/auth";
import { Redirect } from "expo-router";

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

        handleLoad(); 
      }, []);

    return (
        table.length == 0 ? <Redirect href = "/(tabsEmpty)" /> : <Redirect href = "/(tabsExisting)"/>
    )
};
