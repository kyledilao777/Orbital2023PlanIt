import { Tabs } from "expo-router";

export default function HomeScreen() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
            <Tabs.Screen name="notifications" options={{ title: "Notifications" }} />
            <Tabs.Screen name="editprofile" options={{ title: "Edit Profile" }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" }}/>
        </Tabs>
    );
}