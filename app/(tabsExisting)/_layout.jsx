import { Component, Stack } from "expo-router";
import { React } from "react";


export default function App() {
  return(
    <Stack
      screenOptions={{
        headerStyle: {
        backgroundColor: "#1D49A7",
        },
       headerTintColor: "#ffe",
        headerTitleStyle: {
        fontWeight: "bold"
        },
      }}
    >
    
    <Stack.Screen name ="(tabs)" options={{ headerShown: false }} />
    <Stack.Screen name ="(sync)" options={{ headerTitle: "Synchronisation" }} />
    <Stack.Screen name ="(newevent)" options={{ headerTitle: "Add New Event" }} />
    </Stack>
  )
}