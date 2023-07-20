import { Slot, Tabs, Stack} from "expo-router";
import { AuthProvider } from '../contexts/auth';
import { Button } from "react-native-paper";
import { supabase } from "../lib/supabase";
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';

// if user is in login page, slot is replaced with contents of login page
// slot is replaced with the context of the index page (throughout the app)
// this provider is accessible throughout every component in the app

export default function Root() {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data;
      if (url) {
        router.push(url);
      }
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

    return (
        <AuthProvider>
            <Stack
              initialRouteName="index"
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
            <Stack.Screen name ="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name ="(tabsEmpty)" options={{ headerShown: false }} />
            <Stack.Screen name ="(tabsExisting)" options={{ headerShown: false }} />
            <Stack.Screen name ="index" options={{ headerShown: false }} />
            </Stack>
            
            
        </AuthProvider>
    );
}