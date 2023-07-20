import { useState, useEffect } from "react";
import { View, SafeAreaView, Image} from "react-native";
import { useSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from "../../../lib/supabase";
import { Link } from "expo-router";
import { useAuth } from "../../../contexts/auth";

export default function SyncList() {
    const { email } = useSearchParams();
    const [events, setEvents] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [freeSlots, setFreeSlots] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
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

    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('./images/smile.png')} style={styles.image}/>
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
                <Link href="../(commonslot)/addCommonSlot">
                    <Button
                        textColor='black'
                        mode='outlined'
                    >Add a slot</Button>
                </Link>
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