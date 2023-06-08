import { React, Component, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Text,
} from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { Link, Stack } from "expo-router";
import { useGlobalSearchParams, useRouter } from "expo-router";

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

export default function existingScreen() {
  const numOfDays = 5;
  const pivotDate = genTimeBlock('mon');
  const [ref, scrollViewRef] = useState("");
  const router = useRouter();
  const params = useGlobalSearchParams();
  
  return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
            <Stack.Screen
              options={{
                headerTitle: params.name,
              }}
          />
          <TimeTableView
            scrollViewRef={(ref) => scrollViewRef(ref)}
            events={events_data}
            pivotTime={9}
            pivotEndTime={20}
            pivotDate={this.pivotDate}
            nDays={this.numOfDays}
            onEventPress={(evt) => {
              Alert.alert("onEventPress", JSON.stringify(evt))}}
            headerStyle={styles.headerStyle}
            formatDateHeader="dddd"
          />
        </View>
      </SafeAreaView>
    );
};
  

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: "black"
  },
  container: {
    paddingLeft:5,
    paddingRight:5,
    paddingBottom:50,
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
});

