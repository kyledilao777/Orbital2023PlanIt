import { Component } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';
import { supabase } from "../../lib/supabase";

export default class ExistingTimetable extends Component {
    constructor(props) {
        super(props);
        this.numOfDays = 5;
        this.pivotDate = genTimeBlock('mon');
        this.state = {
            events: [],
            refreshing: false
        };
    }

    componentDidMount() {
        this.fetchEvents();
    }

    fetchEvents = async () => {
        this.setState({ refreshing: true });
        try {
            const { data, error } = await supabase.from('events').select('*')
            if (error) {
                console.error(error);
                return;
            }
            this.setState({ events: data });
        } catch (error) {
            console.error(error);
        }
        this.setState({ refreshing: false });
    };

    deleteEvent = async (event_name, day, startTime, endTime) => {
        try {
            // eq('column name', value to compare against)
            const { error } = await supabase.from('events')
                .delete()
                .eq('event_name', event_name)
                .eq('day', day)
                .eq('startTime', startTime)
                .eq('endTime', endTime);

            if (error) {
                // Handle error
                console.error(error);
            } else {
                // Event deleted successfully
                Alert.alert('Event deleted!');
                // Refresh events after deletion
                this.fetchEvents();
            }
        } catch (error) {
            // Handle error
            console.error(error);
        }
    };

    handleEventPress = (evt) => {
        const eventDetails = `Event Name: ${evt.event_name}\n` +
            `Start Time: ${evt.startTime}\n` +
            `End Time: ${evt.endTime}\n` +
            `Location: ${evt.location}`;

        Alert.alert(
            "Event Details",
            eventDetails,
            [
                {
                    text: "Delete Event",
                    onPress: () => this.deleteEvent(evt.event_name, evt.day, evt.startTime, evt.endTime),
                    style: "destructive",
                },
                {
                    text: "OK",
                    style: "default",
                },
            ]
        );
    };

    render() {
        const { events } = this.state;

        /*
        if (events.length === 0) {
            return null; // or render a loading indicator
        }
        */

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TimeTableView
                        events={events}
                        pivotTime={8}
                        pivotEndTime={23}
                        pivotDate={genTimeBlock('mon')}
                        nDays={5}
                        onEventPress={this.handleEventPress}
                        headerStyle={styles.headerStyle}
                        formatDateHeader="dddd"
                    />
                </View>
                <View style={styles.button}>
                    <View style={styles.buttonwrapper}>
                        <Button
                            onPress={this.fetchEvents}
                            textColor='black'
                            mode='outlined'
                            style={styles.refresh}
                        >Refresh</Button>
                    </View>
                    <View style={styles.buttonwrapper}>
                        <Link href="/addevent">
                            <Button
                                textColor='black'
                                mode='outlined'
                            >Add an event</Button>
                        </Link>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: "black"
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 15,
    },
    buttonwrapper: {
        marginHorizontal: 8,
    }
})

/*
export default function ExistingTimetable() {
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setRefreshing(true);
        try {
            const { data, error } = await supabase.from('events').select('*');
            if (error) {
                console.error(error);
                return;
            }
            setEvents(data);
        } catch (error) {
            console.error(error);
        }
        setRefreshing(false);
    };

    const handleEventPress = (evt) => {
        const eventDetails = `Title: ${evt.title}\n` +
            `Start Time: ${evt.startTime}\n` +
            `End Time: ${evt.endTime}\n` +
            `Location: ${evt.location}`;

        Alert.alert("Event Details", eventDetails);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TimeTableView
                    events={events}
                    pivotTime={8}
                    pivotEndTime={23}
                    pivotDate={genTimeBlock('mon')}
                    nDays={7}
                    onEventPress={handleEventPress}
                    headerStyle={styles.headerStyle}
                    formatDateHeader="dddd"
                />
                <Button
                    mode="contained"
                    onPress={fetchEvents}
                    style={styles.button}
                >Refresh</Button>
                <Link href="/addevent">
                    <Button 
                        textColor="#272727"
                        mode='contained' 
                        style={styles.button}>Add an event</Button>
                </Link>
                <Link href="/(home)/index">
                    <Button 
                        textColor="#272727"
                        mode='contained' 
                        style={styles.button}>Go back</Button>
                </Link>
            </View>
        </SafeAreaView>
    );
}
*/

/*
function StackScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                options={{
                    title: 'My home',
                    headerStyle: {
                        backgroundColor: '#f4511e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack.Navigator>
    );
}
*/

/* 
export default class App extends Component {
    constructor(props) {
        super(props);
        this.numOfDays = 7;
        this.pivotDate = genTimeBlock('mon');
    }

const events_data = [
    {
        title: "Math",
        startTime: genTimeBlock("MON", 9),
        endTime: genTimeBlock("MON", 10, 50),
        location: "Classroom 403",
        extra_descriptions: ["Kim", "Lee"],
    },
    {
        title: "Math",
        startTime: genTimeBlock("WED", 9),
        endTime: genTimeBlock("WED", 10, 50),
        location: "Classroom 403",
        extra_descriptions: ["Kim", "Lee"],
    },
    {
        title: "Physics",
        startTime: genTimeBlock("MON", 11),
        endTime: genTimeBlock("MON", 11, 50),
        location: "Lab 404",
        extra_descriptions: ["Einstein"],
    },
    {
        title: "Physics",
        startTime: genTimeBlock("WED", 11),
        endTime: genTimeBlock("WED", 11, 50),
        location: "Lab 404",
        extra_descriptions: ["Einstein"],
    },
    {
        title: "Mandarin",
        startTime: genTimeBlock("TUE", 9),
        endTime: genTimeBlock("TUE", 10, 50),
        location: "Language Center",
        extra_descriptions: ["Chen"],
    },
    {
        title: "Japanese",
        startTime: genTimeBlock("FRI", 9),
        endTime: genTimeBlock("FRI", 10, 50),
        location: "Language Center",
        extra_descriptions: ["Nakamura"],
    },
    {
        title: "Club Activity",
        startTime: genTimeBlock("THU", 9),
        endTime: genTimeBlock("THU", 10, 50),
        location: "Activity Center",
    },
    {
        title: "Club Activity",
        startTime: genTimeBlock("FRI", 13, 30),
        endTime: genTimeBlock("FRI", 14, 50),
        location: "Activity Center",
    },
];
*/