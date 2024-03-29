/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { useRouter } from "expo-router";
import { genTimeBlock } from 'react-native-timetable';
import { Dropdown } from 'react-native-element-dropdown';

export default function NewEvent() {
    const [title, setTitle] = useState('');
    const [day, setDay] = useState(null);
    const [starttime, setStartTime] = useState(null);
    const [endtime, setEndTime] = useState(null);
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [errMsgST, setErrMsgST] = useState('');
    const [errMsgET, setErrMsgET] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const day_data = [
        { label: 'Monday', value: 'MON' },
        { label: 'Tuesday', value: 'TUE' },
        { label: 'Wednesday', value: 'WED' },
        { label: 'Thursday', value: 'THU' },
        { label: 'Friday', value: 'FRI' },
    ];

    const starttime_data = [
        { label: '8 a.m.', value: '8' },
        { label: '9 a.m.', value: '9' },
        { label: '10 a.m.', value: '10' },
        { label: '11 a.m.', value: '11' },
        { label: '12 p.m.', value: '12' },
        { label: '1 p.m.', value: '13' },
        { label: '2 p.m.', value: '14' },
        { label: '3 p.m.', value: '15' },
        { label: '4 p.m.', value: '16' },
        { label: '5 p.m.', value: '17' },
        { label: '6 p.m.', value: '18' },
        { label: '7 p.m.', value: '19' },
        { label: '8 p.m.', value: '20' },
        { label: '9 p.m.', value: '21' },
        { label: '10 p.m.', value: '22' },
    ];

    const endtime_data = [
        { label: '8 a.m.', value: '8' },
        { label: '9 a.m.', value: '9' },
        { label: '10 a.m.', value: '10' },
        { label: '11 a.m.', value: '11' },
        { label: '12 p.m.', value: '12' },
        { label: '1 p.m.', value: '13' },
        { label: '2 p.m.', value: '14' },
        { label: '3 p.m.', value: '15' },
        { label: '4 p.m.', value: '16' },
        { label: '5 p.m.', value: '17' },
        { label: '6 p.m.', value: '18' },
        { label: '7 p.m.', value: '19' },
        { label: '8 p.m.', value: '20' },
        { label: '9 p.m.', value: '21' },
        { label: '10 p.m.', value: '22' },
    ];

    const [isFocus, setIsFocus] = useState(false);

    const handleSubmit = async () => {
        setErrMsg('');
        if (title === '') {
            setErrMsg('title cannot be empty')
            return;
        }
        setErrMsgST('');
        if (starttime === '') {
            setErrMsgST('start time cannot be empty')
            return;
        }
        setErrMsgET('');
        if (endtime === '') {
            setErrMsgET('end time cannot be empty')
            return;
        }
        setLoading(true);

        const startTime = genTimeBlock(day, parseInt(starttime));
        const endTime = genTimeBlock(day, parseInt(endtime));

        const { data } = await supabase.from('timetables')
            .select("id")
            .eq("user_id", user.id)

        const table_id = data[0].id;

        // need to use user.id
        const { error } = await supabase.from('events')
            .insert({
                event_name: title,
                user_id: user.id,
                day: day,
                startTime: startTime,
                endTime: endTime,
                location: location,
                extra_descriptions: [ note ],
                email: user.email,
                timetable_id: table_id
            })
            .select();
            
        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message); // can only be string, so need .message
            return;
        }
        setLoading(false);
        router.push('../existing'); // auto push back to the root page
    }

    return <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
        <View style={{marginHorizontal:20, marginTop:100}}>
            <Text style={styles.header}> Please fill in the details of your new event. </Text>
        </View>
        <View style={{marginHorizontal:20,}}>
            <TextInput 
                autoCapitalize='none'
                placeholder="Event Name"
                placeholderTextColor='#9E9E9E'
                textColor='black'
                value={title} 
                onChangeText={setTitle} 
                style={styles.inputSearchStyle}
            />
        </View>
        {errMsg !== '' && <Text>{errMsg}</Text>}
        <View style={{marginHorizontal:20,}}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={day_data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select day...' : '...'}
                value={day}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setDay(item.value);
                    setIsFocus(false);
                }}
            />
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={starttime_data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select start time...' : '...'}
                value={starttime} // this part
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setStartTime(item.value); // this part
                    setIsFocus(false);
                }}
            />
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={endtime_data}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select end time...' : '...'}
                value={endtime}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setEndTime(item.value);
                    setIsFocus(false);
                }}
            />
        </View>
        <View style={{marginHorizontal:20,}}>
        <TextInput 
            autoCapitalize='none'
            placeholder="Location"
            placeholderTextColor='#9E9E9E'
            textColor='black'
            value={location} 
            onChangeText={setLocation} 
            style={styles.inputSearchStyle}
        />
        </View>
        <View style={{marginHorizontal:20,}}>
        <TextInput 
            autoCapitalize='none'
            placeholder="Note (e.g. Remind Zac)"
            placeholderTextColor='#9E9E9E'
            textColor='black'
            value={note} 
            onChangeText={setNote}
            style={styles.inputSearchStyle}
        />    
        </View>    
        <View style={{marginLeft:20,}}>
            <Button 
                style={styles.submit} 
                onPress={handleSubmit}
                textColor='black'
                mode='contained'
            >Submit</Button>
            {loading && <ActivityIndicator />}
        </View>
    </SafeAreaView>;
}

//<Button onPress={handleGoBack}>Go back</Button>
const styles = StyleSheet.create({
    header: {
        fontSize:17,
        fontWeight:"bold",
        marginTop:-30,
        marginBottom:20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        marginTop:-160,
        backgroundColor: "white"
    },
    inputSearchStyle:{
        width: '100%',
        height: 50,
        backgroundColor: 'transparent',
        marginTop: 0, 
        marginBottom: -2,
        marginLeft:0,
        fontSize: 20,
        
    },
    dropdown: {
        margin: 0,
        marginLeft:0,
        marginRight:0,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 20,
        color:'#9E9E9E',
        marginLeft:13

    },
    selectedTextStyle: {
        fontSize: 20,
        marginLeft:16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    submit:{
        width:120,
        alignItems: 'center',
        marginLeft:120,
        marginTop: 25,
        backgroundColor: '#FADF70'
    }
});