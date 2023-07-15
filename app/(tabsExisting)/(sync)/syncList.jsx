import { useState, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import { useSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { useAuth } from "../../../contexts/auth";
import { Dropdown } from 'react-native-element-dropdown';


export default function SyncList() {
    const { email } = useSearchParams();
    const [events, setEvents] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [otherName, setOtherName] = useState([]);
    const [freeSlots, setFreeSlots] = useState([]);
    const [otherFreeSlots, setOtherFreeSlots] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const [day, setDay] = useState(null);
    const [starttime, setStartTime] = useState(null);
    const [endtime, setEndTime] = useState(null);
    const { user } = useAuth();

    const day_data = [
        { label: 'Monday', value: 'MON' },
        { label: 'Tuesday', value: 'TUE' },
        { label: 'Wednesday', value: 'WED' },
        { label: 'Thursday', value: 'THU' },
        { label: 'Friday', value: 'FRI' },
    ];

    useEffect(() => {
        async function fetchEvents() {
            setRefreshing(true);
            // Fetch events based on current user email
            let { data } = await supabase
                .from('events')
                .select("*")
                .eq("email", user.email);

            setEvents(data);
            setRefreshing(false);
        }

        async function fetchOtherEvents() {
            setRefreshing(true);
            // Fetch events based on the provided email
            let { data } = await supabase
                .from('events')
                .select("*")
                .eq("email", email);

            setOtherEvents(data);
            setRefreshing(false);
        }

        async function fetchOtherName() {
            setRefreshing(true);
            // Fetch name based on the provided email
            let { data } = await supabase
                .from('profiles')
                .select("*")
                .eq("email", email);

            setOtherName(data);
            setRefreshing(false);
        }

        fetchEvents();
        fetchOtherEvents();
        fetchOtherName();
    }, [user.email]);

    useEffect(() => {
        async function fetchFreeSlots() {
            setRefreshing(true);
            const updatedFreeSlots = [];

            // Iterate over each day in day_data
            for (const dayItem of day_data) {
                const day = dayItem.value;
                let startTime = 8;
                let endTime = 22;
                let hasEvent = false;

                // Check if any event matches the day
                for (const event of events) {
                    const eventStartTime = parseInt(event.startTime.substring(11, 13)) + 8;
                    const eventEndTime = parseInt(event.endTime.substring(11, 13)) + 8;

                    if (event.day === day) {
                        hasEvent = true;

                        if (startTime < eventStartTime) {
                            updatedFreeSlots.push({
                                day: day,
                                startTime: startTime,
                                endTime: eventStartTime,
                            });
                        }

                        startTime = eventEndTime;
                    }
                }

                if (!hasEvent) {
                    // No events for this day, add a full day free slot
                    updatedFreeSlots.push({
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                    });
                } else if (startTime < endTime) {
                    // Add the remaining free slot if there's still time available
                    updatedFreeSlots.push({
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                    });
                }
            }

            setFreeSlots(updatedFreeSlots);
            setRefreshing(false);
        }

        async function fetchOtherFreeSlots() {
            setRefreshing(true);
            const updatedOtherFreeSlots = [];

            // Iterate over each day in day_data
            for (const dayItem of day_data) {
                const day = dayItem.value;
                let startTime = 8;
                let endTime = 22;
                let hasEvent = false;

                // Check if any event matches the day
                for (const event of otherEvents) {
                    const eventStartTime = parseInt(event.startTime.substring(11, 13)) + 8;
                    const eventEndTime = parseInt(event.endTime.substring(11, 13)) + 8;

                    if (event.day === day) {
                        hasEvent = true;

                        if (startTime < eventStartTime) {
                            updatedOtherFreeSlots.push({
                                day: day,
                                startTime: startTime,
                                endTime: eventStartTime,
                            });
                        }

                        startTime = eventEndTime;
                    }
                }

                if (!hasEvent) {
                    // No events for this day, add a full day free slot
                    updatedOtherFreeSlots.push({
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                    });
                } else if (startTime < endTime) {
                    // Add the remaining free slot if there's still time available
                    updatedOtherFreeSlots.push({
                        day: day,
                        startTime: startTime,
                        endTime: endTime,
                    });
                }
            }

            setOtherFreeSlots(updatedOtherFreeSlots);
            setRefreshing(false);
        }

        fetchFreeSlots();
        fetchOtherFreeSlots();
    }, [email, events, otherEvents]);

    console.log(freeSlots);
    console.log(otherFreeSlots);

    const startTime_data = [
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

    const endTime_data = [
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

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.header}> My free slots:  </Text>
                {freeSlots.map((slot, index) =>
                    <Text key={index} style={styles.body}>
                        {slot.day}, {slot.startTime} to {slot.endTime}
                    </Text>)}
            </View>
            <View>
                {otherName.map((otherName) => <Text key="{otherName}" style={styles.header} > {otherName.first_name} will be free on: </Text>)}
                {otherFreeSlots.map((slot, index) =>
                    <Text key={index} style={styles.body}>
                        {slot.day}, {slot.startTime} to {slot.endTime}
                    </Text>)}
            </View>
            <View>
                <Text style={styles.header}> Choose another slot:   </Text>
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
                    placeholder={!isFocus ? 'Select day' : '...'}
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
                    data={startTime_data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select start time' : '...'}
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
                    data={endTime_data}
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? 'Select end time' : '...'}
                    value={endtime}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setEndTime(item.value);
                        setIsFocus(false);
                    }}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        marginLeft: 10,
        marginTop: 10,
        justifyContent: "left",
        fontSize: 20,
        fontWeight: "bold"
    },
    body: {
        paddingLeft: 10,
    },
    inputSearchStyle: {
        width: '100%',
        height: 50,
        backgroundColor: 'transparent',
        marginTop: 0,
        marginBottom: -2,
        marginLeft: 0,
        fontSize: 20,
    },
    dropdown: {
        margin: 0,
        marginLeft: 0,
        marginRight: 0,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 20,
        color: '#9E9E9E',
        marginLeft: 15

    },
    selectedTextStyle: {
        fontSize: 20,
    },
});

/* 

kyledaniel.lao@gmail.com

me: MON 10-12, free: 8-10, 12-22
kyle: MON 9-11, MON 12-2 free: 8-9, 11-12, 2-22

For Milestone 3:
    async function checkAvailability() {
            setArr(events["MON"]); 
            console.log(arr);
        };
        
        checkAvailability();
        
    *******************************************

    <View>
        {arr.forEach((ele) => <Text key ="{ele}"> {ele} </Text>)}
    </View>
    
    *******************************************

    const availability = useState([
        { key: 'MON', value: [startTime_data]},
        { key: 'TUE', value: [startTime_data]},
        { key:  'WED', value: [startTime_data]},
        { key: 'THU', value: [startTime_data]},
        { key: 'FRI', value: [startTime_data]},
    ]);
*/

/*
past:
<View >
    {otherName.map((otherName) => <Text key="{otherName}" style={styles.header} > {otherName.first_name} will be busy on: </Text>)}
    {otherEvents.map((otherEvent) => <Text key="{otherEvent}" style={styles.body} > {otherEvent.day}, {parseInt(otherEvent.startTime.substring(11, 13)) + 8} to {parseInt(otherEvent.endTime.substring(11, 13)) + 8} </Text>)}
</View>
<View>
    <Text style={styles.header}> You will be busy on:  </Text>
    {events.map((event) => <Text key="{event}" style={styles.body} > {event.day}, {parseInt(event.startTime.substring(11, 13)) + 8} to {parseInt(event.endTime.substring(11, 13)) + 8} </Text>)}
</View>
*/