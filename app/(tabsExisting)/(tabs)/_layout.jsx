import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabsScreen() {
  return (
      <Tabs
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
        <Tabs.Screen 
            name ="existing" 
            options = {{ 
              title: "Home",
              tabBarIcon: () => <FontAwesome name="home" size={24} color="black"/>, 
            }}    
        />
        <Tabs.Screen name ="profile" options = {{ 
              title: "Profile",
              tabBarIcon: () => <FontAwesome name="user" size={24} color="black"/>, 
            }} 
        />
      </Tabs>
  )
}