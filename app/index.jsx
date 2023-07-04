import { supabase } from "../lib/supabase";
import { React, Component, useState, useEffect, useRef } from 'react';
import { useAuth } from "../contexts/auth";
import { Redirect } from "expo-router";
import { Link } from "expo-router";

export default function HomeScreen() {
    const [table, setTable]= useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [ errMsg, setErrMsg ] = useState('');
    const { user }  = useAuth();
    
    useEffect(() => {
        const handleLoad = async () => {
            const { data } = await supabase.from('timetables').select('*').eq("user_id", user.id).single();
            setTable(data);
            console.log('from useEffect: ', data);
        }

        handleLoad(); 
      }, [table]);

    console.log("table: ", table);
    
    if (table == null) {
        return <Redirect href = "/(tabsEmpty)/empty"/>;
    } else {
        return <Redirect href = "/(tabsExisting)/existing"/>;
    }
};
