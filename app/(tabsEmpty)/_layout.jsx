import { Component, Stack } from "expo-router";
import { React } from "react";

export default function App() {
  return(
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
          
        },
        headerTitle: "Add New Timetable",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "black",
          fontSize:40,
          height:50,
          marginTop:35,
          marginLeft:10,
        },
        headerShadowVisible: false,
        headerTitleAlign:'left'
      }}
    >
    
    <Stack.Screen name ="(tabs)" options={{ headerShown: false }} />
    </Stack>
  )
}