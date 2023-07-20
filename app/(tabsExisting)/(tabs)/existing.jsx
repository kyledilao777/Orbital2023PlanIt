import { React, Component, useState, useEffect } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
  FlatList,
  TouchableHighlight
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
                onPress: () => deleteEvent(evt.title, evt.day, evt.fullStart, evt.fullEnd),
                style: "destructive",
            },
            {
                text: "OK",
                style: "default",
            },
        ]
    );
  };

  
  const deleteEvent = async (name, day, startTime, endTime) => {
      try {
          // eq('column name', value to compare against)
          const { error } = await supabase.from('events')
              .delete()
              .eq('event_name', name)
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
    <SafeAreaView style={{flex: 1, backgroundColor:"white"}}>
      <View style={styles.header}>
        <View style={styles.ttnameview}>
           {name.map((name) => <Text key="{name}" style={styles.timetablename}>{name.timetable_name}</Text>)}
        </View>
        <View style={styles.addButtonWrapper}>
          <Button
            textColor="#6ba1c4"
            compact="true"
            onPress={() => {router.push("/addevent")}}
            style={styles.add}
            >Add Event</Button>
        </View>
        <View style={styles.syncButtonWrapper}>
          <Button 
            textColor="#6ba1c4"
            compact="true"
            onPress={handleSyncPress}
            style={styles.sync}
          > 
          Sync
          </Button>
        </View>
        <View style={styles.deleteButtonWrapper}>
          <Button 
            textColor="red"
            compact="true"
            onPress={handleDeletePress}
            style={styles.delete}
          > 
          Delete
          </Button>
        </View>
      </View>
      <View style={styles.container}>
          <TimeTableView
            events={events}
            pivotTime={8}
            pivotEndTime={22}
            pivotDate={genTimeBlock('mon')}
            nDays={5}
            onEventPress={handleEventPress}
            headerStyle={styles.headerStyle}
            formatDateHeader="dddd"
          />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ttnameview:{
    marginLeft:28,
  },
  timetablename:{
    fontSize: 20,
    width: "100%",
    textAlign:'left',
    fontFamily: 'Arial'
  },
  header:{
    width:"100%",
    marginTop:20,
  },
  headerStyle: {
      backgroundColor: "black",
  },
  container: {
      flex: 1,
      marginTop:5,
      backgroundColor: 'white',
  },
  button: {
      marginHorizontal: 5,
  },
  buttonWrapper: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    marginVertical:-240,
  },
  addButtonWrapper:{
    marginLeft:181,
    marginTop:-30,
  },
  syncButtonWrapper:{
    marginLeft:266,
    marginTop:-38,
  },
  deleteButtonWrapper:{
    marginLeft:313,
    marginTop:-38,
  },
  delete:{
    backgroundColor:"transparent",
    width:70,
  },
  sync:{
    backgroundColor:"transparent",
    width:60,
  },
  add:{
    backgroundColor:"transparent",
    width:100,
  }
});