import { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useSearchParams } from "expo-router";
import { useAuth } from "../../../contexts/auth";

export default function Rejection() {
    const { email, name } = useSearchParams();

    return (
        <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
            <View style={styles.container}>
                <Image style={styles.image}source={require('./images/rejected.png')} />
                <Text style={styles.text}> 
                    You have successfully rejected {"\n"} a sync request from {name}.
                </Text>
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
        marginBottom: 50,
        fontWeight:"bold"
    },
    image:{
        height:200,
        width:200,
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