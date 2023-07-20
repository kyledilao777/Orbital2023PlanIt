import { Stack } from "expo-router";

export default function App() {
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
        <Stack.Screen name ="sync" options={{ headerShown: false }} />
        <Stack.Screen name ="syncRequest" options = {{ headerShown: false }} />
        <Stack.Screen name ="syncList" options = {{ headerShown: false }} />
        <Stack.Screen name ="syncHold" options = {{ headerShown: false }} />
        </Stack>
    );
}
