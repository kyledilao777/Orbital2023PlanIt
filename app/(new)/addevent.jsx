/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/auth";
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

        const note = [];
        const startTime = genTimeBlock(day, parseInt(starttime) + 8);
        const endTime = genTimeBlock(day, parseInt(endtime) + 8);

        // need to use user.id
        const { error } = await supabase.from('events')
            .insert({
                event_name: title,
                user_id: user.id,
                day,
                startTime,
                endTime,
                location: location,
                extra_descriptions: note
            })
            .select();

        if (error != null) {
            setLoading(false);
            console.log(error);
            setErrMsg(error.message); // can only be string, so need .message
            return;
        }
        setLoading(false);
        router.push('/existingtimetable'); // auto push back to the root page
    }

    const handleGoBack = () => {
        router.push("/existingtimetable");
    };

    return <View style={styles.container}>
        <Text>Event Name: </Text>
        <TextInput value={title} onChangeText={setTitle} />
        {errMsg !== '' && <Text>{errMsg}</Text>}
        <View>
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
        <Text>Location: </Text>
        <TextInput value={location} onChangeText={setLocation} />
        <Text>Note: e.g. []</Text>
        <TextInput value={note} onChangeText={setNote} />
        <Button onPress={handleSubmit}>Submit</Button>
        {loading && <ActivityIndicator />}
        <Button onPress={handleGoBack}>Go back</Button>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

/*
        <Text>Event Name: </Text>
        <TextInput value={title} onChangeText={setTitle} />
        {errMsg !== '' && <Text>{errMsg}</Text>}
        <Text>Day: e.g. "MON"</Text>
        <TextInput value={day} onChangeText={setDay} />
        <Text>Start Time: e.g. "21"</Text>
        <TextInput value={starttime} onChangeText={setStartTime} />
        {errMsgST !== '' && <Text>{errMsgST}</Text>}
        <Text>End Time: e.g. "22"</Text>
        <TextInput value={endtime} onChangeText={setEndTime} />
        {errMsgET !== '' && <Text>{errMsgET}</Text>}
        <Text>Location: </Text>
        <TextInput value={location} onChangeText={setLocation} />
        <Text>Note: e.g. []</Text>
        <TextInput value={note} onChangeText={setNote} />
        <Button onPress={handleSubmit}>Submit</Button>
        {loading && <ActivityIndicator />}
*/