/* import { Pressable, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import TimeTableView from 'react-native-timetable';

export default function TimetableScreen() {
    constructor(props) {
        super(props);
        this.numOfDays = 7;
        this.pivotDate = genTimeBlock('mon');
    }

    onEventPress = (evt) => {
        const eventDetails = `Title: ${evt.title}\n` +
            `Start Time: ${evt.startTime}\n` +
            `End Time: ${evt.endTime}\n` +
            `Location: ${evt.location}`;

        Alert.alert("Event Details", eventDetails);
    };

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <TimeTableView
                        scrollViewRef={this.scrollViewRef}
                        events={events}
                        pivotTime={8}
                        pivotEndTime={23}
                        pivotDate={this.pivotDate}
                        nDays={this.numOfDays}
                        onEventPress={this.onEventPress}
                        headerStyle={styles.headerStyle}
                        formatDateHeader="dddd"
                    />
                    <Button>Add a new event</Button>
                </View>
            </SafeAreaView>
        );
    }
}
*/

/* 
    const [events, setEvents] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    async function fetchEvents() {
        setRefreshing(true);
        let { data } = await supabase.from('events').select('*');
        setEvents(data);
        setRefreshing(false);
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        if (refreshing) {
            fetchEvents(); // if the app is refreshing, fetchEvents again
            setRefreshing(false);
        }
    }, [refreshing]); // check the value of refresh first, initially false so won't execute

    <TimeTableView
        data={events}
        renderItem={({ item }) => <Events todo={item} />}
        onRefresh={() => setRefreshing(true)}
        refreshing={refreshing}
    />
*/

/*
function Events({ event }) {
    const router = useRouter();
    const handleItemPress = () => {
        router.push({ pathname: '/detailedTodo', params: { id: event.id } })
    }
    return (
        <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handleItemPress}>
            <Text>{event.event_name}</Text>
        </Pressable>
    )
}
*/