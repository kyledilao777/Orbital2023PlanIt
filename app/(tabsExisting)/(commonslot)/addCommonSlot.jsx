import { useState, useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import { useSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { genTimeBlock } from 'react-native-timetable';
import { Dropdown } from 'react-native-element-dropdown';
import { useRouter } from "expo-router";


export default function NewCommonSlot() {
    const { email } = useSearchParams();
    const [events, setEvents] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [freeSlots, setFreeSlots] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const [isFocus, setIsFocus] = useState(false);
    const [day, setDay] = useState(null);
    const [slot, setSlot] = useState(null);
    const router = useRouter();
    const [selectedTime, setSelectedTime] = useState('');

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
    }, [email, events, otherEvents]);

    const handleAddEvent = async () => {

        const startTime = genTimeBlock(day, slot.startTime);
        const endTime = genTimeBlock(day, slot.endTime);

        const { data } = await supabase.from('timetables')
            .select("id")
            .eq("user_id", user.id)

        const table_id = data[0].id;

        // need to use user.id
        const { error } = await supabase.from('events')
            .insert({
                event_name: "test event name",
                user_id: user.id,
                day,
                startTime,
                endTime,
                location: "test location",
                extra_descriptions: [],
                email: user.email,
                timetable_id: table_id
            })
            .select();

        if (error != null) {
            console.log(error);
            return;
        }
        router.push('../../(tabsExisting)/existing');
    }

    function splitTimeSlots(freeSlots) {
        const splitSlots = [];

        for (const slot of freeSlots) {
            const num = slot.endTime - slot.startTime;
            let slotStartTime = slot.startTime;

            for (let j = 1; j <= num; j++) {
                splitSlots.push({
                    day: slot.day,
                    startTime: slotStartTime,
                    endTime: slotStartTime + 1,
                });

                slotStartTime += 1;
            }
        }

        return splitSlots;
    }

    const splitSlots = splitTimeSlots(freeSlots);
    const slot_data = splitSlots
        .filter((free) => free.day === day) // Filter the slots based on selected day
        .map((free) => ({
            label: `${free.day}, ${free.startTime} to ${free.endTime}`,
            value: free,
        }));

    return (
        <SafeAreaView>
            <View>
                <Text style={styles.header}> Choose your desired day:   </Text>
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
            </View>
            <View>
                <Text style={styles.header}> Select a time for your new event:   </Text>
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
                    placeholder={!isFocus ? 'Select time' : '...'}
                    value={slot}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                        setSlot(item.value);
                        setIsFocus(false);
                    }}
                />
            </View>

            <View style={styles.button}>
                <Button
                    onPress={handleAddEvent}
                    textColor='black'
                    mode='outlined'
                >Add a slot</Button>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        marginLeft: 10,
        marginTop: 10,
        justifyContent: "flex-start",
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});