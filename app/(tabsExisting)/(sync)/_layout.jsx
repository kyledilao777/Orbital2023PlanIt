import { Stack } from "expo-router";

export default function App() {
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
        <Stack.Screen name ="sync" options={{ headerShown:false }} />
        <Stack.Screen name ="syncList" options={{ headerShown:false }} />
        </Stack>
    );
}
