import { useState, useEffect } from "react";
import { View, SafeAreaView, Image } from "react-native";
import { useSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../contexts/auth";
import { useRouter } from "expo-router";

export default function SyncList() {
    const { email } = useSearchParams();
    const [events, setEvents] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [freeSlots, setFreeSlots] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

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
                let nextDay = "SAT";

                // Check if any event matches the day
                for (const event of allEvents) {
                    const eventStartTime = parseInt(event.startTime.substring(11, 13)) + 8;
                    const eventEndTime = parseInt(event.endTime.substring(11, 13)) + 8;
                    if (event.day === day) {
                        hasEvent = true;

                        if (nextDay === day) {
                            continue;
                        }

                        if (startTime < eventStartTime) {
                            updatedFreeSlots.push({
                                day: day,
                                startTime: startTime,
                                endTime: eventStartTime,
                            });
                        }

                        startTime = eventEndTime;

                        if (eventEndTime === endTime) {
                            nextDay = day;
                        }
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

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./images/smile.png')} style={styles.image} />
            <Text style={styles.message}> Free slots successfully generated! </Text>
            <View>
                <Text style={styles.header}> Common slots:  </Text>
                <View style={styles.list}>
                    {freeSlots.map((slot, index) =>
                        <View key={index} style={styles.slotContainer}>
                            <Text style={styles.dayText}>{slot.day}</Text>
                            <Text style={styles.timeText}>
                                {slot.startTime} to {slot.endTime}
                            </Text>
                        </View>)}
                </View>

            </View>
            <View style={styles.button}>
                <Button
                    textColor='black'
                    mode='outlined'
                    onPress={() => router.push({
                        pathname: "../(commonslot)/addCommonSlot",
                        params: { free: freeSlots.map((freeSlot) => JSON.stringify(freeSlot)) }
                    })}
                >Add a slot</Button>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
    },
    message: {
        paddingBottom: 20,
        paddingTop: 20,
        fontSize: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    list: {
        marginBottom: 20,
        alignSelf: 'center',
    },
    header: {
        width: "100%",
        marginLeft: 10,
        marginTop: 10,
        justifyContent: "flex-start",
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    slotContainer: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingLeft: 20
    },
    dayText: {
        marginRight: 5,
        fontWeight: 'bold',
        fontSize: 15,
    },
    timeText: {
        marginRight: 10,
        fontSize: 15,
    },
});

/* 
tracynguyen264@gmail.com
kyledaniel.lao@gmail.com

me: MON 8-9, 13-15 free: 9-12, 15-22
kyle: MON 9-11, MON 12-2 free: 8-9, 11-12, 2-22
common: MON 11-12, 15-22

const splitSlots = [];
for slot in freeSlots
    let num = endTime - startTime;
    const slotStartTime = slot.startTime

    for j in range(1, num+1)
        splitSlots.push({
            day: day,
            startTime: startTime,
            endTime: startTime + 1,
        });

        slotStartTime += 1


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
*/