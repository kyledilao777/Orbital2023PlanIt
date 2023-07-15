import { Slot, Tabs, Stack} from "expo-router";
import { AuthProvider } from '../contexts/auth';
import { Button } from "react-native-paper";
import { supabase } from "../lib/supabase";

// if user is in login page, slot is replaced with contents of login page
// slot is replaced with the context of the index page (throughout the app)
// this provider is accessible throughout every component in the app

export default function Root() {
    return (
        <AuthProvider>
            <Stack
              initialRouteName="index"
                screenOptions={{
                    headerStyle: {
                    backgroundColor: "#1D49A7",
                    },
                    headerTintColor: "#ffe",
                    headerTitle: "Home",
                    headerTitleStyle: {
                    fontWeight: "bold",
                    },
                }}
            > 
            <Stack.Screen name ="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name ="(tabsEmpty)" options={{ headerShown: false }} />
            <Stack.Screen name ="(tabsExisting)" options={{ headerShown: false }} />
            <Stack.Screen name ="index" options={{ headerShown: false }} />
            </Stack>
            
        </AuthProvider>
    );
}