import { Stack } from "expo-router";

export const unstable_settings = {
    initialRouteName: 'login',
};

// to go back to the login page
export default function AuthRoot() {
    return (
        <Stack />
    );
}
