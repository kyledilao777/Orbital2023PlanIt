import { useRouter, useSegments } from "expo-router";

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

/* useContext returns the data from the context we pass it into */
export function useAuth() {
    return useContext(AuthContext);
}

function useProtectedRoute(user) {
    const segments = useSegments(); // split up url into parts
    const router = useRouter();

    useEffect(() => {
        console.log(`useProtectedRoute useEffect called`);
        console.log(`${segments[0]}`);
        const inAuthGroup = segments[0] === "(auth)" // check if you are in the auth group (if there's a segment in url called auth)
        if (!user && !inAuthGroup) { // if user is not logged in (== null) and not in the auth group -> redirect to register page
            console.log(`inAuthGroup: ${inAuthGroup}`);
            router.replace("/login"); // redirect to login page
        } else if (user && inAuthGroup) { // if user is logged in and in auth group (in /login or /register)
            router.replace("/"); // send back to root page
        }
    }, [user, router, segments]); // pass as dependecies to useEffect; only called when user changes
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    useProtectedRoute(user); // check state of user as seen above

    useEffect(() => {
        console.log(`AuthProvider useEffect called`);
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`onAuthStateChange event: ${event}`);
            if (event === "SIGNED_IN") {
                setUser(session.user);
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        })
        return () => data.subscription.unsubscribe();
    }, []);

    return <AuthContext.Provider value={{ user }}>{children}</ AuthContext.Provider>
}