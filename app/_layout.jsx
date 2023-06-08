import { Slot, Stack } from "expo-router";
import { AuthProvider } from '../contexts/auth';
// if user is in login page, slot is replaced with contents of login page
// slot is replaced with the context of the index page (throughout the app)
// this provider is accessible throughout every component in the app
export default function Root() {
    return (
        <AuthProvider>
             <Stack
                initialRouteName="home"
                screenOptions={{
                    headerStyle: {
                    backgroundColor: "#1D49A7",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                    fontWeight: "bold",
                    },
                }}
            >
                <Stack.Screen name="home" options={{}} />
            </Stack>
        </AuthProvider>
    );
}