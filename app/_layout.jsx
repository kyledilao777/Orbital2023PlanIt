import { Slot } from "expo-router";
import { AuthProvider } from '../contexts/auth';

// if user is in login page, slot is replaced with contents of login page
// slot is replaced with the context of the index page (throughout the app)
// this provider is accessible throughout every component in the app
export default function Root() {
    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
}

/*
import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/auth";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    )
}
*/