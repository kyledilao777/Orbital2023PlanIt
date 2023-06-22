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
                backgroundColor: "#1D49A7",
                },
                headerTintColor: "#ffe",
                headerTitleStyle: {
                fontWeight: "bold"
                },
            }}
        >
            <Stack.Screen name ="register" options={{ title: "New User" }} />
            <Stack.Screen name ="login" options={{ headerShown: false }} />
        </Stack>
    );
}
