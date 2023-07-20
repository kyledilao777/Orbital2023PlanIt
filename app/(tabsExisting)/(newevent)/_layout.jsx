import { Stack } from "expo-router";

export default function App() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                backgroundColor: "white",
                },
                headerTitleStyle: {
                fontWeight: "bold"
                },
            }}
        >
        <Stack.Screen name ="addevent" options={{ headerShown:false }} />
        </Stack>
    );
}
