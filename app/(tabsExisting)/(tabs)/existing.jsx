import { React, Component, useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  FlatList,
} from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { Link } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "expo-router";
import { Button } from "react-native-paper";
import { useAuth } from "../../../contexts/auth";

export default function ExistingScreen() {
  const numOfDays = 5;
  const pivotDate = genTimeBlock('mon');
  const [ref, setScrollViewRef] = useState("");
  const [name, setName] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [obj, setObj] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  //loading table
  useEffect(() => {
    async function fetchName() {
      setRefreshing(true);
      let { data } = await supabase.from('timetables')
        .select('*')
        .eq("user_id", user.id)
      setRefreshing(false);
      setName(data);
    }
    
    fetchName(); fetchEvents();
  }, [events]);

  const fetchEvents = async () => {
      setRefreshing(true);

      try {
          let { data, error } = await supabase.from('events')
            .select("*")
            .eq("user_id", user.id)

          if (error) {
              console.error(error);
              return;
          }

          let eventslist = [];

          for (var j = 0; j < data.length; j++) {
            var obj = data[j]; 
            
            obj = {
                event_name: obj.event_name,
                user_id: user.id,
                day: obj.day,
                startTime: obj.startTime,
                endTime: obj.endTime,
                location: obj.location,
                extra_descriptions: obj.extra_descriptions,
                email: user.email,
                timetable_id: obj.table_id
            }

            var evt = { 
              day: obj.day,
              fullStart: obj.startTime,
              fullEnd: obj.endTime,
              title: obj.event_name,
              startTime: genTimeBlock(obj.day, parseInt(obj.startTime.substring(11,13)) + 8),
              endTime: genTimeBlock(obj.day, parseInt(obj.endTime.substring(11,13)) + 8),
              location: obj.location,
              extra_descriptions: obj.extra_descriptions,
            };

            eventslist.push(evt);
          }

          setEvents(eventslist);

      } catch (error) {
          console.error(error);
      }
      setRefreshing(false);   

  };

  //sync timetables
  const handleSyncPress = () => {
    router.push("../(sync)/sync");
  }

  //delete a single event
  const handleEventPress = (evt) => {
    const startTime = evt.startTime.toString().substring(16,18) + evt.startTime.toString().substring(19,21); 
    const endTime = evt.endTime.toString().substring(16,18) + evt.endTime.toString().substring(19,21);

    const eventDetails = `Event Name: ${evt.title}\n` +
        `Start Time: ${startTime.length == 3 ? "0" + startTime : startTime} hrs \n` +
        `End Time: ${endTime.length == 3 ? "0" + endTime : endTime} hrs \n` +
        `Location: ${evt.location} \n` + 
        `Remarks: ${evt.extra_descriptions.length == 0 ? "NIL" : evt.extra_descriptions}`

    Alert.alert(
        "Event Details",
        eventDetails,
        [
            {
                text: "Delete Event",
                onPress: () => deleteEvent(evt.day, evt.fullStart, evt.fullEnd),
                style: "destructive",
            },
            {
                text: "OK",
                style: "default",
            },
        ]
    );
  };

  
  const deleteEvent = async (day, startTime, endTime) => {
      try {
          // eq('column name', value to compare against)
          const { error } = await supabase.from('events')
              .delete()
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
              fetchEvents();
          }
      } catch (error) {
          // Handle error
          console.error(error);
      }
  };

  //delete a single Timetable
  const handleDeletePress = async () => {
    Alert.alert(
        "Confirm Delete?",
        `Are you sure you want to delete "${name.map((name) => name.timetable_name)}" ?`,
        [
            {
                text: "Delete",
                onPress: () => deleteTable(),
                style: "destructive",
            },
            {
                text: "Cancel",
                style: "default",
            },
        ]
    );
  };

  
  const deleteTable = async () => {
    try {
      const { error } = await supabase.from('timetables')
        .delete()
        .eq("user_id", user.id)

        if (error) {
          // Handle error
          console.error(error);
        } else {
            // Table deleted successfully
            Alert.alert('Timetable deleted!');
            router.push("../../(tabsEmpty)/empty");
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.header}>
        {name.map((name) => <Text key="{name}" style={styles.timetablename}>{name.timetable_name}</Text>)}
          <View style={styles.syncButtonWrapper}>
            <Button 
              mode="contained" 
              textColor="#6ba1c4"
              onPress={handleSyncPress}
              style={styles.headerButtons}
            > 
            Sync
            </Button>
        </View>
        <View style={styles.deleteButtonWrapper}>
            <Button 
              mode="contained" 
              textColor="red"
              onPress={handleDeletePress}
              style={styles.headerButtons}
            > 
            Delete
            </Button>
        </View>
      </View>
      <View style={styles.container}>
          <TimeTableView
            events={events}
            pivotTime={8}
            pivotEndTime={23}
            pivotDate={genTimeBlock('mon')}
            nDays={5}
            onEventPress={handleEventPress}
            headerStyle={styles.headerStyle}
            formatDateHeader="dddd"
          />
      </View>
        <View style={styles.buttonWrapper}>
          <Link href="/addevent">
            <Button
              textColor='black'
              mode='outlined'
            >Add an event</Button>
          </Link>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  timetablename:{
    fontSize: 20,
    marginLeft:5,
    marginTop:10,
    marginBottom:10,
    width: "100%",
    fontFamily: 'Arial'
  },
  header:{
    width:"100%",
  },
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
  syncButtonWrapper:{
    marginLeft:200,
    marginTop:-40,
  },
  deleteButtonWrapper:{
    marginLeft:300,
    marginTop:-40,
  },
  headerButtons:{
    backgroundColor:"transparent"
  },
  buttonWrapper: {
    paddingVertical: 15,
    marginHorizontal: 15,
  }
})

