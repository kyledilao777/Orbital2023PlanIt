import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router"
import { TouchableOpacity, View, Image, StyleSheet } from "react-native"

export default function TabsScreen() {
  const router = useRouter();
  return (
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "white",
            
          },
          headerTitleStyle: {
            fontWeight: "bold",
            color: "black",
            fontSize:40,
            height:50,
            marginTop:35,
            marginLeft:10,
          },
          headerShadowVisible: false,
          headerTitleAlign:'left'
        }}
      >
        <Tabs.Screen 
            name ="existing" 
            options = {{ 
              title: "Home",
              headerRight: () => (
                <View>
                  <TouchableOpacity style={styles.button} onPress={() => router.push("../(sync)/syncHold")} activeOpacity = {0.5}>
                    <Image source={require('./images/bell.png')} style={{marginRight:35, marginTop:35, height:25, width:25, resizeMode:"cover"}}/>
                  </TouchableOpacity>
                </View>
              ),
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

const styles = StyleSheet.create({
  button: { 
      alignItems: "right"
  },
})

