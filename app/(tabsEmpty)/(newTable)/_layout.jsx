import { Stack, Component,useLocalSearchParams } from "expo-router";
import { React, useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { Text } from "react-native";

export const unstable_settings = {
  initialRouteName: 'existing',
};

export default () => {
  return (
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
            
          },
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
        }}>
        <Stack.Screen name ="addTimetable" options={{ headerShown: false }} />
      </Stack>

  );
}