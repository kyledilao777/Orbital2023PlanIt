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
    <Stack.Screen name ="(sync)" options={{ headerTitle: "Synchronisation"}} />
    <Stack.Screen name ="(newevent)" options={{ headerTitle: "Add New Event" }} />
    <Stack.Screen name ="(commonslot)" options={{ headerTitle: "Add a Common Slot" }} />
    </Stack>
  )
}