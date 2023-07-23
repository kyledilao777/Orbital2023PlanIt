import { Component, Stack } from "expo-router";
import { React } from "react";

export default function App() {
  return(
    <Stack
      screenOptions={{
        headerStyle: {
        backgroundColor: "white",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color:"black"
        },
     }}
    >
    
    <Stack.Screen name ="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name="(newTable)" options={{ headerTitle: "Add New Timetable" }} />
    </Stack>
  )
}