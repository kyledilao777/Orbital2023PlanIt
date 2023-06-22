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
            backgroundColor: "#1D49A7",
            },
            headerTintColor: "#ffe",
            headerTitleStyle: {
            fontWeight: "bold"
            },
        }}>
        <Stack.Screen name ="addTimetable" options={{ headerShown: false }} />
      </Stack>

  );
}