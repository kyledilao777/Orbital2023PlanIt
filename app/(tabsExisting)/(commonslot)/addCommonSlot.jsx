import { useState, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import { useSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { genTimeBlock } from 'react-native-timetable';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from "expo-router";

export default function NewCommonSlot() {
    const { free } = useSearchParams();
    const [selected, setSelected] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const [isFocus, setIsFocus] = useState(false);
    const [day, setDay] = useState(null);
    const [slot, setSlot] = useState(null);
    const router = useRouter();
    const [selectedTime, setSelectedTime] = useState('');
    const [title, setTitle] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [errMsgDay, setErrMsgDay] = useState('');
    const [errMsgSlot, setErrMsgSlot] = useState('');
    const [location, setLocation] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [time, setTime] = useState(null);
    // console.log(free);

    const day_data = [
        { label: 'Monday', value: 'MON' },
        { label: 'Tuesday', value: 'TUE' },
        { label: 'Wednesday', value: 'WED' },
        { label: 'Thursday', value: 'THU' },
        { label: 'Friday', value: 'FRI' },
    ];

    const duration = [];

    for (let i = 1; i <= 10; i++) {
        duration.push({
            label: i.toString(),
            value: i
        });
    }

    /*
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

        fetchEvents();
        fetchOtherEvents();
    }, [user.email]);

    useEffect(() => {
        async function fetchFreeSlots() {
            setRefreshing(true);
            const updatedFreeSlots = [];
            const allEvents = events.concat(otherEvents);
            const dayOrder = {
                MON: 1,
                TUE: 2,
                WED: 3,
                THU: 4,
                FRI: 5,
            };

            allEvents.sort((a, b) => {
                // Compare the day order
                const dayOrderA = dayOrder[a.day];
                const dayOrderB = dayOrder[b.day];

                if (dayOrderA < dayOrderB) {
                    return -1;
                } else if (dayOrderA > dayOrderB) {
                    return 1;
                } else {
                    // If the days are the same, compare the start times
                    const startTimeA = new Date(a.startTime).getTime();
                    const startTimeB = new Date(b.startTime).getTime();

                    if (startTimeA < startTimeB) {
                        return -1;
                    } else if (startTimeA > startTimeB) {
                        return 1;
                    } else {
                        // If the start times are the same, compare the end times
                        const endTimeA = new Date(a.endTime).getTime();
                        const endTimeB = new Date(b.endTime).getTime();

                        if (endTimeA < endTimeB) {
                            return -1;
                        } else if (endTimeA > endTimeB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            });

            // Iterate over each day in day_data
            for (const dayItem of day_data) {
                const day = dayItem.value;
                let startTime = 8;
                let endTime = 22;
                let hasEvent = false;

                // Check if any event matches the day
                for (const event of allEvents) {
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

        fetchFreeSlots();
    }, [email, events, otherEvents]); */

    const handleAddEvent = async () => {
        setErrMsg('');
        if (title === '') {
            setErrMsg('Event name cannot be empty')
            return;
        }
        setErrMsgDay('');
        if (day === null) {
            setErrMsgDay('Day cannot be empty')
            return;
        }
        setErrMsgSlot('');
        if (slot === null) {
            setErrMsgSlot('Slot cannot be empty')
            return;
        }
        setLoading(true);

        const startTime = genTimeBlock(day, selected.startTime);
        const endTime = genTimeBlock(day, selected.endTime);

        const { data } = await supabase.from('timetables')
            .select("id")
            .eq("user_id", user.id)

        const table_id = data[0].id;

        // need to use user.id
        const { error } = await supabase.from('events')
            .insert({
                event_name: title,
                user_id: user.id,
                day,
                startTime,
                endTime,
                location: location,
                extra_descriptions: [note],
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
        router.push('../../(tabsExisting)/existing');
    }

    function convertToStream(free) {
        const result = [];
        const freeSlotsData = free.split("},{");

        freeSlotsData[0] = freeSlotsData[0].replace("{", "");
        freeSlotsData[freeSlotsData.length - 1] = freeSlotsData[freeSlotsData.length - 1].replace("}", "");

        for (let i = 0; i < freeSlotsData.length; i++) {
            const { day, startTime, endTime } = JSON.parse(`{${freeSlotsData[i]}}`);
            result.push({
                day,
                startTime,
                endTime,
            });
        }
        return result;
    }

        const freeSlots = convertToStream(free);

        function splitTimeSlots(freeSlots) {
            const splitSlots = [];

            for (const slot of freeSlots) {
                const num = slot.endTime - slot.startTime;
                // const num = Math.floor((slot.endTime - slot.startTime) / time);
                let slotStartTime = slot.startTime;

                for (let j = 1; j <= num; j++) {
                    const projEndTime = slotStartTime + time;
                    if (projEndTime > slot.endTime) {
                        break;
                    } else {
                        splitSlots.push({
                            day: slot.day,
                            startTime: slotStartTime,
                            endTime: projEndTime,
                        });
                    }
                    slotStartTime += 1;
                }
            }

            return splitSlots;
        }

        const splitSlots = splitTimeSlots(freeSlots);
        const slot_data = splitSlots
            .filter((freeS) => freeS.day === day) // Filter the slots based on selected day
            .map((freeS) => ({
                label: `${freeS.day}, ${freeS.startTime} to ${freeS.endTime}`,
                value: `${freeS.day}, ${freeS.startTime} to ${freeS.endTime}`,
                stored: freeS
            }));

        return (
            <SafeAreaView style={{flex:1, backgroundColor:"white"}}>
                <View style={{marginHorizontal:14}}>
                    <Text style={styles.header}> Please choose a desired duration (hrs) for your new event. </Text>
                </View>
                <View style={styles.body}>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={duration}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? 'Select duration...' : '...'}
                        value={time}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setTime(item.value);
                            setIsFocus(false);
                        }}
                    />
                </View>
                <View  style={{marginHorizontal:15}}>
                    <Text style={styles.header}> Please fill in the details of your new event. </Text>
                    <TextInput
                            autoCapitalize='none'
                            placeholder="Event Name"
                            placeholderTextColor='#9E9E9E'
                            textColor='black'
                            value={title}
                            onChangeText={setTitle}
                            style={styles.inputSearchStyle}
                        />
                    {errMsg !== '' && <Text>{errMsg}</Text>}
                    <View style={styles.secondbody}>
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
                        {errMsgDay !== '' && <Text>{errMsgDay}</Text>}
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            inputSearchStyle={styles.inputSearchStyle}
                            iconStyle={styles.iconStyle}
                            data={slot_data}
                            search
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            placeholder={!isFocus ? 'Select slot' : '...'}
                            value={slot}
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            onChange={item => {
                                setSlot(item.value);
                                setSelected(item.stored);
                                setIsFocus(false);
                            }}
                        />
                        {errMsgSlot !== '' && <Text>{errMsgSlot}</Text>}
                    </View>
                    <TextInput
                        autoCapitalize='none'
                        placeholder="Location"
                        placeholderTextColor='#9E9E9E'
                        textColor='black'
                        value={location}
                        onChangeText={setLocation}
                        style={styles.inputSearchStyle}
                    />
                    <TextInput
                        autoCapitalize='none'
                        placeholder="Note (e.g. Remind Zac)"
                        placeholderTextColor='#9E9E9E'
                        textColor='black'
                        value={note}
                        onChangeText={setNote}
                        style={styles.inputSearchStyle}
                    />
                    <View style={styles.button}>
                        <Button
                            onPress={handleAddEvent}
                            textColor='black'
                            mode='outlined'
                        >Add a slot</Button>
                        {loading && <ActivityIndicator />}
                    </View>
                </View>
            </SafeAreaView>
        )
    }

    const styles = StyleSheet.create({
        header: {
            width: "100%",
            marginLeft: 10,
            marginTop: 10,
            marginBottom: 5,
            justifyContent: "flex-start",
            fontSize: 20,
            fontWeight: "bold"
        },
        body: {
            marginHorizontal:15
        },
        secondbody: {
            marginHorizontal:5
        },
        inputSearchStyle: {
            width: '95%',
            height: 50,
            backgroundColor: 'transparent',
            marginTop: 0,
            marginBottom: -2,
            marginLeft: 10,
            marginRight: 10,
            fontSize: 20,
        },
        dropdown: {
            margin: 0,
            marginLeft: 5,
            marginRight: 5,
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
            marginLeft: 15,
        },
        button: {
            marginTop: 30,
            alignItems: 'center',
            justifyContent: 'center',
        }
    });