import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: 'login',
};

// to go back to the login page
export default function AuthRoot() {
    return (
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
            <Stack.Screen name ="register" options={{ title: "New User" }} />
            <Stack.Screen name ="login" options={{ headerShown: false }} />
        </Stack>
    );
}