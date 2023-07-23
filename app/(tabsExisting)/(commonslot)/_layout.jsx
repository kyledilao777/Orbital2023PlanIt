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
        <Stack.Screen name ="addCommonSlot" options={{ headerShown:false, backgroundColor:"white"}} />
        </Stack>
    );
}
